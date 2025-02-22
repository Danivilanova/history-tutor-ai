
import { Badge } from "@/components/ui/badge";
import LessonCard from './LessonCard';
import DynamicInput from './DynamicInput';
import { predefinedLessons } from '../constants/tutor';
import { ArrowRight } from 'lucide-react';

interface LessonSectionProps {
  selectedPersonality: string | null;
  onGenerateLesson: (topic: string) => void;
  onStartLesson: (title: string) => void;
}

const LessonSection = ({
  selectedPersonality,
  onGenerateLesson,
  onStartLesson
}: LessonSectionProps) => {
  return (
    <div className="space-y-8 relative">
      {!selectedPersonality && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
          <div className="text-center p-4">
            <p className="text-lg font-medium mb-2">Select a tutor personality first</p>
            <ArrowRight className="h-6 w-6 mx-auto text-primary animate-bounce" />
          </div>
        </div>
      )}
      
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary whitespace-nowrap">
            Step 2
          </Badge>
          <h2 className="text-xl sm:text-2xl font-semibold">Choose Your Learning Path</h2>
        </div>
        <DynamicInput onGenerate={onGenerateLesson} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Or
          </Badge>
          <h2 className="text-xl sm:text-2xl font-semibold">Choose from Featured Lessons</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {predefinedLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              difficulty={lesson.difficulty}
              onStart={() => onStartLesson(lesson.title)}
              backgroundImage={lesson.backgroundImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonSection;
