import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/matches.css";

export default function Matches() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Fetch lost & found items from Firebase
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const lostSnap = await getDocs(
          query(collection(db, "items"), where("type", "==", "lost"))
        );
        const foundSnap = await getDocs(
          query(collection(db, "items"), where("type", "==", "found"))
        );

        const lostData = lostSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const foundData = foundSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        setLostItems(lostData);
        setFoundItems(foundData);
        setMatches([]);
        setLoading(false);

        runMatching(lostData, foundData);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Basic pre-filter match (words in title/description)
  const basicMatch = (a, b) => {
    const ta = `${a.title || ""} ${a.description || ""}`.toLowerCase();
    const tb = `${b.title || ""} ${b.description || ""}`.toLowerCase();
    return ta.split(" ").some(w => tb.includes(w));
  };

  // Run matching using serverless compare API
  const runMatching = async (lostData, foundData) => {
    setAiProcessing(true);

    for (const lost of lostData) {
      for (const found of foundData) {
        if (!basicMatch(lost, found)) continue;

        try {
          const res = await fetch("/api/compare", { // Vercel-ready endpoint
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemA: lost, itemB: found }),
          });

          if (!res.ok) continue;

          const data = await res.json();

          if (data.score >= 50) {
            setMatches(prev => [...prev, { lost, found, ...data }]);
          }
        } catch (err) {
          console.error("Compare failed:", err);
        }
      }
    }

    setAiProcessing(false);
  };

  if (loading) return <p>Loading lost & found items…</p>;
  if (!lostItems.length || !foundItems.length) return <p>No lost or found items yet</p>;

  return (
    <div className="matches-container">
      <h2>Matches</h2>

      {matches.length === 0 && aiProcessing && <p>Finding similar items…</p>}
      {matches.length === 0 && !aiProcessing && <p>No similar items found</p>}

      <div className="matches-grid">
        {matches.map((m, i) => (
          <div key={i} className="match-card">
            <div className="match-items">
              <div className="match-item">
                <img src={m.lost.photoUrl || "/placeholder.png"} alt={m.lost.title} />
                <b>Lost:</b> {m.lost.title}
                <p>{m.lost.description}</p>
              </div>

              <div className="match-item">
                <img src={m.found.photoUrl || "/placeholder.png"} alt={m.found.title} />
                <b>Found:</b> {m.found.title}
                <p>{m.found.description}</p>
              </div>
            </div>

            <div className="match-meta">
              <span className={`confidence ${m.confidence}`}>{m.confidence.toUpperCase()}</span>
              <span>Score: {m.score}</span>
            </div>

            <p className="match-reason">🧠 {m.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
