export default async function handler(req, res) {
  console.log("✅ /api/wellness HIT");
  console.log("METHOD:", req.method);
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  if (req.method !== "POST") {
    console.error("❌ Wrong method");
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body || {};

  if (!message) {
    console.error("❌ Message missing in body");
    return res.status(400).json({
      error: "Message missing",
      receivedBody: req.body,
    });
  }

  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!API_KEY) {
    console.error("❌ GOOGLE_API_KEY missing");
    return res.status(500).json({
      error: "Server misconfigured: API Key missing",
    });
  }

  console.log("✅ Message received:", message);
  console.log("✅ API key present");

  // TEMP dummy response (no AI call yet)
  const reply = `I hear you. You said: "${message}"`;

  return res.status(200).json({ reply });
}
