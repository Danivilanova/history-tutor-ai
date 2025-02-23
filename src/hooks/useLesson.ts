
import { useState } from 'react';
import { TutorAgent } from '@/types/lesson';
import { useConversationHandler } from './useConversationHandler';

interface CurrentSlide {
  text: string;
  imageUrl: string;
}

export function useLesson(selectedAgent: TutorAgent, sections?: any[]) {
  const [currentSlide, setCurrentSlide] = useState<CurrentSlide>({ text: '', imageUrl: '' });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  console.log('useLesson - Initializing with agent:', {
    name: selectedAgent.name,
    sectionsCount: sections?.length
  });

  const { startConversation, conversation } = useConversationHandler(
    selectedAgent,
    sections,
    () => {
      setIsConversationStarted(true);
      setCurrentSlide({ text: '', imageUrl: '' });
    },
    (speaking) => setIsSpeaking(speaking),
    0.5,
    (text, imageUrl) => {
      setCurrentSlide({ text, imageUrl });
    },
    () => setIsLessonComplete(true)
  );

  const endLesson = async () => {
    if (conversation) {
      setIsLessonComplete(true);
      await conversation.endSession();
    }
  };

  return {
    currentSlide,
    isSpeaking,
    isConversationStarted,
    isLessonComplete,
    startConversation,
    endLesson,
  };
}
