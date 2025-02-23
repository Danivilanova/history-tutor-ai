
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LessonHeaderProps {
  title: string;
  onFinishLesson?: () => void;
}

const LessonHeader: FC<LessonHeaderProps> = ({ 
  title,
  onFinishLesson
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold line-clamp-1">{title}</h1>
      </div>
      <div className="ml-auto">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          onClick={onFinishLesson}
        >
          <CheckCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default LessonHeader;
