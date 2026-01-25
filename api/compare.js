import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) console.error("❌ GOOGLE_API_KEY missing");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body; // ✅ matches frontend
  if (!message)
    return res.status(400).json({ error: "Message missing" });

  try {
    const prompt = `
You are a calm, empathetic mental wellness assistant.
Respond kindly, validate emotions, and avoid medical diagnosis.

User says:
"${message}"
`;

    const result = await model.generateContent(prompt);

    const reply =
      result?.response?.text
        ? result.response.text()
        : "I'm here with you. Tell me more.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Wellness API error:", err);
    res.status(500).json({ error: "Wellness generation failed" });
  }
}
