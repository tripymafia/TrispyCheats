export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);
    const apiKey = process.env.GROQ_API_KEY;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: `Best sensitivity for ${body.device}` }]
      })
    });

    const data = await response.json();

    // SAFETY CHECK: Does the data contain what we need?
    if (data.choices && data.choices.length > 0) {
        res.status(200).json({ text: data.choices[0].message.content });
    } else {
        // If not, show exactly what Groq sent back so we can see the issue
        res.status(200).json({ text: "Groq Response: " + JSON.stringify(data) });
    }
  } catch (e) {
    res.status(500).json({ text: "Error: " + e.message });
  }
}
