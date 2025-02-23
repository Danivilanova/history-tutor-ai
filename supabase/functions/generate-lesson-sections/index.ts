
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
  const prompt = `Generate a complete lesson about "${topic}" with all content wrapped in XML tags.
Format the response exactly like this example:

<lesson>
<title>The Renaissance: A Cultural Revolution in European Art (1300-1600)</title>
<difficulty>Intermediate</difficulty>

<intro>
<title>Birth of a New Era</title>
<content>
Renaissance art emerged in Italy around 1300 AD, peaking from 1400 AD to 1600 AD, during a cultural rebirth after the Middle Ages. It began in Florence with patrons like the Medici family funding artists. This period saw a shift to realistic human forms and perspective, driven by masters like Leonardo da Vinci, born 1452 AD, Michelangelo, born 1475 AD, and Raphael, born 1483 AD. Over 10,000 artworks survive from this era across Italy, France, and beyond.
</content>
</intro>

<section>
<title>Revolutionary Techniques</title>
<content>
Artists used linear perspective, developed by Filippo Brunelleschi in 1413 AD, to create depth, as seen in Masaccio's "Holy Trinity" fresco from 1427 AD in Florence's Santa Maria Novella church. Chiaroscuro, a light-dark contrast technique, was mastered by Leonardo da Vinci in works like "Mona Lisa," painted 1503–1506 AD, using sfumato for soft edges. Oil paint, adopted from the Netherlands by 1470 AD, allowed detailed layering, as in Titian's "Venus of Urbino" from 1538 AD. Fresco painting on wet plaster, used since 1300 AD, covered 1,000 square feet in Michelangelo's Sistine Chapel ceiling, completed 1512 AD.
</content>
</section>

<section>
<title>The Great Masters</title>
<content>
Leonardo da Vinci, born April 15, 1452 AD in Vinci, died 1519 AD, painted "The Last Supper" in 1495–1498 AD on a Milan monastery wall, spanning 15 by 29 feet. Michelangelo Buonarroti, born March 6, 1475 AD in Caprese, died 1564 AD, sculpted "David," a 17-foot marble statue, from 1501–1504 AD in Florence, and painted the Sistine Chapel ceiling from 1508–1512 AD with 343 figures. Raphael Sanzio, born 1483 AD in Urbino, died 1520 AD, completed "School of Athens" in 1509–1511 AD in the Vatican, a 26-foot fresco showing 50 philosophers like Plato and Aristotle.
</content>
</section>

<section>
<title>Cultural Impact</title>
<content>
Renaissance art focused on humanism, depicting realistic humans and emotions, as in Botticelli's "Birth of Venus" from 1486 AD, a 6-by-9-foot canvas. Religious themes dominated, with 80% of works like Giotto's "Lamentation" from 1305 AD in Padua's Scrovegni Chapel showing biblical scenes. The Medici family of Florence, ruling from 1434 AD under Cosimo de' Medici, spent over 600,000 florins by 1500 AD on art, funding da Vinci and Michelangelo. Pope Julius II, reigning 1503–1513 AD, commissioned Raphael's Vatican frescoes and Michelangelo's Sistine project.
</content>
</section>

<conclusion>
<title>Legacy and Influence</title>
<content>
Renaissance art, starting around 1300 AD in Florence and lasting to 1600 AD, transformed Europe with over 10,000 works, driven by the Medici and popes like Julius II, who died 1513 AD. Techniques like Brunelleschi's perspective from 1413 AD, da Vinci's chiaroscuro in "Mona Lisa" (1503–1506 AD), and oil paint from 1470 AD redefined realism. Masters like Michelangelo, with "David" (1501–1504 AD) and the Sistine Chapel (1508–1512 AD), and Raphael, with "School of Athens" (1509–1511 AD), blended humanism and religion, leaving a legacy in cities like Florence and Rome.
</content>
</conclusion>
</lesson>

Create a lesson following this exact format with clear XML tags for all elements. Include specific details, dates, and examples like in this model.`;

  const response = await fetch('https://fal.run/fal-ai/any-llm', {
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
  
  // Log the raw response for debugging
  console.log('Raw AI response:', data);

  if (!data.output || data.error) {
    console.error('AI service error:', data.error);
    throw new Error(data.error || 'Empty response from AI service');
  }

  const content = data.output;

  // Extract lesson metadata
  const lessonMatch = content.match(/<lesson>(.*?)<\/lesson>/s);
  if (!lessonMatch) {
    console.error('Invalid lesson format, raw content:', content);
    throw new Error('Generated content is not in the correct format');
  }

  const lessonContent = lessonMatch[1];
  
  // Extract title and difficulty
  const titleMatch = lessonContent.match(/<title>(.*?)<\/title>/);
  const difficultyMatch = lessonContent.match(/<difficulty>(.*?)<\/difficulty>/);
  
  if (!titleMatch || !difficultyMatch) {
    console.error('Missing metadata, content:', lessonContent);
    throw new Error('Failed to extract lesson metadata');
  }

  const title = titleMatch[1].trim();
  const difficulty = difficultyMatch[1].trim();

  // Initialize sections array
  const sections = [];

  // Extract intro section
  const introMatch = lessonContent.match(/<intro>.*?<title>(.*?)<\/title>.*?<content>(.*?)<\/content>.*?<\/intro>/s);
  if (introMatch) {
    sections.push({
      title: introMatch[1].trim(),
      content: introMatch[2].trim(),
      section_type: 'intro' as const,
      order_index: 0
    });
  }

  // Extract main sections
  const sectionMatches = Array.from(lessonContent.matchAll(/<section>.*?<title>(.*?)<\/title>.*?<content>(.*?)<\/content>.*?<\/section>/gs));
  let sectionIndex = 1;
  for (const match of sectionMatches) {
    if (sectionIndex <= 3) {
      sections.push({
        title: match[1].trim(),
        content: match[2].trim(),
        section_type: 'point' as const,
        order_index: sectionIndex
      });
      sectionIndex++;
    }
  }

  // Extract conclusion
  const conclusionMatch = lessonContent.match(/<conclusion>.*?<title>(.*?)<\/title>.*?<content>(.*?)<\/content>.*?<\/conclusion>/s);
  if (conclusionMatch) {
    sections.push({
      title: conclusionMatch[1].trim(),
      content: conclusionMatch[2].trim(),
      section_type: 'conclusion' as const,
      order_index: 4
    });
  }

  // Validate sections
  if (sections.length !== 5) {
    console.error('Invalid number of sections:', sections.length, 'Raw content:', content);
    throw new Error(`Failed to generate all required sections (got ${sections.length}, expected 5)`);
  }

  const emptySections = sections.filter(s => !s.content || !s.title);
  if (emptySections.length > 0) {
    console.error('Some sections are incomplete:', emptySections, 'Raw content:', content);
    throw new Error('Failed to generate complete lesson content');
  }

  // Log successful generation
  console.log('Successfully generated lesson:', { title, difficulty, sectionCount: sections.length });

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

    console.log('Generating lesson for topic:', topic);
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
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
