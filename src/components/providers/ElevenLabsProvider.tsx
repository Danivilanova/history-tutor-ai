
import { ConversationProvider } from '@11labs/react';

interface ElevenLabsProviderProps {
  children: React.ReactNode;
}

const ElevenLabsProvider = ({ children }: ElevenLabsProviderProps) => {
  return (
    <ConversationProvider apiKey={process.env.ELEVEN_LABS_API_KEY}>
      {children}
    </ConversationProvider>
  );
};

export default ElevenLabsProvider;
