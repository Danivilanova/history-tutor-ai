
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { sectionId } = await req.json()

    // Fetch the section content
    const { data: sectionData, error: sectionError } = await supabase
      .from('lesson_sections')
      .select('*')
      .eq('id', sectionId)
      .single()

    if (sectionError) throw sectionError

    // Generate AI image using Fal.ai
    const imageResponse = await fetch('https://api.fal.ai/v1/stable-diffusion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('FAL_AI_KEY')}`,
      },
      body: JSON.stringify({
        prompt: `historical illustration of ${sectionData.title} during the fall of Rome, detailed, realistic, classical art style`,
        negative_prompt: "modern, contemporary, cartoonish",
        image_size: "768x768",
        num_inference_steps: 30,
      }),
    })

    if (!imageResponse.ok) {
      throw new Error(`Failed to generate image: ${await imageResponse.text()}`)
    }

    const imageData = await imageResponse.json()
    const generatedImageUrl = imageData.images[0].url

    // Generate a concise summary/highlight from the content
    const summaryResponse = await fetch('https://api.fal.ai/v1/text/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('FAL_AI_KEY')}`,
      },
      body: JSON.stringify({
        prompt: `Extract a key historical fact or interesting detail from this text about the Fall of Rome: "${sectionData.content}"`,
        max_tokens: 100,
      }),
    })

    if (!summaryResponse.ok) {
      throw new Error(`Failed to generate summary: ${await summaryResponse.text()}`)
    }

    const summaryData = await summaryResponse.json()
    const generatedText = summaryData.text

    // Store the generated content
    const { data: contentData, error: contentError } = await supabase
      .from('generated_content')
      .insert({
        section_id: sectionId,
        prompt: `Historical fact about ${sectionData.title}`,
        generated_text: generatedText,
        generated_image_url: generatedImageUrl,
      })
      .select()
      .single()

    if (contentError) throw contentError

    return new Response(
      JSON.stringify(contentData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
