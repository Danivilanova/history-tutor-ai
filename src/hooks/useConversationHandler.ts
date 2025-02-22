
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
  volume: number
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
      console.log('Starting conversation with agent:', {
        name: selectedAgent.name,
        id: selectedAgent.id
      });

      const hasPermission = await requestMicrophonePermission()
      if (!hasPermission) {
        console.error('Microphone permission denied');
        toast.error("Microphone permission is required for voice interaction");
        return;
      }

      const signedUrl = await getSignedUrl(selectedAgent.id);
      console.log('Got signed URL for voice ID:', selectedAgent.id);

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

Remember to:
- Always use 'generateSlide' before explaining a new concept
- Teach the content in my assigned style while maintaining accuracy
- Break down complex concepts and encourage questions
- Always refer to myself as ${selectedAgent.name} when introducing myself or when it feels natural in conversation
- Reference the visual aids I create to enhance understanding
`;

      console.log('Starting ElevenLabs session with prompt length:', enhancedPrompt.length);

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

              // Store the text and image URL in the database for the current section
              if (sections?.lessonId) {
                const { error: dbError } = await supabase
                  .from('lesson_sections')
                  .upsert({
                    lesson_id: sections.lessonId,
                    content: text,
                    generated_content: [{
                      generated_text: text,
                      generated_image_url: response.data.imageUrl
                    }]
                  });

                if (dbError) {
                  console.error('Failed to save slide content:', dbError);
                  toast.error('Failed to save slide content');
                }
              }

              return `Generated slide with text: "${text}" and image: ${response.data.imageUrl}`;
            } catch (error) {
              console.error('Failed to generate slide image:', error);
              toast.error('Failed to generate slide image');
              return "Failed to generate slide";
            }
          }
        },
      });

      console.log('Conversation started with ID:', conversationId);
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
