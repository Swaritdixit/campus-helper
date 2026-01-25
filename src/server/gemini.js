import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Check API key
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("❌ GOOGLE_API_KEY missing in .env");
  process.exit(1);
}
console.log("✅ GOOGLE_API_KEY loaded:", API_KEY.slice(0, 6), "...");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini/2.5/flash" });

// ----------------------
// POST /api/gemini
// ----------------------
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt missing" });

    const result = await model.generateContent(prompt);
    const responseText = result?.response?.text ? result.response.text() : String(result);

    res.json({ reply: responseText });
  } catch (err) {
    console.error("❌ Gemini error:", err);
    res.status(500).json({ error: "Gemini failed" });
  }
});

// ----------------------
// POST /compare
// ----------------------
app.post("/compare", async (req, res) => {
  try {
    const { itemA, itemB } = req.body;
    if (!itemA || !itemB) return res.status(400).json({ error: "itemA or itemB missing" });

    const ta = `${itemA.title || ""} ${itemA.description || ""}`.toLowerCase();
    const tb = `${itemB.title || ""} ${itemB.description || ""}`.toLowerCase();

    const wordsA = new Set(ta.split(/\s+/));
    const wordsB = new Set(tb.split(/\s+/));

    let commonWords = 0;
    for (let w of wordsA) if (wordsB.has(w)) commonWords++;

    const score = Math.min(100, commonWords * 25);
    const confidence = score >= 50 ? "high" : "low";

    res.json({
      score,
      confidence,
      reason: `Matched ${commonWords} words in title/description`,
    });
  } catch (err) {
    console.error("❌ Compare failed:", err);
    res.status(500).json({ error: "Compare failed" });
  }
});

// ----------------------
// GET / (optional home)
// ----------------------
app.get("/", (req, res) => {
  res.send("✅ Gemini server running. Use /api/gemini or /compare");
});

// ----------------------
// START SERVER
// ----------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
