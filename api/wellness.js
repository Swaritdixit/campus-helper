import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error("❌ API_KEY missing in environment variables");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userMessage } = req.body;
  if (!userMessage) {
    return res.status(400).json({ error: "Message missing" });
  }

  const prompt = `You are a calm, empathetic mental wellness assistant.
Respond kindly and supportively.
User: ${userMessage}`;

  try {
    const result = await model.generateContent(prompt);

    const reply =
      result.response.text() ||
      "I'm here to listen. Can you tell me more?";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Gemini error:", err);

    // IMPORTANT: always return JSON
    return res.status(200).json({
      reply:
        "I'm having a little trouble right now, but I'm here with you. Please try again."
    });
  }
}
