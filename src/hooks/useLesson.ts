
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
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isConversationStarted, setIsConversationStarted] = useState(false);

  console.log('useLesson - Initializing with agent:', {
    name: selectedAgent.name,
    sectionsCount: sections?.length
  });

  const { startConversation } = useConversationHandler(
    selectedAgent,
    sections,
    () => {
      setIsConversationStarted(true);
      setCurrentSlide({ text: '', imageUrl: '' });
    },
    (speaking) => setIsSpeaking(speaking),
    volume,
    (text, imageUrl) => {
      setCurrentSlide({ text, imageUrl });
    }
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
    isMuted,
    volume,
    isConversationStarted,
    startConversation,
    handleVolumeChange,
  };
}
