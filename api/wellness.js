// api/wellness.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("❌ API_KEY missing");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userMessage } = req.body;
  if (!userMessage) return res.status(400).json({ error: "User message is required" });

  // Prompt dynamically uses the user's message
  const prompt = `
You are a calm, empathetic, and supportive mental wellness assistant named "MindCare AI".
Provide gentle, caring, and helpful responses. Offer comfort, encouragement, and guidance
without giving medical advice. Engage in a friendly and understanding manner.

User: ${userMessage}
Assistant:
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text
      ? result.response.text()
      : "I'm here with you. Can you tell me more about how you're feeling?";

    res.status(200).json({ reply: responseText });
  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
}
