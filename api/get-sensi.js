import { GoogleGenAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // CORS Headers (Allows your website to call this API without errors)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // If it's an OPTIONS request (Preflight request), respond and stop here
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Get the API Key from Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key (GEMINI_API_KEY) missing in Vercel." });
    }

    // 2. Initialize GoogleGenAI correctly
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 3. Set the model and prompt (gemini-2.5-flash is fast and accurate)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, give me a quick motivation quote.', 
    });

    // 4. Return the response as JSON
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
