
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card } from "@/components/ui/card";
import SpeakingIndicator from '@/components/SpeakingIndicator';
import ProgressIndicator from '@/components/ProgressIndicator';
import LessonHeader from '@/components/lesson/LessonHeader';
import SlideContent from '@/components/lesson/SlideContent';
import QuizContent from '@/components/lesson/QuizContent';

const SAMPLE_LESSON = {
  title: "The Fall of Rome",
  slides: [
    {
      text: "The Roman Empire was one of the most vast and powerful civilizations in world history.",
      image: "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=800&auto=format&fit=crop"
    },
    {
      text: "At its height, Rome controlled territory from Britain to Egypt, from Spain to Syria.",
      image: "https://images.unsplash.com/photo-1515861461225-1488dfdaf0a8?q=80&w=800&auto=format&fit=crop"
    },
    {
      text: "However, by the 5th century AD, the empire faced numerous challenges that would lead to its eventual collapse.",
      image: "https://images.unsplash.com/photo-1593001134154-fd927cdba783?q=80&w=800&auto=format&fit=crop"
    }
  ],
  quiz: [
    {
      question: "When did the Western Roman Empire fall?",
      options: ["476 AD", "300 AD"],
      correct: "476 AD"
    },
    {
      question: "What were some major causes of Rome's fall?",
      options: ["Military pressure", "All of the above"],
      correct: "All of the above"
    }
  ]
};

const LessonScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [feedback, setFeedback] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentSlide < SAMPLE_LESSON.slides.length) {
      setIsSpeaking(true);
      const timer = setTimeout(() => {
        setIsSpeaking(false);
        if (currentSlide < SAMPLE_LESSON.slides.length - 1) {
          setCurrentSlide(prev => prev + 1);
        } else {
          startQuiz();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const startQuiz = () => {
    setIsQuizMode(true);
    setIsSpeaking(true);
    setCurrentQuiz(0);
  };

  const handleQuizAnswer = (answer: string) => {
    if (currentQuiz >= SAMPLE_LESSON.quiz.length) return;
    
    const isCorrect = answer === SAMPLE_LESSON.quiz[currentQuiz].correct;
    setFeedback(isCorrect ? "Correct!" : "Not quite. Let's try the next one.");
    
    setTimeout(() => {
      setFeedback('');
      if (currentQuiz < SAMPLE_LESSON.quiz.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setIsComplete(true);
        toast.success("Congratulations! You've completed the lesson.");
      }
    }, 3000);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const currentProgress = isQuizMode 
    ? SAMPLE_LESSON.slides.length + currentQuiz + 1 
    : currentSlide + 1;
  const totalSteps = SAMPLE_LESSON.slides.length + SAMPLE_LESSON.quiz.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto relative min-h-screen p-2 sm:p-4 flex flex-col">
        <div className="py-2 sm:py-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex-1 w-full">
              <LessonHeader 
                title={SAMPLE_LESSON.title}
                isMuted={isMuted}
                volume={volume}
                onMuteToggle={() => setIsMuted(!isMuted)}
                onVolumeChange={handleVolumeChange}
              />
            </div>
            <div className="ml-0 sm:ml-4 self-end sm:self-auto">
              <ProgressIndicator 
                current={currentProgress} 
                total={totalSteps}
              />
            </div>
          </div>

          <div className="relative h-2 bg-muted rounded-full mb-4 sm:mb-8 overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300 rounded-full"
              style={{ 
                width: `${(currentProgress / totalSteps) * 100}%`,
              }}
            />
          </div>
        </div>

        <Card className="flex-1 flex flex-col relative overflow-hidden backdrop-blur-sm bg-card/80 border-primary/10 animate-fade-in-scale">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <SpeakingIndicator isActive={isSpeaking} />
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            {!isQuizMode ? (
              <SlideContent 
                text={SAMPLE_LESSON.slides[currentSlide].text}
                image={SAMPLE_LESSON.slides[currentSlide].image}
              />
            ) : (
              <QuizContent 
                isComplete={isComplete}
                currentQuiz={currentQuiz}
                quiz={SAMPLE_LESSON.quiz}
                feedback={feedback}
                onAnswerSubmit={handleQuizAnswer}
              />
            )}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
        </Card>
      </div>
    </div>
  );
};

export default LessonScreen;
