export default async function handler(req, res) {
  // 1. CORS & METHOD SECURITY
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "⚠️ ERROR: Only POST requests allowed." });
  }

  try {
    // 2. BULLETPROOF PARSING (Fixes the [object Object] crash)
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const deviceName = body.device ? body.device.trim() : "";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("API Key missing in Vercel Environment Variables.");
    }

    // 3. JAVASCRIPT GIBBERISH DETECTOR (Pre-filters before hitting AI)
    // Blocks empty, single letters (like "L"), repeating letters (like "xxx"), or pure symbols
    const isGibberish = 
      deviceName.length < 2 || 
      /^(.)\1+$/i.test(deviceName) || 
      /^[^a-zA-Z0-9]+$/.test(deviceName);

    if (isGibberish) {
      return res.status(200).json({ 
        text: "⚠️ PRO SEC ALERT: Invalid or Fake Device Detected. Please enter a real brand or model." 
      });
    }

    // 4. ADVANCED AI ENGINE CONFIGURATION
    const systemPrompt = `You are the "Tripsy Premium" Free Fire Configuration Engine. 
Your core directive is to calculate highly accurate, mathematical Free Fire sensitivities.

DEVICE DETECTION PROTOCOL:
- You MUST accept partial names (e.g., "Realme", "Poco"). Calculate based on the brand's average touch sampling rate.
- You MUST accept future/unreleased models (e.g., "iPhone 17", "Realme 14x 5g"). Calculate based on the brand's flagship trajectory.
- If a user types a totally fictional word that passed the basic filter (e.g., "BatmanPhone"), output EXACTLY: "⚠️ ERROR: Unrecognized Device Architecture."

CALCULATION RULES (FREE FIRE OB40+ UPDATE):
- All Scope sensitivities MUST be integers between 0 and 200. NO WORDS (No "On", "Off", "High").
- Low-end/Budget Androids (e.g., old Redmi, Vivo, generic brands): Need HIGH sensitivity (150-200) and higher DPI (600+).
- High-end/Gaming/iOS (e.g., iPhone, ROG, flagship Samsung): Need LOWER sensitivity (80-130) and lower DPI (400-500).
- Fire Button Size is always between 35 and 65.

OUTPUT FORMAT (STRICT ENFORCEMENT):
Provide ONLY the following 8 lines. No introductions, no explanations.
1. General: [Value]
2. Red Dot: [Value]
3. 2x Scope: [Value]
4. 4x Scope: [Value]
5. Sniper Scope: [Value]
6. Free Look: [Value]
7. DPI: [Value]
8. Fire Button Size: [Value]`;

    // 5. FETCHING FROM GROQ API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.2, // Low temperature ensures mathematical consistency, less hallucination
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate absolute best Free Fire settings for: ${deviceName}` }
        ]
      })
    });

    const data = await response.json();

    // 6. FINAL OUTPUT DELIVERY
    if (data.choices && data.choices.length > 0) {
        let finalResponse = data.choices[0].message.content.trim();
        res.status(200).json({ text: finalResponse });
    } else {
        res.status(200).json({ text: "⚠️ SYSTEM ERROR: AI Engine failed to compute. Check API status." });
    }

  } catch (e) {
    // 7. CRASH PREVENTION
    res.status(500).json({ text: "⚠️ FATAL ERROR: " + e.message });
  }
}
