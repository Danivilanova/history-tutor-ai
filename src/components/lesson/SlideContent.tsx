
import { FC } from 'react';

interface SlideContentProps {
  text: string;
  image?: string;
}

const SlideContent: FC<SlideContentProps> = ({ text, image }) => {
  // Split text by newlines and map each paragraph to a div
  const formattedText = text.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-2 last:mb-0">
      {paragraph}
    </p>
  ));

  return (
    <div className="w-full flex flex-col gap-6">
      {image && (
        <div className="w-full max-w-lg mx-auto rounded-lg overflow-hidden animate-fade-in">
          <img 
            src={image} 
            alt="Lesson illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      )}
      <div className={`text-center ${text ? 'animate-fade-in' : ''}`}>
        <div className="text-lg sm:text-xl min-h-[3rem] whitespace-pre-line">
          {formattedText}
        </div>
      </div>
    </div>
  );
};

export default SlideContent;
