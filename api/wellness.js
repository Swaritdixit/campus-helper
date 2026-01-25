import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
      console.error("❌ API_KEY missing");
      return res.status(500).json({ error: "Server misconfigured" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are MindCare AI, a calm, empathetic mental wellness assistant.
Respond in a supportive, non-judgmental, gentle tone.
Do not give medical advice.
Encourage reflection and emotional expression.

User says:
"${message}"
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Wellness Gemini error:", err);
    return res.status(500).json({ error: "Backend failed" });
  }
}
