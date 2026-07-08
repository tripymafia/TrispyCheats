import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const { device } = req.query;

  // If no device name is provided, return a clear error
  if (!device) {
    return res.status(400).json({ error: "Device model is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // AI will now receive any device name provided by the user
    const prompt = `Provide the optimal sensitivity settings for the phone model: ${device}. If the device is not a real phone or doesn't exist, politely inform the user. List settings in a clean, readable format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ result: text });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sensitivity from AI" });
  }
}
