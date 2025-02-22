
import { FC } from 'react';

interface SlideContentProps {
  text: string;
  image?: string;
}

const SlideContent: FC<SlideContentProps> = ({ text, image }) => {
  return (
    <>
      <div className="w-full text-center animate-fade-in">
        <p className="text-xl mt-4">{text}</p>
      </div>
      {image && (
        <div className="w-full max-w-2xl h-64 rounded-lg overflow-hidden animate-fade-in mt-8">
          <img 
            src={image} 
            alt="Lesson illustration"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
};

export default SlideContent;
