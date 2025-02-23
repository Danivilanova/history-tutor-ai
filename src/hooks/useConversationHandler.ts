
import { useConversation } from '@11labs/react';
import { toast } from 'sonner';
import { TutorAgent } from '@/types/lesson';
import { supabase } from '@/integrations/supabase/client';
import { getSignedUrl, requestMicrophonePermission } from '@/utils/lessonUtils';
import { AGENT_ID } from '@/constants/lesson';

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

      const signedUrl = await getSignedUrl(AGENT_ID);

      const lessonContent = sections?.map(section => {
        return `${section.title}:\n${section.content}`;
      }).join('\n\n');

      const enhancedPrompt = `
${selectedAgent.prompt}

I am ${selectedAgent.name}, and here is the lesson content I will be teaching:

${lessonContent}

Important instructions:
1. For each section or concept, follow this STRICT sequence:
   a. First, use the 'generateSlide' tool ONCE to create a visual aid for the current concept
   b. Wait for the slide to be generated
   c. FULLY explain the concept while referencing the visual aid
   d. Only after COMPLETING the explanation of the current slide, move to the next concept
   e. Never generate multiple slides without completing the explanation of the current one

2. Throughout the lesson:
   - Maintain my assigned teaching style
   - Use the student's name appropriately
   - Break down complex concepts and encourage questions
   - Always refer to myself as ${selectedAgent.name} when introducing myself
   - Reference the visual aids to enhance understanding
   - Wait for each explanation to be complete before moving to the next slide

3. Lesson Completion:
   - When all sections have been covered, provide a brief summary of the key points
   - Ask the student if they have any final questions
   - After addressing final questions, use the 'endLesson' tool to properly conclude the lesson
   - Always end with a positive and encouraging message before using 'endLesson'

CRITICAL RULES:
- Do not generate a new slide until you have finished explaining the current one completely
- Use 'endLesson' only after covering all content and addressing final questions
- Never end the lesson abruptly without proper conclusion
`;

      const conversationId = await conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            prompt: {
              prompt: enhancedPrompt
            },
            firstMessage: selectedAgent.firstMessage
          },
          tts: {
            voiceId: selectedAgent.voiceId
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

              return `I've generated a slide showing "${text}". Now, I will fully explain this concept before moving to the next slide. Remember to complete the explanation of this slide before generating another one.`;
            } catch (error) {
              console.error('Failed to generate slide image:', error);
              toast.error('Failed to generate slide image');
              return "Failed to generate slide. Please continue with the lesson.";
            }
          },
          endLesson: async () => {
            console.log("Ending lesson");
            await conversation.endSession();
            return "Lesson ended successfully. Thank you for your attention!";
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
