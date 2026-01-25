import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GOOGLE_API_KEY;

console.log("KEY CHECK:", API_KEY?.slice(0, 6));

if (!API_KEY) {
  console.error("❌ GOOGLE_API_KEY not found");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ CORRECT + SUPPORTED MODEL
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash",
});

// optional root check
app.get("/", (req, res) => {
  res.send("Gemini backend running ✅");
});

// ✅ MAIN API
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Gemini server running on http://localhost:5000");
});
