
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import LessonCard from './LessonCard';
import { supabase } from "@/integrations/supabase/client";

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
  const [customTopic, setCustomTopic] = useState('');
  const navigate = useNavigate();

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
    onStartLesson(title);
    navigate('/lesson', { 
      state: { 
        title,
        personality: selectedPersonality 
      }
    });
  };

  const handleGenerateLesson = () => {
    if (customTopic.trim()) {
      onGenerateLesson(customTopic);
      navigate('/lesson', { 
        state: { 
          title: customTopic,
          personality: selectedPersonality 
        }
      });
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-b from-primary/5 to-background p-4 sm:p-8 border animate-fade-in">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-primary/10 text-primary whitespace-nowrap">
          Step 2
        </Badge>
        <h2 className="text-xl sm:text-2xl font-semibold">Choose Your Lesson</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {isLoading ? (
          <div className="col-span-3 text-center py-8">Loading lessons...</div>
        ) : lessons && lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              difficulty={lesson.difficulty}
              backgroundImage={lesson.background_image}
              onStart={() => handleStartLesson(lesson.title)}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">No lessons available</div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <Input
            placeholder="Or enter a custom historical topic..."
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            className="bg-background"
          />
        </div>
        <Button
          onClick={handleGenerateLesson}
          disabled={!customTopic.trim()}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Generate Lesson
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default LessonSection;
