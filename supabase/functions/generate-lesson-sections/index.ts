
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FAL_KEY = Deno.env.get('FAL_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateSections = async (topic: string) => {
  const prompt = `Create a structured lesson about "${topic}" with the following parts:
  1. An introduction that hooks the reader and provides context
  2. Three key points that build understanding progressively
  3. A conclusion that summarizes the main takeaways
  
  Format each section distinctly but concisely.`;

  const response = await fetch('https://queue.fal.run/fal-ai/any-llm', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate content: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.response;

  // Split the content into sections using pattern matching
  const sections = [
    { title: 'Introduction', section_type: 'intro', content: '', order_index: 0 },
    { title: 'Key Point 1', section_type: 'point', content: '', order_index: 1 },
    { title: 'Key Point 2', section_type: 'point', content: '', order_index: 2 },
    { title: 'Key Point 3', section_type: 'point', content: '', order_index: 3 },
    { title: 'Conclusion', section_type: 'conclusion', content: '', order_index: 4 }
  ];

  // Extract sections from the AI response
  const parts = content.split(/\n\n|\r\n\r\n/);
  parts.forEach((part: string) => {
    if (part.toLowerCase().includes('introduction')) {
      sections[0].content = part;
    } else if (part.toLowerCase().includes('conclusion')) {
      sections[4].content = part;
    } else if (part.match(/point|key/i)) {
      // Find first empty point section
      const emptyPointIndex = sections.findIndex(s => 
        s.section_type === 'point' && !s.content
      );
      if (emptyPointIndex !== -1) {
        sections[emptyPointIndex].content = part;
      }
    }
  });

  return sections;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    if (!topic) {
      throw new Error('Topic is required');
    }

    const sections = await generateSections(topic);
    
    return new Response(
      JSON.stringify({ sections }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating sections:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
