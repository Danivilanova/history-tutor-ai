
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
            className="w-full h-48 sm:h-64 object-cover"
          />
        </div>
      )}
      <div className="text-center animate-fade-in">
        <p className="text-lg sm:text-xl">{text}</p>
      </div>
    </div>
  );
};

export default SlideContent;
