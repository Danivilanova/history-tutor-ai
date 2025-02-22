
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LessonHeaderProps {
  title: string;
  isMuted: boolean;
  volume: number;
  onMuteToggle: () => void;
  onVolumeChange: (volume: number) => void;
}

const LessonHeader: FC<LessonHeaderProps> = ({ 
  title, 
  isMuted, 
  volume,
  onMuteToggle,
  onVolumeChange 
}) => {
  const navigate = useNavigate();

  const handleVolumeChange = (change: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + change));
    onVolumeChange(newVolume);
  };

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
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleVolumeChange(-0.1)}
          disabled={isMuted || volume <= 0}
          className="hover:bg-primary/10"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10"
          onClick={onMuteToggle}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleVolumeChange(0.1)}
          disabled={isMuted || volume >= 1}
          className="hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LessonHeader;
