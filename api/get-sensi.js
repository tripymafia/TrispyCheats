module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel already parses the JSON for us, so we just extract the device
    const { device } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const apiKey = process.env.GROK_API_KEY;

    // Connect to Grok AI directly
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-2-1212",
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
    
    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        res.status(500).json({ text: "AI Error: Could not generate settings." });
    }
    
  } catch (error) {
    res.status(500).json({ text: "Server Error: Unable to connect to Grok AI." });
  }
};
