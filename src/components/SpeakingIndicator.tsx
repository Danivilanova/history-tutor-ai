
import { FC } from 'react';

interface SpeakingIndicatorProps {
  isActive: boolean;
}

const SpeakingIndicator: FC<SpeakingIndicatorProps> = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="flex items-center justify-center h-8">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse" />
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"
          style={{
            animation: 'rotate 2s linear infinite'
          }}
        />
        <div className="absolute inset-1 rounded-full bg-background" />
      </div>
      <style>
        {`
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SpeakingIndicator;
