
import { FC } from 'react';

interface SpeakingIndicatorProps {
  isActive: boolean;
}

const SpeakingIndicator: FC<SpeakingIndicatorProps> = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="flex gap-1 items-center h-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-2 w-2 bg-primary rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default SpeakingIndicator;
