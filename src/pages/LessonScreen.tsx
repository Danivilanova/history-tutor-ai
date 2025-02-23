
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ReactConfetti from 'react-confetti';
import SpeakingIndicator from '@/components/SpeakingIndicator';
import LessonHeader from '@/components/lesson/LessonHeader';
import SlideContent from '@/components/lesson/SlideContent';
import CompletionSlide from '@/components/lesson/CompletionSlide';
import { supabase } from "@/integrations/supabase/client";
import { useLesson } from '@/hooks/useLesson';
import { TUTOR_AGENTS } from '@/constants/lesson';
import { useState, useEffect } from 'react';
import type { LessonSection, GeneratedContent } from '@/types/lesson';

const LessonScreen = () => {
  const [searchParams] = useSearchParams();
  const tutorPersonality = (searchParams.get('personality') || 'friendly') as keyof typeof TUTOR_AGENTS;
  const selectedAgent = TUTOR_AGENTS[tutorPersonality];
  const lessonTitle = searchParams.get('title') || "The Fall of Rome";
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: sections, isLoading } = useQuery({
    queryKey: ['lessonSections', lessonTitle],
    queryFn: async () => {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('title', lessonTitle)
        .single();

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      const { data } = await supabase
        .from('lesson_sections')
        .select('*, generated_content(*)')
        .eq('lesson_id', lesson.id)
        .order('order_index');

      return {
        lessonId: lesson.id,
        sections: data as (LessonSection & { generated_content: GeneratedContent[] })[]
      };
    }
  });

  const {
    currentSlide,
    isSpeaking,
    isMuted,
    volume,
    isConversationStarted,
    isLessonComplete,
    startConversation,
    handleVolumeChange,
  } = useLesson(selectedAgent, sections?.sections);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-pulse">Loading lesson content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {isLessonComplete && (
        <ReactConfetti
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="max-w-4xl mx-auto relative min-h-screen p-2 sm:p-4 flex flex-col">
        <div className="py-2 animate-fade-in">
          <LessonHeader
            title={lessonTitle}
            isMuted={isMuted}
            volume={volume}
            onMuteToggle={() => handleVolumeChange(isMuted ? 0.5 : 0)}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        {!isConversationStarted ? (
          <div className="flex-1 flex items-center justify-center">
            <Button 
              onClick={() => {
                startConversation();
              }}
              size="lg"
              className="animate-pulse"
            >
              Start Lesson with AI Tutor
            </Button>
          </div>
        ) : (
          <Card className="flex-1 flex flex-col relative overflow-hidden backdrop-blur-sm bg-card/80 border-primary/10 animate-fade-in-scale mt-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />

            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <SpeakingIndicator isActive={isSpeaking} />
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              {isLessonComplete ? (
                <CompletionSlide agentName={selectedAgent.name} />
              ) : (
                currentSlide && (
                  <SlideContent
                    text={currentSlide.text}
                    image={currentSlide.imageUrl}
                  />
                )
              )}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
          </Card>
        )}
      </div>
    </div>
  );
};

export default LessonScreen;
