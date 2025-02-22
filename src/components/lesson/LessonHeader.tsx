
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3 bg-white">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onMuteToggle}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  defaultValue={[volume]}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default LessonHeader;
