
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FAL_KEY = Deno.env.get('FAL_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateSections = async (topic: string) => {
  const prompt = `Create a structured lesson about "${topic}" with clearly tagged sections. Use <intro> for introduction, <section> for main points, and <conclusion> for the summary.

Example format:
<intro>
The solar system is a fascinating cosmic neighborhood that has captivated humans for millennia. From the ancient astronomers to modern space exploration, our understanding has evolved dramatically.
</intro>

<section>
The Sun, our central star, provides energy and gravity that holds the system together. This massive ball of hydrogen and helium drives the processes that make life possible on Earth.
</section>

<section>
The inner planets - Mercury, Venus, Earth, and Mars - are rocky worlds, each with unique characteristics but sharing a common origin in the solar nebula.
</section>

<section>
The outer planets, known as gas giants, demonstrate the diversity of planetary formation. These massive worlds, from Jupiter to Neptune, tell us about the early solar system's evolution.
</section>

<conclusion>
Understanding our solar system helps us appreciate Earth's special place in space and guides our exploration of other star systems.
</conclusion>

Please create a lesson following this exact format, with clear tags and well-structured content for each section.`;

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

  // Initialize sections with empty content
  const sections = [
    { title: 'Introduction', section_type: 'intro', content: '', order_index: 0 },
    { title: 'Key Point 1', section_type: 'point', content: '', order_index: 1 },
    { title: 'Key Point 2', section_type: 'point', content: '', order_index: 2 },
    { title: 'Key Point 3', section_type: 'point', content: '', order_index: 3 },
    { title: 'Conclusion', section_type: 'conclusion', content: '', order_index: 4 }
  ];

  // Extract content using regex with tags
  const introMatch = content.match(/<intro>(.*?)<\/intro>/s);
  const sectionMatches = content.match(/<section>(.*?)<\/section>/gs);
  const conclusionMatch = content.match(/<conclusion>(.*?)<\/conclusion>/s);

  if (introMatch) {
    sections[0].content = introMatch[1].trim();
  }

  if (sectionMatches) {
    sectionMatches.forEach((match: string, index: number) => {
      if (index < 3) { // We only want 3 key points
        const content = match.replace(/<\/?section>/g, '').trim();
        sections[index + 1].content = content;
      }
    });
  }

  if (conclusionMatch) {
    sections[4].content = conclusionMatch[1].trim();
  }

  // Validate that all sections have content
  const emptySections = sections.filter(s => !s.content);
  if (emptySections.length > 0) {
    console.error('Some sections are empty:', emptySections);
    throw new Error('Failed to generate complete lesson content');
  }

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
