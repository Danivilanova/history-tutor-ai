
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface CompletionSlideProps {
  agentName: string;
}

const CompletionSlide: FC<CompletionSlideProps> = ({ agentName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-4 animate-fade-in text-center">
        <Sparkles className="w-16 h-16 text-primary animate-bounce" />
        <h2 className="text-2xl font-semibold">Congratulations!</h2>
        <p className="text-lg text-muted-foreground">
          {`${agentName} is proud of your progress! You've successfully completed this lesson.`}
        </p>
      </div>

      <Button
        onClick={() => navigate('/')}
        variant="outline"
        className="mt-4 animate-fade-in"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Lessons
      </Button>
    </div>
  );
};

export default CompletionSlide;
