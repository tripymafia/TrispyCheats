export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GROK_API_KEY;
    
    // Safety Check 1: Is the key missing?
    if (!apiKey) {
        return res.status(500).json({ text: 'GROK_API_KEY is missing! You must click "Redeploy" in Vercel.' });
    }

    const device = req.body.device || 'Unknown Device';

    // Connect to Grok API directly
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-beta", // Safest model endpoint for xAI
        messages: [
          {
            role: "system",
            content: "You are an elite Free Fire Max expert. Provide premium, accurate sensitivity settings (0-200 scale) for specific mobile devices."
          },
          { 
            role: "user", 
            content: `Give the best Free Fire Max sensitivity (Scale 0-200) for the device: ${device}. Format cleanly with General, Red Dot, 2x, 4x, and one pro tip.` 
          }
        ]
      })
    });

    const data = await response.json();
    
    // Safety Check 2: Did Grok reject our API Key?
    if (!response.ok) {
        return res.status(500).json({ text: `Grok API Error: ${data.error?.message || 'Unauthorized Key'}` });
    }

    // Safety Check 3: Success
    if (data.choices && data.choices.length > 0) {
        return res.status(200).json({ text: data.choices[0].message.content });
    } else {
        return res.status(500).json({ text: "AI returned an empty response." });
    }
    
  } catch (error) {
    // Safety Check 4: Complete Server Crash
    return res.status(500).json({ text: `Vercel Server Crash: ${error.message}` });
  }
}
