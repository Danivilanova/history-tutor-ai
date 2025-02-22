
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const ELEVEN_LABS_API_KEY = Deno.env.get('ELEVEN_LABS_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the agentId from URL parameters instead of body
    const url = new URL(req.url);
    const agentId = url.searchParams.get('agentId');

    if (!agentId) {
      return new Response(
        JSON.stringify({ error: 'Agent ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Requesting signed URL for agent:', agentId);

    const requestHeaders = new Headers();
    requestHeaders.set("xi-api-key", ELEVEN_LABS_API_KEY);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: requestHeaders,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully got signed URL');

    return new Response(
      JSON.stringify({ signedUrl: data.signed_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-signed-url function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
