
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
  onStartLesson: (lessonId: string) => void;
}

const LessonSection = ({
  selectedPersonality,
  onGenerateLesson,
  onStartLesson
}: LessonSectionProps) => {
  const navigate = useNavigate();
  
  console.log('LessonSection - Selected Personality:', selectedPersonality);
  
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['featured-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleStartLesson = (lessonId: string) => {
    if (!selectedPersonality) {
      return;
    }
    console.log('Starting lesson with:', { lessonId, personality: selectedPersonality });
    onStartLesson(lessonId);
    const searchParams = new URLSearchParams();
    searchParams.set('id', lessonId);
    searchParams.set('personality', selectedPersonality || 'friendly');
    navigate(`/lesson?${searchParams.toString()}`);
  };

  const handleGenerateCustomLesson = async (topic: string) => {
    if (!topic.trim() || !selectedPersonality) {
      return;
    }
    
    try {
      // First create the lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: topic,
          difficulty: 'Intermediate',
          is_featured: false
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // Then create the sections
      const sections = [
        { title: 'Introduction', section_type: 'intro', order_index: 0 },
        { title: 'Key Point 1', section_type: 'point', order_index: 1 },
        { title: 'Key Point 2', section_type: 'point', order_index: 2 },
        { title: 'Key Point 3', section_type: 'point', order_index: 3 },
        { title: 'Conclusion', section_type: 'conclusion', order_index: 4 }
      ];

      const { error: sectionsError } = await supabase
        .from('lesson_sections')
        .insert(
          sections.map(section => ({
            ...section,
            lesson_id: lesson.id,
            content: '' // This will be filled by the AI during the lesson
          }))
        );

      if (sectionsError) throw sectionsError;

      // Navigate to the lesson page
      const searchParams = new URLSearchParams();
      searchParams.set('id', lesson.id);
      searchParams.set('personality', selectedPersonality);
      navigate(`/lesson?${searchParams.toString()}`);
    } catch (error) {
      console.error('Error generating lesson:', error);
      // Here you might want to show a toast notification to the user
    }
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
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse bg-primary/5 rounded-lg h-[240px]" />
            ))
          ) : lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                title={lesson.title}
                difficulty={lesson.difficulty}
                onStart={() => handleStartLesson(lesson.id)}
                backgroundImage={lesson.background_image || undefined}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No featured lessons available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonSection;
