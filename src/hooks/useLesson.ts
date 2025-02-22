
import { useState } from 'react';
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';
import { getSignedUrl, requestMicrophonePermission } from '@/utils/lessonUtils';
import { TutorAgent, QuizQuestion } from '@/types/lesson';
import { supabase } from '@/integrations/supabase/client';

export function useLesson(selectedAgent: TutorAgent, sections?: any[]) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  console.log('useLesson - Initializing with agent:', {
    name: selectedAgent.name,
    id: selectedAgent.id,
    sectionsCount: sections?.length
  });

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs with agent:", selectedAgent.name);
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

  const startConversation = async () => {
    try {
      console.log('Starting conversation with agent:', {
        name: selectedAgent.name,
        id: selectedAgent.id
      });

      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        console.error('Microphone permission denied');
        toast.error("Microphone permission is required for voice interaction");
        return;
      }

      const signedUrl = await getSignedUrl(selectedAgent.id);
      console.log('Got signed URL for voice ID:', selectedAgent.id);

      const lessonContent = sections?.map(section => {
        return `${section.title}:\n${section.content}`;
      }).join('\n\n');

      const enhancedPrompt = `
${selectedAgent.prompt}

I am ${selectedAgent.name}, and here is the lesson content I will be teaching:

${lessonContent}

Important instructions:
1. For every new concept or section I'm about to explain, I MUST first use the 'generateSlide' tool to create a visual representation. The format should be:
   - Call 'generateSlide' with the text and the image description that will be used to generate the visual aid
   - Wait for the slide to be generated
   - Then explain the concept while referencing the visual aid
2. Throughout the lesson, I should maintain my assigned teaching style while using the student's name appropriately.

Remember to:
- Always use 'generateSlide' before explaining a new concept
- Teach the content in my assigned style while maintaining accuracy
- Break down complex concepts and encourage questions
- Always refer to myself as ${selectedAgent.name} when introducing myself or when it feels natural in conversation
- Reference the visual aids I create to enhance understanding
`;

      console.log('Starting ElevenLabs session with prompt length:', enhancedPrompt.length);

      const conversationId = await conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: enhancedPrompt
            },
            firstMessage: selectedAgent.firstMessage
          }
        },
        clientTools: {
          generateSlide: async ({ text, image_description }) => {
            console.log("Generating slide with text:", text, "and image description:", image_description);
            // The slide generation happens automatically based on the message
            // The UI will update to show the new slide
            return "Slide generated successfully";
          }
        },
      });

      console.log('Conversation started with ID:', conversationId);

      setIsConversationStarted(true);
      setIsSpeaking(true);
      conversation.setVolume({ volume });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start voice interaction');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    if (conversation) {
      conversation.setVolume({ volume: newVolume });
    }
  };

  const startQuiz = async (lessonId: string) => {
    try {
      const { data: questions, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (error) throw error;

      setQuizQuestions(questions as QuizQuestion[]);
      setIsQuizMode(true);
      setCurrentQuiz(0);
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
      toast.error('Failed to load quiz questions');
    }
  };

  const handleQuizAnswer = (answer: string) => {
    if (currentQuiz >= quizQuestions.length) return;

    const isCorrect = answer === quizQuestions[currentQuiz].correct_answer;
    setFeedback(isCorrect ? "Correct!" : "Not quite. Let's try the next one.");

    setTimeout(() => {
      setFeedback('');
      if (currentQuiz < quizQuestions.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setIsComplete(true);
        toast.success("Congratulations! You've completed the lesson!");
      }
    }, 3000);
  };

  return {
    currentSlide,
    isSpeaking,
    isQuizMode,
    currentQuiz,
    isMuted,
    volume,
    feedback,
    isComplete,
    isConversationStarted,
    quizQuestions,
    startConversation,
    handleVolumeChange,
    startQuiz,
    handleQuizAnswer,
  };
}
