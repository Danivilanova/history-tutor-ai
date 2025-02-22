
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface QuizContentProps {
  isComplete: boolean;
  currentQuiz: number;
  quiz: Array<{
    question: string;
    options: string[];
    correct: string;
  }>;
  feedback: string;
  onAnswerSubmit: (answer: string) => void;
}

const QuizContent: FC<QuizContentProps> = ({ 
  isComplete, 
  currentQuiz, 
  quiz, 
  feedback, 
  onAnswerSubmit 
}) => {
  const navigate = useNavigate();

  if (isComplete) {
    return (
      <div className="text-center animate-fade-in">
        <h3 className="text-xl mb-6">Lesson Complete!</h3>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  if (currentQuiz < quiz.length) {
    return (
      <div className="text-center animate-fade-in">
        <h3 className="text-xl mb-6">{quiz[currentQuiz].question}</h3>
        <div className="flex gap-4 justify-center">
          {quiz[currentQuiz].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswerSubmit(option)}
              variant="outline"
              className="min-w-[120px]"
            >
              {option}
            </Button>
          ))}
        </div>
        {feedback && (
          <p className="mt-4 text-lg animate-fade-in">{feedback}</p>
        )}
      </div>
    );
  }

  return null;
};

export default QuizContent;
