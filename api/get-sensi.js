export default async function handler(req, res) {
  try {
    // FIX: Vercel sometimes auto-parses. This checks if it's already an object to prevent the crash!
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) throw new Error("API Key missing in Vercel.");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
            { 
                role: "system", 
                content: "You are a pro gaming configurator. Give ONLY 3 lines: 1. Sensitivity, 2. DPI, 3. Fire Button Size. Keep it extremely brief." 
            },
            { 
                role: "user", 
                content: `Best settings for ${body.device}` 
            }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        res.status(200).json({ text: "Groq API Warning: " + JSON.stringify(data) });
    }
  } catch (e) {
    res.status(500).json({ text: "System Error: " + e.message });
  }
}
