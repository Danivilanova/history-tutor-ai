
import { FC, useState } from 'react';
import { Book } from 'lucide-react';

interface DynamicInputProps {
  onGenerate: (topic: string) => void;
}

const DynamicInput: FC<DynamicInputProps> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');

  return (
    <div className="glass p-6 rounded-2xl animate-fade-in">
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type a topic, like 'Ancient Egypt'"
          className="w-full px-4 py-3 pr-32 rounded-lg bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <button
          onClick={() => onGenerate(topic)}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg transition-all hover:bg-primary/90"
        >
          <Book size={18} />
          Generate
        </button>
      </div>
    </div>
  );
};

export default DynamicInput;
