# History Tutor AI

Hey there! 👋 I built History Tutor AI for the ElevenLabs & a16z AI Agents Hackathon, and I’m honestly really happy with the result. I got inspired by Andrej Karpathy’s vision for AI in education ([EurekaLabs](https://eurekalabs.ai)), and I wanted to make sure that history didn’t just feel like a series of dates and facts to memorize, but rather a fun conversation with a cool tutor. You can pick if your tutor is nice, strict, or funny, and talk to them like a friend!

## What It Does

Here’s what History Tutor AI can do:

- Pick Your Tutor: Choose a tutor who’s sweet (Sarah), serious (Dr. Thompson), or silly (Alex). Each one teaches in their own fun way!
- Your Kind of Lessons: Try lessons we made, like "Ancient Egyptian Pyramids," or ask about any history topic you like!
- Talk to Them: Chat with your tutor using your voice. Ask anything—it’s like talking to a real person!
- Feel the Fun: Your tutor can cheer you up or make you laugh, depending on who you pick!
- Win Big: Finish a lesson and get a fun confetti party to celebrate!

## How It's Made

I teamed up with [Lovable](https://lovable.dev/) to pull this off. Here’s the tech stack:
- Frontend: React, TypeScript, Tailwind CSS, and shadcn-ui.
- Backend: Supabase powers it all—edge functions, database, and storage.
- AI:
  - ElevenLabs for the voice interaction.
  - fal.ai for the text and image generation.

## How to Set It Up

Want to try it out yourself? Here’s what you need to do:

### What You’ll Need First

- Node.js and npm installed on your machine.
- Accounts and API keys from:
  - [Supabase](https://supabase.com/)
  - [ElevenLabs](https://elevenlabs.io/)
  - [fal.ai](https://fal.ai/)

### Environment Variables

No `.env` file here! Since we’re using Supabase Edge Functions, you’ll set these as secrets in the Supabase dashboard. Head to Edge Functions > Secrets and add:

- `ELEVEN_LABS_API_KEY=<your-elevenlabs-api-key>`
- `FAL_KEY=<your-fal-ai-key>`

### Update Supabase Config

You’ll need to tweak your Supabase URL and publishable key in the code. Open up `src/integrations/supabase/client.ts` and update these lines:

```typescript
const SUPABASE_URL = "<your-supabase-url>";
const SUPABASE_PUBLISHABLE_KEY = "<your-supabase-publishable-key>";
```

### Get It Running

1. **Clone the repo**

```bash
git clone https://github.com/danivilanova/history-tutor-ai.git
```

2. **Install dependencies**

```bash
cd history-tutor-ai
npm install
```

3. **Run the app**

```bash
npm run dev
```

## Why I Built This

I’ve been obsessed with Andrej Karpathy’s ideas about AI in education—especially his work with Eureka Labs. The thought of an “AI-native school” got me hyped: what if everyone could have a personal tutor for anything? So I decided to build History Tutor AI. It’s not a perfect project, but I hope you find it interesting and useful!

## Links

- Devpost Project: [History Tutor AI](https://devpost.com/software/history-tutor-ai)
- Hackathon: [ElevenLabs & a16z AI Agents Hackathon](https://elevenlabs-worldwide-hackathon.devpost.com)