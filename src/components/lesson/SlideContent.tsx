
import { FC } from 'react';

interface SlideContentProps {
  text: string;
  image?: string;
}

const SlideContent: FC<SlideContentProps> = ({ text, image }) => {
  return (
    <div className="w-full flex flex-col gap-6">
      {image && (
        <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden animate-fade-in">
          <img 
            src={image} 
            alt="Lesson illustration"
            className="w-full h-auto object-contain" // Changed from h-48/h-64 and object-cover to h-auto and object-contain
          />
        </div>
      )}
      <div className={`text-center ${text ? 'animate-fade-in' : ''}`}>
        <p className="text-lg sm:text-xl min-h-[3rem]">{text}</p>
      </div>
    </div>
  );
};

export default SlideContent;
