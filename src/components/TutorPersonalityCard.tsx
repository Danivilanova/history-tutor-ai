
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Smile, Shield, Laugh } from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorPersonalityCardProps {
  title: string;
  description: string;
  iconName: string;
  color: string;
  name: string;
  isSelected: boolean;
  isPlayingPreview: boolean;
  onSelect: () => void;
  onPreviewVoice: () => void;
}

const iconComponents = {
  Smile,
  Shield,
  Laugh,
} as const;

const TutorPersonalityCard: FC<TutorPersonalityCardProps> = ({
  title,
  description,
  iconName,
  color,
  name,
  isSelected,
  isPlayingPreview,
  onSelect,
  onPreviewVoice
}) => {
  const IconComponent = iconComponents[iconName as keyof typeof iconComponents];

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 transform hover:scale-105",
        isSelected ? "ring-2 ring-primary shadow-lg scale-105" : "hover:shadow-md",
      )}
      onClick={onSelect}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-10 transition-opacity",
          isSelected ? "opacity-20" : ""
        )}
        style={{ backgroundColor: color }}
      />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-2 rounded-full",
            isSelected ? "bg-primary/20" : "bg-muted"
          )}>
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:bg-primary/10",
              isPlayingPreview && "animate-pulse bg-primary/10"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onPreviewVoice();
            }}
          >
            {isPlayingPreview ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <p className="text-sm font-medium text-primary">Meet {name}</p>
      </CardContent>
    </Card>
  );
};

export default TutorPersonalityCard;
