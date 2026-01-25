import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) console.error("❌ GOOGLE_API_KEY missing");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt missing" });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text
      ? result.response.text()
      : String(result);
    res.status(200).json({ reply: responseText });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
}
