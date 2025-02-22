
import { FC } from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ current, total }) => {
  return (
    <div className="fixed top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
      {current}/{total}
    </div>
  );
};

export default ProgressIndicator;
