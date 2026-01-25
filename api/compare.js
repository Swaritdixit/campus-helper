// /api/compare.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { itemA, itemB } = req.body;
    if (!itemA || !itemB)
      return res.status(400).json({ error: "itemA or itemB missing" });

    const ta = `${itemA.title || ""} ${itemA.description || ""}`.toLowerCase();
    const tb = `${itemB.title || ""} ${itemB.description || ""}`.toLowerCase();

    const wordsA = new Set(ta.split(/\s+/));
    const wordsB = new Set(tb.split(/\s+/));

    let commonWords = 0;
    for (let w of wordsA) if (wordsB.has(w)) commonWords++;

    const score = Math.min(100, commonWords * 25);
    const confidence = score >= 50 ? "high" : "low";

    res.status(200).json({
      score,
      confidence,
  
    });
  } catch (err) {
    console.error("Compare error:", err);
    res.status(500).json({ error: "Compare failed" });
  }
}
