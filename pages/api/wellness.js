// pages/api/wellness.js

export default async function handler(req, res) {
  try {
    console.log("🔥 /api/wellness called with method:", req.method);

    if (req.method === "POST") {
      const { message } = req.body;
      console.log("Received message:", message);

      if (!message) {
        console.error("❌ No message provided in request body");
        return res.status(400).json({ error: "Message is required" });
      }

      // Here you would normally call your AI service
      // For testing, we return a dummy response
      const reply = `You said: "${message}". I'm here to listen.`;

      console.log("Sending reply:", reply);

      return res.status(200).json({ reply });
    } else {
      console.warn("⚠️ Method not allowed:", req.method);
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (err) {
    console.error("🔥 Backend error in /api/wellness:", err);
    res.status(500).json({ error: "Backend failed" });
  }
}
