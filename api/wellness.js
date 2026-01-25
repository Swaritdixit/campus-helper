import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Validate Method
  if (req.method !== "POST") {
    console.log("❌ Method not allowed:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Validate Body
  const { message } = req.body;
  if (!message) {
    console.log("❌ Message missing in request body");
    return res.status(400).json({ error: "Message missing" });
  }

  // 3. Validate API Key
  const API_KEY = process.env.GOOGLE_API_KEY;
  if (!API_KEY) {
    console.error("❌ GOOGLE_API_KEY missing in env");
    return res.status(500).json({ error: "Server misconfigured: API Key missing" });
  }

  try {
    console.log("✅ Initializing Gemini AI...");
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // FIX: Changed "gemini/2.5/flash" to "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are MindCare AI, a calm, empathetic mental wellness assistant.
      Respond in a supportive, non-judgmental, gentle tone.
      Do not give medical advice.
      Encourage reflection and emotional expression.

      User says: "${message}"
    `;

    console.log("✅ Sending request to Google Generative AI...");
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from AI model");
    }

    console.log("✅ Successfully generated reply");
    return res.status(200).json({ reply: text });

  } catch (err) {
    // Log the specific error for debugging
    console.error("❌ Wellness Gemini error:", err.message);

    // Provide a gentle error message to the user
    return res.status(500).json({
      error: "I'm having a little trouble connecting right now, but I'm still here with you 💙",
      details: err.message // Optional: remove in production
    });
  }
}