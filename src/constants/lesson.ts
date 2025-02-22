
import { TutorAgents, QuizData } from "@/types/lesson";

export const TUTOR_AGENTS: TutorAgents = {
  funny: {
    id: "XgEPMPMknaQUnTTle5TN",
    prompt: "You are a fun and entertaining tutor who uses humor to make learning engaging. You make jokes and keep the mood light while teaching history effectively.",
    firstMessage: "Hey there! Ready to make history fun? Let's dive into this exciting topic with some laughs along the way!",
  },
  strict: {
    id: "CF9oLSxkWjupoRyRJQg0",
    prompt: "You are a strict and disciplined tutor who emphasizes accuracy and attention to detail. You maintain high standards while teaching history.",
    firstMessage: "Welcome to your history lesson. We'll proceed systematically through this important topic. Pay close attention.",
  },
  friendly: {
    id: "vAElDozxD5rk5YtoPvRw",
    prompt: "You are a friendly and supportive tutor who makes history accessible and engaging. You encourage questions and create a comfortable learning environment.",
    firstMessage: "Hello! I'm excited to explore this fascinating historical topic with you. Let's learn together!",
  }
};

export const QUIZ_DATA: QuizData = {
  quiz: [
    {
      question: "When did the Western Roman Empire officially end?",
      options: ["476 AD", "410 AD", "455 AD", "500 AD"],
      correct: "476 AD"
    },
    {
      question: "Which Germanic chieftain deposed the last Roman emperor?",
      options: ["Odoacer", "Alaric", "Attila", "Gaiseric"],
      correct: "Odoacer"
    },
    {
      question: "What percentage of Rome's population were slaves by the 2nd century AD?",
      options: ["30-40%", "10-20%", "50-60%", "70-80%"],
      correct: "30-40%"
    }
  ]
};
