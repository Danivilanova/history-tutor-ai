
import { supabase } from "@/integrations/supabase/client";

export async function requestMicrophonePermission() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true })
    return true
  } catch {
    console.error('Microphone permission denied')
    return false
  }
}

export async function getSignedUrl(agentId: string): Promise<string> {
  console.log('Requesting signed URL for agent:', agentId);
  const { data, error } = await supabase.functions.invoke(`get-signed-url?agentId=${agentId}`, {
    method: 'GET',
  });

  if (error) {
    console.error('Error getting signed URL:', error);
    throw new Error('Failed to get signed URL');
  }
  if (!data || !data.signedUrl) {
    console.error('Invalid response data:', data);
    throw new Error('Invalid response: signedUrl not found');
  }
  console.log('Successfully got signed URL');
  return data.signedUrl;
}
