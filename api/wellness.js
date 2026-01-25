import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("❌ API_KEY missing");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Correct Gemini 2.5 model ID for the JS SDK
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "Message missing" });
  }

  const prompt = `
You are a calm, empathetic mental wellness assistant.
Respond kindly and supportively.

User: ${userMessage}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.status(200).json({ reply: responseText });
  } catch (err) {
    console.error("❌ Gemini error:", err);
    return res.status(500).json({ error: "Gemini failed" });
  }
}
