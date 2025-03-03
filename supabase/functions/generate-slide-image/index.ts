
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const falKey = Deno.env.get('FAL_KEY')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!falKey || !supabaseUrl || !supabaseKey) {
    return new Response(
      JSON.stringify({ error: 'Missing required environment variables' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { image_description } = await req.json()

    if (!image_description) {
      return new Response(
        JSON.stringify({ error: 'No image description provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: image_description,
        seed: Math.floor(Math.random() * 1000000),
        num_images: 1,
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`FAL AI API error: ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    const generatedImageUrl = result.images[0].url

    const imageResponse = await fetch(generatedImageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to download generated image')
    }

    const imageBlob = await imageResponse.blob()
    const fileName = `${crypto.randomUUID()}.png`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('slides')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      })

    if (uploadError) {
      throw new Error(`Failed to upload image to storage: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('slides')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating or storing image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate or store image', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
