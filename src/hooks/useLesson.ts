
import { useState } from 'react';
import { toast } from 'sonner';
import { TutorAgent } from '@/types/lesson';
import { QUIZ_DATA } from '@/constants/lesson';

export function useLesson(selectedAgent: TutorAgent, sections?: any[]) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isConversationStarted, setIsConversationStarted] = useState(false);

  const startConversation = async () => {
    try {
      // Create a lesson content string using only the main content
      const lessonContent = sections?.map(section => {
        return `${section.title}:\n${section.content}`;
      }).join('\n\n');

      setIsConversationStarted(true);
    } catch (error) {
      console.error('Failed to start lesson:', error);
      toast.error('Failed to start lesson');
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
    isQuizMode,
    currentQuiz,
    feedback,
    isComplete,
    isConversationStarted,
    startConversation,
    startQuiz,
    handleQuizAnswer,
  };
}
