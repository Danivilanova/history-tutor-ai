
import { useState } from 'react';
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';
import { getSignedUrl, requestMicrophonePermission } from '@/utils/lessonUtils';
import { TutorAgent } from '@/types/lesson';

export function useLesson(selectedAgent: TutorAgent) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);

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

  const startConversation = async () => {
    try {
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        toast.error("Microphone permission is required for voice interaction");
        return;
      }

      const signedUrl = await getSignedUrl(selectedAgent.id);

      const conversationId = await conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: selectedAgent.prompt
            },
            firstMessage: selectedAgent.firstMessage
          }
        }
      });

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

  const startQuiz = () => {
    setIsQuizMode(true);
    setCurrentQuiz(0);
  };

  const handleQuizAnswer = (answer: string) => {
    if (currentQuiz >= QUIZ_DATA.quiz.length) return;

    const isCorrect = answer === QUIZ_DATA.quiz[currentQuiz].correct;
    setFeedback(isCorrect ? "Correct!" : "Not quite. Let's try the next one.");

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

  return {
    currentSlide,
    setCurrentSlide,
    isSpeaking,
    isQuizMode,
    currentQuiz,
    isMuted,
    volume,
    feedback,
    isComplete,
    isConversationStarted,
    startConversation,
    handleVolumeChange,
    startQuiz,
    handleQuizAnswer,
  };
}
