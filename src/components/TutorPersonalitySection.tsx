
import { Badge } from "@/components/ui/badge";
import TutorPersonalityCard from './TutorPersonalityCard';
import { tutorPersonalities } from '../constants/tutor';
import { toast } from 'sonner';

interface TutorPersonalitySectionProps {
  selectedPersonality: string | null;
  isPlayingPreview: string | null;
  onPersonalitySelect: (id: string) => void;
  onPreviewVoice: (personality: typeof tutorPersonalities[0]) => void;
}

const TutorPersonalitySection = ({
  selectedPersonality,
  isPlayingPreview,
  onPersonalitySelect,
  onPreviewVoice
}: TutorPersonalitySectionProps) => {
  return (
    <div className="rounded-xl bg-gradient-to-b from-primary/5 to-background p-4 sm:p-8 border animate-fade-in">
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Badge variant="secondary" className="bg-primary/10 text-primary whitespace-nowrap">
          Step 1
        </Badge>
        <h2 className="text-xl sm:text-2xl font-semibold">Choose Your Tutor's Personality</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {tutorPersonalities.map((personality) => (
          <TutorPersonalityCard
            key={personality.id}
            title={personality.title}
            description={personality.description}
            iconName={personality.iconName}
            color={personality.color}
            isSelected={selectedPersonality === personality.id}
            onSelect={() => {
              onPersonalitySelect(personality.id);
              toast.success(`Selected ${personality.title} tutor personality`);
            }}
            onPreviewVoice={() => onPreviewVoice(personality)}
            isPlayingPreview={isPlayingPreview === personality.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TutorPersonalitySection;
