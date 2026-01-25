import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/matches.css";

export default function Matches() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runMatching = async () => {
      setLoading(true);

      // 1️⃣ Fetch lost & found
      const lostSnap = await getDocs(
        query(collection(db, "items"), where("type", "==", "lost"))
      );
      const foundSnap = await getDocs(
        query(collection(db, "items"), where("type", "==", "found"))
      );

      const lostItems = lostSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const foundItems = foundSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      const matches = [];

      // 2️⃣ Compare each lost with each found
      for (const lost of lostItems) {
        for (const found of foundItems) {
          const res = await fetch("http://localhost:5000/compare", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemA: lost,
              itemB: found
            })
          });

          const data = await res.json();

          if (data.score >= 50) {
            matches.push({
              lost,
              found,
              ...data
            });
          }
        }
      }

      setResults(matches);
      setLoading(false);
    };

    runMatching();
  }, []);

  if (loading) return <p>Matching items using AI…</p>;
  if (!results.length) return <p>No similar items found</p>;

  return (
    <div className="matches-container">
      <h2>Matches</h2>

      {results.map((m, i) => (
        <div key={i} className="match-card">
          <div className="match-items">
            <div className="match-item">
              <b>Lost:</b> {m.lost.title}
              <p>{m.lost.description}</p>
            </div>

            <div className="match-item">
              <b>Found:</b> {m.found.title}
              <p>{m.found.description}</p>
            </div>
          </div>

          <div className="match-meta">
            <span className={`confidence ${m.confidence}`}>
              {m.confidence.toUpperCase()}
            </span>
            <span>Score: {m.score}</span>
          </div>

          <p className="match-reason">🧠 {m.reason}</p>
        </div>
      ))}
    </div>
  );
}
