
import { FC } from 'react';
import { PlayCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LessonCardProps {
  title: string;
  difficulty: string;
  onStart: () => void;
}

const LessonCard: FC<LessonCardProps> = ({ title, difficulty, onStart }) => {
  return (
    <Card className="glass transform transition-all duration-300 hover:scale-105 animate-fade-in-scale">
      <CardHeader>
        <Badge variant="secondary" className="w-fit bg-primary/10 text-primary hover:bg-primary/20">
          {difficulty}
        </Badge>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold">{title}</h3>
      </CardContent>
      <CardFooter>
        <Button onClick={onStart} className="w-full">
          <PlayCircle className="mr-2 h-5 w-5" />
          Start Lesson
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonCard;
