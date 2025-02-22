
import { FC } from 'react';
import { PlayCircle } from 'lucide-react';

interface LessonCardProps {
  title: string;
  difficulty: string;
  onStart: () => void;
}

const LessonCard: FC<LessonCardProps> = ({ title, difficulty, onStart }) => {
  return (
    <div className="glass p-6 rounded-2xl transform transition-all duration-300 hover:scale-105 animate-fade-in-scale">
      <div className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-primary/10 text-primary">
        {difficulty}
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <button
        onClick={onStart}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg transition-all hover:bg-primary/90"
      >
        <PlayCircle size={20} />
        Start Lesson
      </button>
    </div>
  );
};

export default LessonCard;
