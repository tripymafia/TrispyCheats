export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { device } = JSON.parse(req.body);
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ text: 'GROQ_API_KEY missing in Vercel settings.' });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Fast and free model
        messages: [
          {
            role: "system",
            content: "You are a gaming expert. Provide sensitivity (0-200) and pro tips."
          },
          { 
            role: "user", 
            content: `Give the best Free Fire Max sensitivity (Scale 0-200) for: ${device}. Return stats and 1 pro tip.` 
          }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        res.status(500).json({ text: "AI returned an empty response." });
    }
    
  } catch (error) {
    res.status(500).json({ text: "Server Error: Unable to connect to Groq AI." });
  }
}
