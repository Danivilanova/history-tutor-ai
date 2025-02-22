
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useConversation } from '@11labs/react';
import SpeakingIndicator from '@/components/SpeakingIndicator';
import LessonHeader from '@/components/lesson/LessonHeader';
import SlideContent from '@/components/lesson/SlideContent';
import QuizContent from '@/components/lesson/QuizContent';
import { supabase } from "@/integrations/supabase/client";

interface LessonSection {
  id: string;
  title: string;
  content: string;
  section_type: 'intro' | 'point' | 'conclusion';
  order_index: number;
}

interface GeneratedContent {
  generated_text: string;
  generated_image_url: string;
}

const QUIZ_DATA = {
  quiz: [
    {
      question: "When did the Western Roman Empire officially end?",
      options: ["476 AD", "410 AD", "455 AD", "500 AD"],
      correct: "476 AD"
    },
    {
      question: "Which Germanic chieftain deposed the last Roman emperor?",
      options: ["Odoacer", "Alaric", "Attila", "Gaiseric"],
      correct: "Odoacer"
    },
    {
      question: "What percentage of Rome's population were slaves by the 2nd century AD?",
      options: ["30-40%", "10-20%", "50-60%", "70-80%"],
      correct: "30-40%"
    }
  ]
};

const TUTOR_AGENTS = {
  funny: {
    id: "XgEPMPMknaQUnTTle5TN",
    prompt: "You are a fun and entertaining tutor who uses humor to make learning engaging. You make jokes and keep the mood light while teaching history effectively.",
    firstMessage: "Hey there! Ready to make history fun? Let's dive into this exciting topic with some laughs along the way!",
  },
  strict: {
    id: "CF9oLSxkWjupoRyRJQg0",
    prompt: "You are a strict and disciplined tutor who emphasizes accuracy and attention to detail. You maintain high standards while teaching history.",
    firstMessage: "Welcome to your history lesson. We'll proceed systematically through this important topic. Pay close attention.",
  },
  friendly: {
    id: "vAElDozxD5rk5YtoPvRw",
    prompt: "You are a friendly and supportive tutor who makes history accessible and engaging. You encourage questions and create a comfortable learning environment.",
    firstMessage: "Hello! I'm excited to explore this fascinating historical topic with you. Let's learn together!",
  }
};

async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch {
    console.error('Microphone permission denied')
    return false
  }
}

async function getSignedUrl(agentId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('get-signed-url', {
    body: { agentId }
  });
  if (error) {
    console.error('Error getting signed URL:', error);
    throw new Error('Failed to get signed URL');
  }
  if (!data || !data.signedUrl) {
    throw new Error('Invalid response: signedUrl not found');
  }
  return data.signedUrl;
}

const LessonScreen = () => {
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const tutorPersonality = (location.state?.personality || 'friendly') as keyof typeof TUTOR_AGENTS;
  const selectedAgent = TUTOR_AGENTS[tutorPersonality];

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      setIsSpeaking(false);
    },
    onMessage: (message) => {
      console.log("Message from AI:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast.error("Error with voice interaction");
    }
  });

  const lessonTitle = location.state?.title || "The Fall of Rome";

  const { data: sections, isLoading } = useQuery({
    queryKey: ['lessonSections', lessonTitle],
    queryFn: async () => {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('title', lessonTitle)
        .single();

      if (!lesson) throw new Error('Lesson not found');

      const { data } = await supabase
        .from('lesson_sections')
        .select('*, generated_content(*)')
        .eq('lesson_id', lesson.id)
        .order('order_index');

      return data as (LessonSection & { generated_content: GeneratedContent[] })[];
    }
  });

  // Commenting out the generate content mutation for now
  /*const generateContent = useMutation({
    mutationFn: async (sectionId: string) => {
      const { data, error } = await supabase.functions.invoke('generate-lesson-content', {
        body: { sectionId },
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Generated new content for this section');
    },
    onError: (error) => {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    }
  });*/

  async function requestMicrophonePermission() {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      return true
    } catch {
      console.error('Microphone permission denied')
      return false
    }
  }

  const startConversation = async () => {
    try {
      // Request microphone access first
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        alert("No permission")
        return;
      }

      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('get-signed-url', {
        body: { agentId: selectedAgent.id }
      });

      if (error) {
        console.error('Error getting signed URL:', error);
        throw new Error('Failed to get signed URL');
      }

      // Start the conversation with the signed URL
      const conversationId = await conversation.startSession({
        signedUrl: data.signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: selectedAgent.prompt
            },
            firstMessage: selectedAgent.firstMessage
          }
        }
      });

      console.log('Started conversation:', conversationId);
      setIsSpeaking(true);
      conversation.setVolume({ volume });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start voice interaction');
    }
  };

  const endConversation = async () => {
    if (!conversation) {
      return
    }
    await conversation.endSession()
  }

  useEffect(() => {
    if (sections && sections.length > 0 && currentSlide < sections.length && !isMuted) {
      const currentSection = sections[currentSlide];
      
      startConversation();

      // Comment out content generation
      /*if (!currentSection.generated_content?.length) {
        generateContent.mutate(currentSection.id);
      }*/
    }

    return () => {
      endConversation().catch(console.error);
    };
  }, [currentSlide, sections, isMuted]);

  useEffect(() => {
    conversation.setVolume({ volume });
  }, [volume]);

  useEffect(() => {
    if (isMuted) {
      startConversation();
    } else {
      endConversation();
    }
  }, [isMuted]);

  const startQuiz = () => {
    setIsQuizMode(true);
    setCurrentQuiz(0);
    if (!isMuted) {
      startConversation();
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (currentQuiz >= QUIZ_DATA.quiz.length) return;
    
    const isCorrect = answer === QUIZ_DATA.quiz[currentQuiz].correct;
    setFeedback(isCorrect ? "Correct!" : "Not quite. Let's try the next one.");
    
    if (!isMuted) {
      startConversation();
    }
    
    setTimeout(() => {
      setFeedback('');
      if (currentQuiz < QUIZ_DATA.quiz.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setIsComplete(true);
        toast.success("Congratulations! You've completed the lesson!");
      }
    }, 3000);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    conversation.setVolume({ volume: newVolume });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-pulse">Loading lesson content...</div>
      </div>
    );
  }

  const currentProgress = isQuizMode 
    ? (sections?.length || 0) + currentQuiz + 1 
    : currentSlide + 1;
  const totalSteps = (sections?.length || 0) + QUIZ_DATA.quiz.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto relative min-h-screen p-2 sm:p-4 flex flex-col">
        <div className="py-2 animate-fade-in">
          <LessonHeader 
            title={lessonTitle}
            isMuted={isMuted}
            volume={volume}
            onMuteToggle={() => setIsMuted(!isMuted)}
            onVolumeChange={handleVolumeChange}
          />

          <div className="relative h-2 bg-muted rounded-full mb-4 overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 rounded-full"
              style={{ 
                width: `${(currentProgress / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        <Card className="flex-1 flex flex-col relative overflow-hidden backdrop-blur-sm bg-card/80 border-primary/10 animate-fade-in-scale mt-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <SpeakingIndicator isActive={isSpeaking} />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            {!isQuizMode && sections && sections[currentSlide] ? (
              <SlideContent 
                text={sections[currentSlide].generated_content?.length > 0 
                  ? sections[currentSlide].generated_content[0].generated_text 
                  : sections[currentSlide].content}
                image={sections[currentSlide].generated_content?.length > 0 
                  ? sections[currentSlide].generated_content[0].generated_image_url 
                  : undefined}
              />
            ) : (
              <QuizContent 
                isComplete={isComplete}
                currentQuiz={currentQuiz}
                quiz={QUIZ_DATA.quiz}
                feedback={feedback}
                onAnswerSubmit={handleQuizAnswer}
              />
            )}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
        </Card>
      </div>
    </div>
  );
};

export default LessonScreen;
