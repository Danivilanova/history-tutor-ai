
import { useState } from 'react';
import { TutorAgent } from '@/types/lesson';
import { useConversationHandler } from './useConversationHandler';
import { useQuizHandler } from './useQuizHandler';

interface CurrentSlide {
  text: string;
  imageUrl: string;
}

export function useLesson(selectedAgent: TutorAgent, sections?: any[]) {
  const [currentSlide, setCurrentSlide] = useState<CurrentSlide | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isConversationStarted, setIsConversationStarted] = useState(false);

  console.log('useLesson - Initializing with agent:', {
    name: selectedAgent.name,
    id: selectedAgent.id,
    sectionsCount: sections?.length
  });

  const {
    isQuizMode,
    currentQuiz,
    feedback,
    isComplete,
    quizQuestions,
    startQuiz,
    handleQuizAnswer
  } = useQuizHandler();

  const { startConversation } = useConversationHandler(
    selectedAgent,
    sections,
    () => setIsConversationStarted(true),
    (speaking) => setIsSpeaking(speaking),
    volume,
    (text, imageUrl) => setCurrentSlide({ text, imageUrl })
  );

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
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
