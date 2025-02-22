import { useState } from 'react';
import { toast } from 'sonner';
import { Smile, Shield, Laugh, ArrowRight } from 'lucide-react';
import LessonCard from '../components/LessonCard';
import DynamicInput from '../components/DynamicInput';
import { Badge } from "@/components/ui/badge";
import TutorPersonalityCard from '../components/TutorPersonalityCard';

const predefinedLessons = [
  { 
    id: 1, 
    title: "The Fall of Rome", 
    difficulty: "Beginner",
    backgroundImage: "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 2, 
    title: "Ancient Egyptian Pyramids", 
    difficulty: "Intermediate",
    backgroundImage: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 3, 
    title: "Renaissance Art", 
    difficulty: "Advanced",
    backgroundImage: "https://images.unsplash.com/photo-1544413660-299165566b1d?q=80&w=800&auto=format&fit=crop"
  },
  { 
    id: 4, 
    title: "Industrial Revolution", 
    difficulty: "Intermediate",
    backgroundImage: "https://images.unsplash.com/photo-1569954942719-c59595ea3667?q=80&w=800&auto=format&fit=crop"
  },
];

const tutorPersonalities = [
  {
    id: 'friendly',
    title: 'Friendly',
    description: 'Warm and encouraging, perfect for a supportive learning experience',
    icon: <Smile className="h-6 w-6 text-primary" />,
    color: '#6B4EFF',
    previewText: "Hi! I'm excited to help you learn history in a friendly and supportive way!"
  },
  {
    id: 'strict',
    title: 'Strict',
    description: 'Focused and disciplined, ideal for structured learning',
    icon: <Shield className="h-6 w-6 text-primary" />,
    color: '#1A1F2C',
    previewText: "Welcome. Let's maintain focus and achieve our learning objectives efficiently."
  },
  {
    id: 'funny',
    title: 'Funny',
    description: 'Light-hearted and engaging, making learning fun and memorable',
    icon: <Laugh className="h-6 w-6 text-primary" />,
    color: '#F97316',
    previewText: "Hey there! Ready to make history fun? Let's dive in with a smile!"
  }
];

const Index = () => {
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);

  const handleStartLesson = (title: string) => {
    if (!selectedPersonality) {
      toast.error("Please select a tutor personality first");
      return;
    }
    toast.success(`Starting lesson: ${title} with ${selectedPersonality} tutor`);
  };

  const handleGenerateLesson = (topic: string) => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }
    if (!selectedPersonality) {
      toast.error("Please select a tutor personality first");
      return;
    }
    toast.success(`Generating lesson about: ${topic} with ${selectedPersonality} tutor`);
  };

  const handlePreviewVoice = (text: string) => {
    toast.info("Playing voice preview...");
  };

  return (
    <div className="min-h-screen py-6 sm:py-12 px-4 sm:px-6 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-16">
        <div className="text-center animate-fade-in space-y-4">
          <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 animate-float">
            Welcome to History Tutor AI
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50 px-4">
            Explore the Past, Your Way
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Dive into history with your personal AI tutor. Learn at your own pace with interactive, 
            adaptable lessons tailored just for you.
          </p>
        </div>

        <div className="rounded-xl bg-gradient-to-b from-primary/5 to-background p-4 sm:p-8 border animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-primary/10 text-primary whitespace-nowrap">
              Step 1
            </Badge>
            <h2 className="text-xl sm:text-2xl font-semibold">Choose Your Tutor's Personality</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {tutorPersonalities.map((personality) => (
              <TutorPersonalityCard
                key={personality.id}
                title={personality.title}
                description={personality.description}
                icon={personality.icon}
                color={personality.color}
                isSelected={selectedPersonality === personality.id}
                onSelect={() => {
                  setSelectedPersonality(personality.id);
                  toast.success(`Selected ${personality.title} tutor personality`);
                }}
                onPreviewVoice={() => handlePreviewVoice(personality.previewText)}
              />
            ))}
          </div>
        </div>

        {!selectedPersonality ? (
          <div className="text-center p-6 rounded-xl bg-background/80 backdrop-blur-sm border animate-fade-in">
            <p className="text-lg font-medium mb-2">Select a tutor personality first</p>
            <ArrowRight className="h-6 w-6 mx-auto text-primary animate-bounce" />
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge variant="secondary" className="bg-primary/10 text-primary whitespace-nowrap">
                  Step 2
                </Badge>
                <h2 className="text-xl sm:text-2xl font-semibold">Choose Your Learning Path</h2>
              </div>
              <DynamicInput onGenerate={handleGenerateLesson} />
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
                    onStart={() => handleStartLesson(lesson.title)}
                    backgroundImage={lesson.backgroundImage}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
