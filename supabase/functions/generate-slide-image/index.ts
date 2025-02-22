
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const falApiKey = Deno.env.get('FAL_AI_KEY')

  if (!falApiKey) {
    return new Response(
      JSON.stringify({ error: 'FAL AI API key not configured' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }

  try {
    const { image_description } = await req.json()

    if (!image_description) {
      return new Response(
        JSON.stringify({ error: 'No image description provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Generating image for description:', image_description)

    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: {
          prompt: image_description,
          seed: Math.floor(Math.random() * 1000000),
          image_size: "landscape_4_3",
          num_images: 1,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`FAL AI API error: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('Generated image result:', result)

    // FAL AI returns an array of images, we'll take the first one
    const imageUrl = result.images[0].url

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
