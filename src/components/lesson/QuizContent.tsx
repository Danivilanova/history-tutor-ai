
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    const isCorrectFeedback = feedback === "Correct!";
    
    return (
      <div className="text-center animate-fade-in">
        <h3 className="text-xl mb-6">{quiz[currentQuiz].question}</h3>
        <div className="flex gap-4 justify-center">
          {quiz[currentQuiz].options.map((option, index) => {
            const isSelectedOption = feedback && option === quiz[currentQuiz].correct;
            const isIncorrectSelected = feedback && option !== quiz[currentQuiz].correct;
            
            return (
              <Button
                key={index}
                onClick={() => onAnswerSubmit(option)}
                variant={feedback ? "outline" : "outline"}
                className={cn(
                  "min-w-[120px] transition-colors",
                  feedback && isSelectedOption && "border-green-600 bg-green-50 text-green-600 hover:bg-green-50",
                  feedback && isIncorrectSelected && "border-red-600 bg-red-50 text-red-600 hover:bg-red-50"
                )}
              >
                {option}
                {feedback && isSelectedOption && <Check className="h-4 w-4 text-green-600 ml-2" />}
                {feedback && isIncorrectSelected && <X className="h-4 w-4 text-red-600 ml-2" />}
              </Button>
            );
          })}
        </div>
        {feedback && (
          <div className={cn(
            "mt-4 flex items-center justify-center gap-2 text-lg animate-fade-in",
            isCorrectFeedback ? "text-green-600" : "text-red-600"
          )}>
            {isCorrectFeedback ? (
              <Check className="h-6 w-6 text-green-600" />
            ) : (
              <X className="h-6 w-6 text-red-600" />
            )}
            <p>{feedback}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default QuizContent;
