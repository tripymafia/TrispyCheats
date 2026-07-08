import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROK_API_KEY, // Keeping this name so you don't have to change your Vercel settings again
  baseURL: "https://api.x.ai/v1",    // Grok's official API Base URL
});

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "grok-2-1212", // You can use "grok-2-1212" or "grok-beta" depending on your access
      messages: [
        { role: "user", content: message }
      ],
    });

    return new Response(JSON.stringify({ text: response.choices[0].message.content }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error with Grok API:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
