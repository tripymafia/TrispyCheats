import OpenAI from "openai";

// Initialize the client with Grok's Base URL and your new API Key
const openai = new OpenAI({
  apiKey: process.env.grok_api_key || process.env.GROK_API_KEY, 
  baseURL: "https://api.x.ai/v1",
});

export async function POST(req) {
  try {
    // 1. Parse and validate incoming request data
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message input is missing" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Request configuration for Grok
    const response = await openai.chat.completions.create({
      model: "grok-2-1212", 
      messages: [
        { 
          role: "system", 
          content: "You are an expert gaming assistant specializing in optimizing game sensitivity configurations and device performance settings." 
        },
        { role: "user", content: message }
      ],
      temperature: 0.6, // Balanced creativity and accuracy
    });

    // 3. Extract output and return successful response
    const replyText = response.choices[0]?.message?.content || "No response generated.";
    
    return new Response(JSON.stringify({ text: replyText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    // Detailed logging to help track down runtime environment issues
    console.error("Pro-Mode API Error Log:", {
      message: error.message,
      stack: error.stack,
      status: error.status
    });

    return new Response(
      JSON.stringify({ 
        error: "Server Error", 
        message: error.message || "An unexpected error occurred." 
      }), 
      {
        status: error.status || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
