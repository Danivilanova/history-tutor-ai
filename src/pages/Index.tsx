
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import TutorPersonalitySection from '../components/TutorPersonalitySection';
import LessonSection from '../components/LessonSection';
import { tutorPersonalities } from '../constants/tutor';

const Index = () => {
  const [selectedPersonality, setSelectedPersonality] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleStartLesson = (lessonId: string) => {
    if (!selectedPersonality) {
      return;
    }
  };

  const handleGenerateLesson = (topic: string) => {
    if (!topic.trim() || !selectedPersonality) {
      return;
    }
  };

  const handlePreviewVoice = async (personality: typeof tutorPersonalities[0]) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlayingPreview(null);
      }

      // If clicking the same audio that's playing, just stop it
      if (isPlayingPreview === personality.id) {
        setIsPlayingPreview(null);
        setCurrentAudio(null);
        return;
      }

      // Create and play new audio
      const audio = new Audio(personality.audioSample);
      setCurrentAudio(audio);
      setIsPlayingPreview(personality.id);

      audio.onended = () => {
        setIsPlayingPreview(null);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        console.error('Error playing audio:', audio.error);
        setIsPlayingPreview(null);
        setCurrentAudio(null);
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing preview:', error);
      setIsPlayingPreview(null);
      setCurrentAudio(null);
    }
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

        <TutorPersonalitySection
          selectedPersonality={selectedPersonality}
          isPlayingPreview={isPlayingPreview}
          onPersonalitySelect={setSelectedPersonality}
          onPreviewVoice={handlePreviewVoice}
        />

        <LessonSection
          selectedPersonality={selectedPersonality}
          onGenerateLesson={handleGenerateLesson}
          onStartLesson={handleStartLesson}
        />
      </div>
    </div>
  );
};

export default Index;
