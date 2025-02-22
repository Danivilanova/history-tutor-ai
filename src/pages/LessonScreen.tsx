
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import SpeakingIndicator from '@/components/SpeakingIndicator';
import ProgressIndicator from '@/components/ProgressIndicator';

interface LessonSlide {
  text: string;
  image?: string;
}

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
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [question, setQuestion] = useState('');
  const [isMuted, setIsMuted] = useState(false);
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
    setCurrentQuiz(0); // Ensure we start at the first question
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

  const handleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsSpeaking(false);
    toast.info("The AI is processing your question...");
    setQuestion('');
  };

  const currentProgress = isQuizMode 
    ? SAMPLE_LESSON.slides.length + currentQuiz + 1 
    : currentSlide + 1;
  const totalSteps = SAMPLE_LESSON.slides.length + SAMPLE_LESSON.quiz.length;

  const renderContent = () => {
    if (!isQuizMode) {
      return (
        <>
          <div className="w-full text-center animate-fade-in">
            <p className="text-xl mt-4">{SAMPLE_LESSON.slides[currentSlide].text}</p>
          </div>
          {SAMPLE_LESSON.slides[currentSlide].image && (
            <div className="w-full max-w-2xl h-64 rounded-lg overflow-hidden animate-fade-in mt-8">
              <img 
                src={SAMPLE_LESSON.slides[currentSlide].image} 
                alt="Lesson illustration"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </>
      );
    }

    if (isComplete) {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl mb-6">Lesson Complete!</h3>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      );
    }

    if (currentQuiz < SAMPLE_LESSON.quiz.length) {
      return (
        <div className="text-center animate-fade-in">
          <h3 className="text-xl mb-6">{SAMPLE_LESSON.quiz[currentQuiz].question}</h3>
          <div className="flex gap-4 justify-center">
            {SAMPLE_LESSON.quiz[currentQuiz].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleQuizAnswer(option)}
                variant="outline"
                className="min-w-[120px]"
              >
                {option}
              </Button>
            ))}
          </div>
          {feedback && (
            <p className="mt-4 text-lg animate-fade-in">{feedback}</p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{SAMPLE_LESSON.title}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>

        <ProgressIndicator 
          current={currentProgress} 
          total={totalSteps} 
        />

        <Card className="p-8 mb-4 min-h-[400px] flex flex-col items-center justify-center relative">
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <SpeakingIndicator isActive={isSpeaking} />
          </div>
          {renderContent()}
        </Card>

        <form onSubmit={handleQuestion} className="relative">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="bg-white/10 backdrop-blur-sm"
          />
        </form>
      </div>
    </div>
  );
};

export default LessonScreen;
