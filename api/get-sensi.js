export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) throw new Error("API Key missing in Vercel");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: `Sensi for ${body.device}` }]
      })
    });

    const data = await response.json();
    
    // If Groq returns an error, send that back clearly
    if (data.error) {
        return res.status(200).json({ text: "Groq Error: " + data.error.message });
    }

    res.status(200).json({ text: data.choices[0].message.content });
  } catch (e) {
    // This sends the actual error to your screen
    res.status(200).json({ text: "System Error: " + e.message });
  }
}
