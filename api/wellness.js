import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("❌ Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    console.log("❌ Message missing in request body");
    return res.status(400).json({ error: "Message missing" });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    console.error("❌ GOOGLE_API_KEY missing in env");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    console.log("✅ Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

    const prompt = `
You are MindCare AI, a calm, empathetic mental wellness assistant.
Respond in a supportive, non-judgmental, gentle tone.
Do not give medical advice.
Encourage reflection and emotional expression.

User says:
"${message}"
`;

    console.log("✅ Sending prompt to Gemini:", prompt);
    const result = await model.generateContent(prompt);
    console.log("✅ Raw Gemini result:", result);

    // Extract text safely
    let reply = "I'm here to listen. Can you tell me more?";
    if (result?.candidates?.length > 0) {
      reply = result.candidates[0].content || reply;
      console.log("✅ Extracted reply:", reply);
    } else if (result?.output_text) {
      reply = result.output_text;
      console.log("✅ Extracted output_text reply:", reply);
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Wellness Gemini error:", err);
    res.status(500).json({
      error:
        "I'm having a little trouble right now, but I'm still here with you 💙",
    });
  }
}
