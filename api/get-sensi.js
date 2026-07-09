export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ text: 'Error: Method not allowed' });
  }

  try {
    const { device } = JSON.parse(req.body);
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ text: "Error: API Key is missing in Vercel settings." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a professional gamer. Provide FF Max sensitivity (0-200) and a tip." },
          { role: "user", content: `Best sensitivity for ${device}.` }
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
        return res.status(200).json({ text: data.choices[0].message.content });
    } else {
        return res.status(500).json({ text: "Error: AI response empty." });
    }
  } catch (error) {
    return res.status(500).json({ text: "Error: " + error.message });
  }
}
