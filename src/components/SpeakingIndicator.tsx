
import { FC } from 'react';

interface SpeakingIndicatorProps {
  isActive: boolean;
}

const SpeakingIndicator: FC<SpeakingIndicatorProps> = ({ isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="flex items-center justify-center gap-0.5 h-8">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="w-0.5 bg-primary rounded-full transition-all duration-200"
          style={{
            height: `${Math.random() * 24 + 8}px`,
            animationDelay: `${i * 0.1}s`,
            animation: 'waveform 0.5s ease-in-out infinite'
          }}
        />
      ))}
      <style>
        {`
          @keyframes waveform {
            0%, 100% {
              transform: scaleY(0.5);
            }
            50% {
              transform: scaleY(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SpeakingIndicator;
