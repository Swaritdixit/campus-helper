import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("❌ API_KEY missing in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "userMessage missing" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
You are MindCare AI, a calm, empathetic self-care assistant.
Your job is to:
- Respond gently and supportively
- Never judge or lecture
- Encourage reflection and emotional safety
- Keep responses short, warm, and human
      `,
    });

    const result = await model.generateContent(userMessage);

    const reply =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here with you. Want to talk a little more about how you're feeling?";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Wellness API error:", err);
    return res.status(500).json({ error: "Backend failed" });
  }
}
