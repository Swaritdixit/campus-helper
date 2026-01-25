// api/wellness.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("❌ API_KEY missing in .env");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userMessage } = req.body;

    if (!userMessage) return res.status(400).json({ error: "User message is required" });

    const prompt = `
You are MindCare AI, a calm, empathetic mental wellness assistant.
Respond supportively and gently to the user.

User: ${userMessage}
Assistant:
`;

    const result = await model.generateContent(prompt);
    const reply = result?.response?.text ? result.response.text() : "I'm here to listen. Can you tell me more?";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Wellness API failed:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
}
