
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion } from '@/types/lesson';

export function useQuizHandler() {
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

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
    isQuizMode,
    currentQuiz,
    feedback,
    isComplete,
    quizQuestions,
    startQuiz,
    handleQuizAnswer
  };
}
