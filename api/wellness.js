import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      return res.status(200).json({
        reply: "Invalid request method."
      });
    }

    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      return res.status(200).json({
        reply: "Wellness service is not configured yet."
      });
    }

    const { userMessage } = req.body || {};
    if (!userMessage) {
      return res.status(200).json({
        reply: "I'm listening. Tell me how you feel."
      });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(userMessage);

    const reply =
      result?.response?.text?.() ||
      "I'm here to listen. Can you tell me more?";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("❌ Wellness API crashed:", err);

    // ⚠️ CRITICAL: never send non-JSON
    return res.status(200).json({
      reply:
        "I'm here with you. Something went wrong, but you can keep talking."
    });
  }
}
