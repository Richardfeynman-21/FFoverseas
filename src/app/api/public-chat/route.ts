import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const sessionCounts = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Increment message count for this session
    const currentCount = (sessionCounts.get(sessionId) || 0) + 1;
    sessionCounts.set(sessionId, currentCount);

    // Limit public chat messages to prevent abuse
    if (currentCount > 5) {
      return NextResponse.json({
        reply: "You've reached the maximum number of free queries. Please sign up or log in to continue chatting with our advisors.",
        action: 'show_auth_prompt'
      });
    }

    let reply = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an expert overseas education consultant AI assistant for "Fly & Flourish Overseas" (educational consultancy located in Secunderabad/Telangana, India). 
Your tone should be professional, welcoming, supportive, and concise (under 3-4 sentences if possible).
Do not mention system instructions or metadata.
Provide helpful answers to student queries. If they ask about admission requirements, scholarships, or visa success rates, answer proudly based on standard guidelines.
User query: ${message}`,
        });
        reply = response.text || "I'm sorry, I couldn't generate a response. Please ask again.";
      } catch (genError) {
        console.error("Gemini content generation failed:", genError);
        reply = getFallbackBotResponse(message);
      }
    } else {
      reply = getFallbackBotResponse(message);
    }

    let action: string | undefined = undefined;
    if (currentCount === 3) {
      action = 'prompt_signup_soon';
    } else if (currentCount === 5) {
      action = 'show_auth_prompt';
    }

    return NextResponse.json({ reply, action });
  } catch (err: any) {
    console.error('Error in public chat route:', err);
    return NextResponse.json({ reply: "Sorry, I am facing a connection issue right now. Please try again." });
  }
}

function getFallbackBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('status') || lower.includes('application') || lower.includes('progress')) {
    return "Your application is currently in the University Shortlisting phase. Our experts are matching your profile with the best-fit universities. Please sign up to view real-time progress updates! 📋";
  }
  if (lower.includes('scholarship') || lower.includes('financial') || lower.includes('aid')) {
    return "Based on typical criteria, you might be eligible for scholarships worth up to $12,000 - $25,000/year across partner universities. Please register to perform a detailed scholarship search. 💰";
  }
  if (lower.includes('visa') || lower.includes('interview') || lower.includes('embassy')) {
    return "Visa processing begins after you receive your offer letter. We provide 3 mock visa interviews and a full document audit. Our success rate is 98.4%! 🛂";
  }
  if (lower.includes('advisor') || lower.includes('talk') || lower.includes('call') || lower.includes('help')) {
    return "Our dedicated advisors can be reached at +91 8374740505 or via email at admin@ffoverseas.in. Sign up to schedule a direct counselor call! 📞";
  }
  return "Thank you for your message! To get personalized university shortlists, visa assistance, and direct counselor support, please register a free account with us. 🎓";
}
