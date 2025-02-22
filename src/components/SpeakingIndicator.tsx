
import { FC } from 'react';

interface SpeakingIndicatorProps {
  isActive: boolean;
}

const SpeakingIndicator: FC<SpeakingIndicatorProps> = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="flex items-center justify-center h-8">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-primary animate-pulse" />
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 via-primary to-primary/50"
          style={{
            animation: 'rotate 2s linear infinite'
          }}
        />
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
