
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import SpeakingIndicator from '@/components/SpeakingIndicator';
import LessonHeader from '@/components/lesson/LessonHeader';
import SlideContent from '@/components/lesson/SlideContent';
import QuizContent from '@/components/lesson/QuizContent';
import { supabase } from "@/integrations/supabase/client";
import { useLesson } from '@/hooks/useLesson';
import { TUTOR_AGENTS } from '@/constants/lesson';
import type { LessonSection, GeneratedContent } from '@/types/lesson';

const LessonScreen = () => {
  const [searchParams] = useSearchParams();
  const tutorPersonality = (searchParams.get('personality') || 'friendly') as keyof typeof TUTOR_AGENTS;
  const selectedAgent = TUTOR_AGENTS[tutorPersonality];
  const lessonTitle = searchParams.get('title') || "The Fall of Rome";

  const { data: sections, isLoading } = useQuery({
    queryKey: ['lessonSections', lessonTitle],
    queryFn: async () => {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('title', lessonTitle)
        .single();

      if (!lesson) throw new Error('Lesson not found');

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
    isQuizMode,
    currentQuiz,
    isMuted,
    volume,
    feedback,
    isComplete,
    isConversationStarted,
    quizQuestions,
    startConversation,
    handleVolumeChange,
    startQuiz,
    handleQuizAnswer,
  } = useLesson(selectedAgent, sections?.sections);

  const currentProgress = isQuizMode
    ? (sections?.sections.length || 0) + currentQuiz + 1
    : currentSlide + 1;
  const totalSteps = (sections?.sections.length || 0) + (quizQuestions?.length || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-pulse">Loading lesson content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto relative min-h-screen p-2 sm:p-4 flex flex-col">
        <div className="py-2 animate-fade-in">
          <LessonHeader
            title={lessonTitle}
            isMuted={isMuted}
            volume={volume}
            onMuteToggle={() => handleVolumeChange(isMuted ? volume : 0)}
            onVolumeChange={handleVolumeChange}
          />

          <div className="relative h-2 bg-muted rounded-full mb-4 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 rounded-full"
              style={{
                width: `${(currentProgress / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        {!isConversationStarted ? (
          <div className="flex-1 flex items-center justify-center">
            <Button 
              onClick={() => {
                startConversation();
                if (sections?.lessonId) {
                  startQuiz(sections.lessonId);
                }
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
              {!isQuizMode && sections?.sections && sections.sections[currentSlide] ? (
                <SlideContent
                  text={sections.sections[currentSlide].generated_content?.length > 0
                    ? sections.sections[currentSlide].generated_content[0].generated_text
                    : sections.sections[currentSlide].content}
                  image={sections.sections[currentSlide].generated_content?.length > 0
                    ? sections.sections[currentSlide].generated_content[0].generated_image_url
                    : undefined}
                />
              ) : (
                <QuizContent
                  isComplete={isComplete}
                  currentQuiz={currentQuiz}
                  quiz={quizQuestions}
                  feedback={feedback}
                  onAnswerSubmit={handleQuizAnswer}
                />
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
