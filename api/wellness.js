export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      console.error("Missing GOOGLE_API_KEY");
      return res.status(500).json({ error: "Server misconfigured" });
    }
console.log("Gemini Key Loaded:", !!API_KEY);
    // ✅ SYSTEM PROMPT
    const prompt = `
You are MindCare AI.

Rules:
- Be calm and empathetic
- Never judge
- Never give medical advice
- Encourage emotional expression
- Ask gentle follow-up questions
- Keep replies short (2-4 sentences)

User says:
${message}
`;

    // ✅ GEMINI 1.5 FLASH
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here with you. Tell me more about how you're feeling.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Wellness API error:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
}