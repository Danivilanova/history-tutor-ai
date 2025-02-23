
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
  voiceId: string;
  name: string;
  prompt: string;
  firstMessage: string;
}

export interface TutorAgents {
  funny: TutorAgent;
  strict: TutorAgent;
  friendly: TutorAgent;
}
