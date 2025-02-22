
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LessonHeaderProps {
  title: string;
  isMuted: boolean;
  onMuteToggle: () => void;
}

const LessonHeader: FC<LessonHeaderProps> = ({ title, isMuted, onMuteToggle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="hover:bg-primary/10"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto"
        onClick={onMuteToggle}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default LessonHeader;
