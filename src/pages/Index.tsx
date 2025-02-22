
import { useState } from 'react';
import { toast } from 'sonner';
import { Smile, Shield, Laugh } from 'lucide-react';
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
    // This is where you would integrate with a text-to-speech service
    toast.info("Playing voice preview...");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 bg-gradient-to-b from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 animate-float">
            Welcome to History Tutor AI
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Explore the Past, Your Way
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive into history with your personal AI tutor. Learn at your own pace with interactive, 
            adaptable lessons tailored just for you.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Choose Your Tutor's Personality</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="mb-16">
          <DynamicInput onGenerate={handleGenerateLesson} />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-8">Featured Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
};

export default Index;
