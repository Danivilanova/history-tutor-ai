
import { Badge } from "@/components/ui/badge";
import LessonCard from './LessonCard';
import DynamicInput from './DynamicInput';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  console.log('LessonSection - Selected Personality:', selectedPersonality);
  
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleStartLesson = (title: string) => {
    console.log('Starting lesson with:', { title, personality: selectedPersonality });
    onStartLesson(title);
    const searchParams = new URLSearchParams();
    searchParams.set('title', title);
    searchParams.set('personality', selectedPersonality || 'friendly');
    navigate(`/lesson?${searchParams.toString()}`);
  };

  const handleGenerateCustomLesson = (topic: string) => {
    console.log('Generating custom lesson with:', { topic, personality: selectedPersonality });
    onGenerateLesson(topic);
    const searchParams = new URLSearchParams();
    searchParams.set('title', topic);
    searchParams.set('personality', selectedPersonality || 'friendly');
    navigate(`/lesson?${searchParams.toString()}`);
  };

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
        <DynamicInput onGenerate={handleGenerateCustomLesson} />
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Or
          </Badge>
          <h2 className="text-xl sm:text-2xl font-semibold">Choose from Featured Lessons</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {isLoading ? (
            // Loading state with skeleton cards
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-primary/5 rounded-lg h-[240px]" />
            ))
          ) : lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                title={lesson.title}
                difficulty={lesson.difficulty}
                onStart={() => handleStartLesson(lesson.title)}
                backgroundImage={lesson.background_image || undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No lessons available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonSection;
