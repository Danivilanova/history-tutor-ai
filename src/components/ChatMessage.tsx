
import { FC } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  type: 'ai' | 'user' | 'quiz' | 'feedback';
  isSpeaking?: boolean;
  options?: string[];
  onOptionSelect?: (option: string) => void;
}

const ChatMessage: FC<ChatMessageProps> = ({ 
  content, 
  type, 
  isSpeaking = false,
  options,
  onOptionSelect 
}) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg",
      type === 'user' ? "flex-row-reverse" : "flex-row",
      type === 'user' ? "bg-primary/10" : "bg-secondary"
    )}>
      <div className="flex-shrink-0">
        {type === 'user' ? (
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-secondary border flex items-center justify-center relative">
            <Bot className="h-5 w-5" />
            {isSpeaking && (
              <span className="absolute -right-1 -top-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm text-foreground">{content}</p>
        {options && (
          <div className="mt-4 flex flex-wrap gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onOptionSelect?.(option)}
                className="px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
