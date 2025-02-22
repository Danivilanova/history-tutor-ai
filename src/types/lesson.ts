
export interface LessonSection {
  id: string;
  title: string;
  content: string;
  section_type: 'intro' | 'point' | 'conclusion';
  order_index: number;
}

export interface GeneratedContent {
  generated_text: string;
  generated_image_url: string;
}

export interface TutorAgent {
  id: string;
  name: string;
  prompt: string;
  firstMessage: string;
}

export interface TutorAgents {
  funny: TutorAgent;
  strict: TutorAgent;
  friendly: TutorAgent;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: QuestionDifficulty;
  order_index: number;
}

export interface QuizData {
  quiz: QuizQuestion[];
}
