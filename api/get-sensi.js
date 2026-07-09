export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) throw new Error("API Key missing in Vercel configuration.");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Using the active, versatile model we confirmed works
        model: "llama-3.3-70b-versatile",
        messages: [
            // Strict instructions for a short, clean response
            { 
                role: "system", 
                content: "You are a pro gaming configurator. Give ONLY 3 lines: 1. Sensitivity (General/Red Dot/Scopes), 2. DPI, 3. Fire Button Size. Keep it under 50 words total. Do not add introductions or explanations." 
            },
            { 
                role: "user", 
                content: `Give best settings for ${body.device}` 
            }
        ]
      })
    });

    const data = await response.json();

    // Safety check to prevent UI crashes
    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        res.status(200).json({ text: "API Warning: " + JSON.stringify(data) });
    }
  } catch (e) {
    res.status(500).json({ text: "System Error: " + e.message });
  }
}
