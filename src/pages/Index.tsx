
import { useState } from 'react';
import { toast } from 'sonner';
import LessonCard from '../components/LessonCard';
import DynamicInput from '../components/DynamicInput';
import { Badge } from "@/components/ui/badge";

const predefinedLessons = [
  { id: 1, title: "The Fall of Rome", difficulty: "Beginner" },
  { id: 2, title: "Ancient Egyptian Pyramids", difficulty: "Intermediate" },
  { id: 3, title: "Renaissance Art", difficulty: "Advanced" },
  { id: 4, title: "Industrial Revolution", difficulty: "Intermediate" },
];

const Index = () => {
  const handleStartLesson = (title: string) => {
    toast.success(`Starting lesson: ${title}`);
  };

  const handleGenerateLesson = (topic: string) => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }
    toast.success(`Generating lesson about: ${topic}`);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
