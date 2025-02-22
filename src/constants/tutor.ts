
import { Smile, Shield, Laugh } from 'lucide-react';

export const predefinedLessons = [
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

export const tutorPersonalities = [
  {
    id: 'friendly',
    title: 'Friendly',
    description: 'Warm and encouraging, perfect for a supportive learning experience',
    icon: <Smile className="h-6 w-6 text-primary" />,
    color: '#6B4EFF',
    audioSample: '/friendly_sample.mp3'
  },
  {
    id: 'strict',
    title: 'Strict',
    description: 'Focused and disciplined, ideal for structured learning',
    icon: <Shield className="h-6 w-6 text-primary" />,
    color: '#1A1F2C',
    audioSample: '/strict_sample.mp3'
  },
  {
    id: 'funny',
    title: 'Funny',
    description: 'Light-hearted and engaging, making learning fun and memorable',
    icon: <Laugh className="h-6 w-6 text-primary" />,
    color: '#F97316',
    audioSample: '/funny_sample.mp3'
  }
];
