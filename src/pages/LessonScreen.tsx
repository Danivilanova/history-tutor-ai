
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Get lesson title from URL state
  const lessonTitle = location.state?.title || "The Fall of Rome";

  // Fetch lesson sections
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

  // Generate content mutation
  const generateContent = useMutation({
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
  });

  const playAudio = async (text: string) => {
    if (isMuted) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (error) throw error;

      if (data.audio) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.volume = volume;
          await audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio');
    }
  };

  useEffect(() => {
    if (sections && sections.length > 0 && currentSlide < sections.length && !isMuted) {
      setIsSpeaking(true);
      const currentSection = sections[currentSlide];
      const textToSpeak = currentSection.generated_content?.length > 0 
        ? currentSection.generated_content[0].generated_text 
        : currentSection.content;
      
      playAudio(textToSpeak).then(() => {
        if (audioRef.current) {
          audioRef.current.onended = () => {
            setIsSpeaking(false);
            if (currentSlide < sections.length - 1) {
              setCurrentSlide(prev => prev + 1);
            } else {
              startQuiz();
            }
          };
        }
      });

      // Generate content if it doesn't exist
      if (!currentSection.generated_content?.length) {
        generateContent.mutate(currentSection.id);
      }
    }
  }, [currentSlide, sections, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const startQuiz = () => {
    setIsQuizMode(true);
    setIsSpeaking(true);
    setCurrentQuiz(0);
    if (!isMuted) {
      playAudio("Let's test your knowledge with a quiz.");
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (currentQuiz >= SAMPLE_LESSON.quiz.length) return;
    
    const isCorrect = answer === SAMPLE_LESSON.quiz[currentQuiz].correct;
    setFeedback(isCorrect ? "Correct!" : "Not quite. Let's try the next one.");
    
    if (!isMuted) {
      playAudio(isCorrect ? "Correct! Well done!" : "Not quite. Let's try the next one.");
    }
    
    setTimeout(() => {
      setFeedback('');
      if (currentQuiz < SAMPLE_LESSON.quiz.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setIsComplete(true);
        toast.success("Congratulations! You've completed the lesson.");
        if (!isMuted) {
          playAudio("Congratulations! You've completed the lesson.");
        }
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
  const totalSteps = (sections?.length || 0) + (SAMPLE_LESSON.quiz?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <audio ref={audioRef} />
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
                quiz={SAMPLE_LESSON.quiz}
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
