
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ChatMessage from '@/components/ChatMessage';

interface Message {
  id: number;
  content: string;
  type: 'ai' | 'user' | 'quiz' | 'feedback';
  options?: string[];
  isSpeaking?: boolean;
}

const SAMPLE_LESSON = {
  title: "The Fall of Rome",
  content: [
    "The Roman Empire was one of the largest and most influential civilizations in world history.",
    "At its height, Rome controlled territory from Britain to Egypt, from Spain to Syria.",
    "However, by the 5th century AD, the empire faced numerous challenges that would lead to its eventual collapse."
  ],
  quiz: [
    {
      question: "When did the Western Roman Empire fall?",
      options: ["476 AD", "300 AD", "500 AD", "410 AD"],
      correct: "476 AD"
    },
    {
      question: "What were some major causes of Rome's fall?",
      options: [
        "Military pressure and invasions",
        "Economic troubles",
        "Political instability",
        "All of the above"
      ],
      correct: "All of the above"
    }
  ]
};

const ChatScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat with welcome message
    setMessages([
      {
        id: 1,
        content: `Welcome to the lesson on ${SAMPLE_LESSON.title}. Let's begin!`,
        type: 'ai',
        isSpeaking: true
      }
    ]);

    // Start lesson content delivery
    const timer = setTimeout(() => {
      deliverNextContent();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const deliverNextContent = () => {
    if (currentStep < SAMPLE_LESSON.content.length) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: SAMPLE_LESSON.content[currentStep],
        type: 'ai',
        isSpeaking: true
      }]);
      setCurrentStep(prev => prev + 1);

      // Continue to next content after delay
      setTimeout(() => {
        if (currentStep === SAMPLE_LESSON.content.length - 1) {
          startQuiz();
        } else {
          deliverNextContent();
        }
      }, 3000);
    }
  };

  const startQuiz = () => {
    setIsQuizMode(true);
    setMessages(prev => [...prev, {
      id: Date.now(),
      content: SAMPLE_LESSON.quiz[0].question,
      type: 'quiz',
      options: SAMPLE_LESSON.quiz[0].options
    }]);
  };

  const handleQuizAnswer = (answer: string) => {
    const currentQuestion = SAMPLE_LESSON.quiz[currentQuiz];
    const isCorrect = answer === currentQuestion.correct;
    
    setMessages(prev => [...prev, 
      {
        id: Date.now(),
        content: answer,
        type: 'user'
      },
      {
        id: Date.now() + 1,
        content: isCorrect 
          ? `Correct! ${answer} is the right answer.`
          : `Not quite. The correct answer is ${currentQuestion.correct}.`,
        type: 'feedback'
      }
    ]);

    if (currentQuiz < SAMPLE_LESSON.quiz.length - 1) {
      setTimeout(() => {
        setCurrentQuiz(prev => prev + 1);
        setMessages(prev => [...prev, {
          id: Date.now(),
          content: SAMPLE_LESSON.quiz[currentQuiz + 1].question,
          type: 'quiz',
          options: SAMPLE_LESSON.quiz[currentQuiz + 1].options
        }]);
      }, 2000);
    } else {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          content: "Congratulations! You've completed the lesson.",
          type: 'ai'
        }]);
      }, 2000);
    }
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      content: input,
      type: 'user'
    }]);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: "That's an interesting question! Let me explain further...",
        type: 'ai',
        isSpeaking: true
      }]);
    }, 1000);

    setInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{SAMPLE_LESSON.title}</h1>
        </div>

        <Card className="mb-4 p-4 h-[600px] overflow-y-auto flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              type={message.type}
              isSpeaking={message.isSpeaking}
              options={message.options}
              onOptionSelect={isQuizMode ? handleQuizAnswer : undefined}
            />
          ))}
          <div ref={messagesEndRef} />
        </Card>

        <form onSubmit={handleUserInput} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
