export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ text: "⚠️ ERROR: Method not allowed." });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const inputDevice = body.device ? body.device.trim().toLowerCase() : "";
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) throw new Error("Vercel setup error: API Key missing.");

    // 1. GIBBERISH FILTER
    if (inputDevice.length < 2 || /^(.)\1+$/i.test(inputDevice)) {
      return res.status(200).json({ text: "⚠️ ERROR: Invalid entry. Please specify a real device." });
    }

    // 2. HARD-CODED STRICT IPHONE VALIDATION
    // Detects if it's an iPhone request and explicitly checks for valid production numbers
    if (inputDevice.includes("iphone") || inputDevice.includes("apple")) {
      // Extract any numbers from the string (e.g., "iphone 91" -> 91, "iphone 14 pro" -> 14)
      const matches = inputDevice.match(/\d+/);
      if (matches) {
        const iphoneNum = parseInt(matches[0], 10);
        // Valid historical iPhones are from 3 to 16. Anything higher (like 91) is blocked.
        if (iphoneNum < 3 || iphoneNum > 16) {
          return res.status(200).json({ text: "⚠️ ERROR: iPhone model does not exist. Enter a real device." });
        }
      } else {
        // If they just write "iphone" without a number, allow it to fall back to generic brand rules
      }
    }

    // 3. BROAD BRAND REGISTRY CHECK
    const validBrands = ["iphone", "apple", "realme", "poco", "xiaomi", "redmi", "samsung", "vivo", "oppo", "oneplus", "iqoo", "infinix", "tecno", "asus", "rog", "motorola", "moto", "pixel", "google"];
    const hasValidBrand = validBrands.some(brand => inputDevice.includes(brand));

    if (!hasValidBrand) {
      return res.status(200).json({ text: "⚠️ ERROR: Unrecognized phone model. Please provide a valid Android or iOS device name." });
    }

    // 4. THE MASTER AI CONFIG ENGINE
    const systemPrompt = `You are the final, high-accuracy Free Fire (FF) Sensitivity Engineering Engine.
Your task is to analyze the requested phone model and return precise custom game settings based on real touch latency characteristics.

STRICT CONDITIONS:
- All values MUST be unique numeric parameters from 0 to 200 based on device screen types.
- Never output textual state words like "High", "Low", "On", or "Off".
- Low-end or budget devices require higher general sensitivities (e.g., 170-195) to aid dragging physics.
- Flagship premium devices require stabilized ranges (e.g., 90-140) paired with tighter DPI structures.

OUTPUT TEMPLATE:
1. General: [Value]
2. Red Dot: [Value]
3. 2x Scope: [Value]
4. 4x Scope: [Value]
5. Sniper Scope: [Value]
6. Free Look: [Value]
7. DPI: [Value]
8. Fire Button Size: [Value]%`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1, // Keeps mathematical results strict and eliminates creative hallucinations
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Provide accurate Free Fire execution metrics tailored for: ${body.device}` }
        ]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content.trim() });
    } else {
        res.status(200).json({ text: "⚠️ SERVICE ALERT: Unable to compute profile. Try again." });
    }

  } catch (e) {
    res.status(500).json({ text: "⚠️ SYSTEM CRASH: " + e.message });
  }
}
