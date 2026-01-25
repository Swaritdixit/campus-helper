import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "User message is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini/2.5/flash",
    });

    const prompt = `
You are MindCare AI, a calm, empathetic mental wellness assistant.
You respond warmly, supportively, and without judgment.
Never give medical diagnosis. Encourage healthy coping.

User says: "${userMessage}"
Respond kindly:
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Gemini error:", error);
    return res.status(500).json({
      reply: "I'm here with you. Something went wrong, but we can try again 💙",
    });
  }
}
