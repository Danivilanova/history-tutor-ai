
import { FC, useState } from 'react';
import { Book } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DynamicInputProps {
  onGenerate: (topic: string) => void;
}

const DynamicInput: FC<DynamicInputProps> = ({ onGenerate }) => {
  const [topic, setTopic] = useState('');

  return (
    <Card className="glass animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Type a topic, like 'Ancient Egypt'"
            className="bg-white/50 border-white/20"
          />
          <Button
            onClick={() => onGenerate(topic)}
            className="flex items-center justify-center gap-2 sm:whitespace-nowrap sm:min-w-[120px]"
          >
            <Book className="h-4 w-4" />
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicInput;
