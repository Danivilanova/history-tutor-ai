
import { FC } from 'react';
import { PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LessonCardProps {
  title: string;
  difficulty: string;
  onStart: () => void;
  backgroundImage?: string;
}

const LessonCard: FC<LessonCardProps> = ({ title, difficulty, onStart, backgroundImage }) => {
  const navigate = useNavigate();

  const handleStart = () => {
    onStart();
    navigate('/lesson');
  };

  return (
    <Card 
      className="glass transform transition-all duration-300 hover:scale-105 animate-fade-in-scale overflow-hidden relative min-h-[240px] group flex flex-col"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <CardHeader>
        <Badge variant="secondary" className="w-fit bg-white/80 text-primary hover:bg-white/90 transition-all backdrop-blur-sm">
          {difficulty}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStart}
          className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm group-hover:bg-primary transition-all"
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          Start Lesson
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonCard;
