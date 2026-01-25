import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

app.post("/compare", async (req, res) => {
  try {
    const { itemA, itemB } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You compare lost and found items.

Lost Item:
Title: ${itemA.title}
Description: ${itemA.description}
Location: ${itemA.location}

Found Item:
Title: ${itemB.title}
Description: ${itemB.description}
Location: ${itemB.location}

Respond ONLY as JSON:
{
  "score": number (0-100),
  "confidence": "high" | "medium" | "low",
  "reason": "one short sentence"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json(JSON.parse(text));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Gemini failed" });
  }
});

app.listen(5000, () =>
  console.log("✅ Gemini compare server running on 5000")
);
