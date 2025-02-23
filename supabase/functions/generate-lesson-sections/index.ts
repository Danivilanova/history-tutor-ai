
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FAL_KEY = Deno.env.get('FAL_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeneratedLesson {
  title: string;
  difficulty: string;
  sections: {
    title: string;
    content: string;
    section_type: 'intro' | 'point' | 'conclusion';
    order_index: number;
  }[];
}

const generateLessonContent = async (topic: string): Promise<GeneratedLesson> => {
  const prompt = `Generate a complete lesson about "${topic}" with clear sections and metadata.
The response should be structured as follows:
1. First line: The lesson title (make it catchy and descriptive)
2. Second line: The difficulty level (Beginner, Intermediate, or Advanced)
3. Then the content sections with XML tags

Example:
The Renaissance: A Cultural Revolution in European Art (1300-1600)
Intermediate

<intro>
Renaissance art emerged in Italy around 1300 AD, peaking from 1400 AD to 1600 AD, during a cultural rebirth after the Middle Ages. It began in Florence with patrons like the Medici family funding artists. This period saw a shift to realistic human forms and perspective, driven by masters like Leonardo da Vinci, born 1452 AD, Michelangelo, born 1475 AD, and Raphael, born 1483 AD. Over 10,000 artworks survive from this era across Italy, France, and beyond.
</intro>

<section>
Artists used linear perspective, developed by Filippo Brunelleschi in 1413 AD, to create depth, as seen in Masaccio's "Holy Trinity" fresco from 1427 AD in Florence's Santa Maria Novella church. Chiaroscuro, a light-dark contrast technique, was mastered by Leonardo da Vinci in works like "Mona Lisa," painted 1503–1506 AD, using sfumato for soft edges. Oil paint, adopted from the Netherlands by 1470 AD, allowed detailed layering, as in Titian's "Venus of Urbino" from 1538 AD. Fresco painting on wet plaster, used since 1300 AD, covered 1,000 square feet in Michelangelo's Sistine Chapel ceiling, completed 1512 AD.
</section>

<section>
Leonardo da Vinci, born April 15, 1452 AD in Vinci, died 1519 AD, painted "The Last Supper" in 1495–1498 AD on a Milan monastery wall, spanning 15 by 29 feet. Michelangelo Buonarroti, born March 6, 1475 AD in Caprese, died 1564 AD, sculpted "David," a 17-foot marble statue, from 1501–1504 AD in Florence, and painted the Sistine Chapel ceiling from 1508–1512 AD with 343 figures. Raphael Sanzio, born 1483 AD in Urbino, died 1520 AD, completed "School of Athens" in 1509–1511 AD in the Vatican, a 26-foot fresco showing 50 philosophers like Plato and Aristotle.
</section>

<section>
Renaissance art focused on humanism, depicting realistic humans and emotions, as in Botticelli's "Birth of Venus" from 1486 AD, a 6-by-9-foot canvas. Religious themes dominated, with 80% of works like Giotto's "Lamentation" from 1305 AD in Padua's Scrovegni Chapel showing biblical scenes. The Medici family of Florence, ruling from 1434 AD under Cosimo de' Medici, spent over 600,000 florins by 1500 AD on art, funding da Vinci and Michelangelo. Pope Julius II, reigning 1503–1513 AD, commissioned Raphael's Vatican frescoes and Michelangelo's Sistine project.
</section>

<conclusion>
Renaissance art, starting around 1300 AD in Florence and lasting to 1600 AD, transformed Europe with over 10,000 works, driven by the Medici and popes like Julius II, who died 1513 AD. Techniques like Brunelleschi's perspective from 1413 AD, da Vinci's chiaroscuro in "Mona Lisa" (1503–1506 AD), and oil paint from 1470 AD redefined realism. Masters like Michelangelo, with "David" (1501–1504 AD) and the Sistine Chapel (1508–1512 AD), and Raphael, with "School of Athens" (1509–1511 AD), blended humanism and religion, leaving a legacy in cities like Florence and Rome.
</conclusion>

Please create a lesson following this exact format, with clear metadata and tagged sections. Include specific details, dates, and examples like in this model.`;

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

  // Split the content into lines
  const lines = content.split('\n').filter(line => line.trim());
  
  // Extract title and difficulty from first two lines
  const title = lines[0].trim();
  const difficulty = lines[1].trim();

  // Initialize sections
  const sections = [
    { title: 'Introduction', content: '', section_type: 'intro' as const, order_index: 0 },
    { title: 'Key Concepts and Techniques', content: '', section_type: 'point' as const, order_index: 1 },
    { title: 'Major Developments', content: '', section_type: 'point' as const, order_index: 2 },
    { title: 'Impact and Significance', content: '', section_type: 'point' as const, order_index: 3 },
    { title: 'Summary and Legacy', content: '', section_type: 'conclusion' as const, order_index: 4 }
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
      if (index < 3) {
        const content = match.replace(/<\/?section>/g, '').trim();
        sections[index + 1].content = content;
      }
    });
  }

  if (conclusionMatch) {
    sections[4].content = conclusionMatch[1].trim();
  }

  // Validate content
  const emptySections = sections.filter(s => !s.content);
  if (emptySections.length > 0) {
    console.error('Some sections are empty:', emptySections);
    throw new Error('Failed to generate complete lesson content');
  }

  if (!title || !difficulty) {
    throw new Error('Failed to generate lesson metadata');
  }

  return {
    title,
    difficulty: difficulty === 'Beginner' || difficulty === 'Advanced' ? difficulty : 'Intermediate',
    sections
  };
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

    const lesson = await generateLessonContent(topic);
    
    return new Response(
      JSON.stringify(lesson),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating lesson:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
