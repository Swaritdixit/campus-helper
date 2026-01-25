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

    // Initialize client
    const aiClient = new GoogleGenerativeAI({ apiKey: API_KEY });

    const prompt = `
You are MindCare AI, a calm, empathetic mental wellness assistant.
Respond in a supportive, non-judgmental, gentle tone.
Do not give medical advice.
Encourage reflection and emotional expression.

User says:
"${message}"
`;

    // Generate response
    const result = await aiClient.generateText({
      model: "gemini-1.5-flash",
      text: prompt,
    });

    // Extract the AI's reply
    const reply = result.output[0].content;

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Wellness Gemini error:", err);
    return res.status(500).json({ error: "Backend failed" });
  }
}
