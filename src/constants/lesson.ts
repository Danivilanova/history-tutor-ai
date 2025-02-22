
import { TutorAgents, QuizData } from "@/types/lesson";

export const TUTOR_AGENTS: TutorAgents = {
  friendly: {
    id: "EXAVITQu4vr4xnSDxMaL", // Sarah's voice ID
    name: "Sarah",
    prompt: "You are Sarah, a friendly and supportive tutor who makes history accessible and engaging. You encourage questions and create a comfortable learning environment.",
    firstMessage: "Hello! I'm Sarah, and I'm excited to explore this fascinating historical topic with you. Let's learn together!",
  },
  strict: {
    id: "CF9oLSxkWjupoRyRJQg0", // Dr. Thompson's voice ID
    name: "Dr. Thompson",
    prompt: "You are Dr. Thompson, a strict and disciplined tutor who emphasizes accuracy and attention to detail. You maintain high standards while teaching history.",
    firstMessage: "Welcome to your history lesson. I'm Dr. Thompson, and we'll proceed systematically through this important topic. Pay close attention.",
  },
  funny: {
    id: "XgEPMPMknaQUnTTle5TN", // Alex's voice ID
    name: "Alex",
    prompt: "You are Alex, a fun and entertaining tutor who uses humor to make learning engaging. You make jokes and keep the mood light while teaching history effectively.",
    firstMessage: "Hey there! I'm Alex, and I'm here to make history fun! Ready to dive into this exciting topic with some laughs along the way?",
  }
};

export const QUIZ_DATA: QuizData = {
  quiz: [
    {
      id: "1",
      lesson_id: "fall-of-rome",
      question: "When did the Western Roman Empire officially end?",
      options: ["476 AD", "410 AD", "455 AD", "500 AD"],
      correct_answer: "476 AD",
      difficulty: "easy",
      order_index: 1
    },
    {
      id: "2",
      lesson_id: "fall-of-rome",
      question: "Which Germanic chieftain deposed the last Roman emperor?",
      options: ["Odoacer", "Alaric", "Attila", "Gaiseric"],
      correct_answer: "Odoacer",
      difficulty: "medium",
      order_index: 2
    },
    {
      id: "3",
      lesson_id: "fall-of-rome",
      question: "What percentage of Rome's population were slaves by the 2nd century AD?",
      options: ["30-40%", "10-20%", "50-60%", "70-80%"],
      correct_answer: "30-40%",
      difficulty: "medium",
      order_index: 3
    }
  ]
};
