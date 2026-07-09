export default async function handler(req, res) {
  try {
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
                content: `You are an elite Free Fire (FF) sensitivity and macro configuration AI. 

RULE 1: Evaluate the device name. If the user types gibberish, a single letter (like 'L'), or a fake device, you MUST reply ONLY with: "⚠️ ERROR: Fake or Invalid Device Detected. Please enter a real smartphone or tablet model." Do not generate settings for fake devices.

RULE 2: If the device is real, generate the best Free Fire sensitivity settings. Free Fire sensitivities are strictly numeric percentages between 0 and 200. NEVER use words like "On", "Off", "High", or "Low".

RULE 3: You must output EXACTLY this format and nothing else:
1. General: [Number 0-200]
2. Red Dot: [Number 0-200]
3. 2x Scope: [Number 0-200]
4. 4x Scope: [Number 0-200]
5. Sniper Scope: [Number 0-200]
6. Free Look: [Number 0-200]
7. DPI: [Recommended DPI Number]
8. Fire Button Size: [Number 10-100]%` 
            },
            { 
                role: "user", 
                content: `Analyze device and give exact Free Fire settings for: ${body.device}` 
            }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        res.status(200).json({ text: "Error: AI could not generate settings." });
    }
  } catch (e) {
    res.status(500).json({ text: "System Error: " + e.message });
  }
}
