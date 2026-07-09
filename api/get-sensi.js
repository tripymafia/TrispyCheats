export default async function handler(req, res) {
  try {
    // FIX: Safely parse Vercel's body to prevent [object Object] crashes
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
                content: "You are a professional gaming config engine. Provide EXACTLY this list format. DO NOT explain, just output: \n1. General: [Value]\n2. Red Dot: [Value]\n3. 2x Scope: [Value]\n4. 4x Scope: [Value]\n5. Sniper Scope: [Value]\n6. Free Look: [Value]\n7. DPI: [Value]\n8. Fire Button Size: [Value]. \nIf the device is fake or does not exist, provide the best universal high-performance settings instead." 
            },
            { 
                role: "user", 
                content: `Give exact settings for ${body.device}` 
            }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        res.status(200).json({ text: "Error: AI could not generate settings. Check API limits." });
    }
  } catch (e) {
    res.status(500).json({ text: "System Error: " + e.message });
  }
}
