
import { FC } from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ current, total }) => {
  return (
    <div className="bg-primary/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-primary/20 animate-fade-in">
      <span className="text-primary">{current}</span>
      <span className="text-primary/60">/{total}</span>
    </div>
  );
};

export default ProgressIndicator;
