
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';
import { TutorAgent } from '@/types/lesson';
import { supabase } from '@/integrations/supabase/client';
import { getSignedUrl, requestMicrophonePermission } from '@/utils/lessonUtils';

export function useConversationHandler(
  selectedAgent: TutorAgent,
  sections: any[] | undefined,
  onStart: () => void,
  onSpeakingChange: (speaking: boolean) => void,
  volume: number,
  onSlideGenerated?: (text: string, imageUrl: string) => void
) {
  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs with agent:", selectedAgent.name);
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      onSpeakingChange(false);
    },
    onMessage: (message) => {
      console.log("Message from AI:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast.error("Error with voice interaction");
    }
  });

  const startConversation = async () => {
    try {
      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        console.error('Microphone permission denied');
        toast.error("Microphone permission is required for voice interaction");
        return;
      }

      const signedUrl = await getSignedUrl(selectedAgent.id);

      const lessonContent = sections?.map(section => {
        return `${section.title}:\n${section.content}`;
      }).join('\n\n');

      const enhancedPrompt = `
${selectedAgent.prompt}

I am ${selectedAgent.name}, and here is the lesson content I will be teaching:

${lessonContent}

Important instructions:
1. For every new concept or section I'm about to explain, I MUST first use the 'generateSlide' tool to create a visual representation. The format should be:
   - Call 'generateSlide' with the text and the image description that will be used to generate the visual aid
   - Wait for the slide to be generated
   - Then explain the concept while referencing the visual aid
2. Throughout the lesson, I should maintain my assigned teaching style while using the student's name appropriately.
3. After generating a slide and explaining its content, I MUST continue to the next section WITHOUT waiting for user input.

Remember to:
- Always use 'generateSlide' before explaining a new concept
- Teach the content in my assigned style while maintaining accuracy
- Break down complex concepts and encourage questions
- Always refer to myself as ${selectedAgent.name} when introducing myself or when it feels natural in conversation
- Reference the visual aids I create to enhance understanding
- IMPORTANT: After each slide generation and explanation, automatically proceed to the next section
`;

      const conversationId = await conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: enhancedPrompt
            },
            firstMessage: selectedAgent.firstMessage
          }
        },
        clientTools: {
          generateSlide: async ({ text, image_description }) => {
            console.log("Generating slide with text:", text, "and image description:", image_description);
            
            try {
              const response = await supabase.functions.invoke('generate-slide-image', {
                body: { image_description }
              });

              if (response.error) {
                throw new Error(response.error.message);
              }

              if (onSlideGenerated) {
                onSlideGenerated(text, response.data.imageUrl);
              }

              // Return a message that encourages the AI to continue with the lesson
              return `I've generated a slide showing "${text}". Please continue explaining this concept and then move on to the next section.`;
            } catch (error) {
              console.error('Failed to generate slide image:', error);
              toast.error('Failed to generate slide image');
              return "Failed to generate slide. Please continue with the lesson.";
            }
          }
        },
      });

      onStart();
      onSpeakingChange(true);
      conversation.setVolume({ volume });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      toast.error('Failed to start voice interaction');
    }
  };

  return {
    conversation,
    startConversation
  };
}
