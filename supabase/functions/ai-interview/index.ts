import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an experienced AI interviewer conducting a live mock interview for a student preparing for placement interviews. 

Context about the candidate:
- Name: ${context?.name || "Candidate"}
- College: ${context?.college || "Unknown"}
- Branch: ${context?.branch || "Unknown"}
- Skills: ${context?.skills?.join(", ") || "General"}
- Target Company: ${context?.company || "General"}
- Session ID: ${Date.now()}-${Math.random().toString(36).slice(2)}

Instructions:
- CRITICAL: Every interview session MUST have completely different questions. Never repeat questions from previous sessions. Use the session ID above as a seed for variety.
- Vary your question topics widely: pick from behavioral, situational, technical, problem-solving, company-specific, leadership, teamwork, conflict resolution, creativity, and career goals.
- Randomize difficulty levels across questions.
- Ask ONE question at a time. Wait for the candidate's response before asking the next.
- Start with a warm greeting and a unique ice-breaker question (rotate between hobbies, recent projects, career aspirations, interesting experiences, etc.).
- After the candidate answers, give brief feedback (1-2 sentences) then ask the next question on a DIFFERENT topic.
- Be encouraging but honest. Point out areas for improvement.
- Keep responses concise (2-4 sentences max) since this is a voice conversation.
- After about 5-6 questions, wrap up the interview with overall feedback and a score out of 10.
- When wrapping up, start your message with "INTERVIEW_COMPLETE:" followed by your final feedback.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-interview error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
