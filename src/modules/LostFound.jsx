import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import Matches from "./Matches";
import "../styles/lostfound.css";

export default function LostFound() {
  const [mainTab, setMainTab] = useState("lost"); // lost | found | matches
  const [subTab, setSubTab] = useState("all");   // all | my
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);

  const loadItems = async (tab, toggle) => {
    if (tab === "matches") return; // handled separately
    setLoading(true);
    setItems([]); // clear immediately to prevent old items showing
    const ref = collection(db, "items");
    let q;

    if (toggle === "my" && auth.currentUser) {
      q = query(
        ref,
        where("ownerUid", "==", auth.currentUser.uid),
        where("type", "==", tab)
      );
    } else {
      q = query(ref, where("type", "==", tab));
    }

    const snap = await getDocs(q);
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    loadItems(mainTab, subTab);
    setFocusedCard(null);
  }, [mainTab, subTab]);

  const handlePageClick = () => setFocusedCard(null);

  return (
    <div className="lf-page" onClick={handlePageClick}>
      {/* TOP CONTROLS */}
      <div className="lf-top-controls">
        <div className="lf-tabs main">
          <button
            className={mainTab === "lost" ? "active" : ""}
            onClick={(e) => { e.stopPropagation(); setMainTab("lost"); setSubTab("all"); }}
          >
            Lost
          </button>
          <button
            className={mainTab === "found" ? "active" : ""}
            onClick={(e) => { e.stopPropagation(); setMainTab("found"); setSubTab("all"); }}
          >
            Found
          </button>
          <button
            className={mainTab === "matches" ? "active" : ""}
            onClick={(e) => { e.stopPropagation(); setMainTab("matches"); }}
          >
            Matches
          </button>
        </div>

        {mainTab !== "matches" && (
          <div className="lf-toggle">
            <span>My {mainTab.charAt(0).toUpperCase() + mainTab.slice(1)}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={subTab === "my"}
                onChange={(e) => { e.stopPropagation(); setSubTab(e.target.checked ? "my" : "all"); }}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>

      {/* LOST / FOUND GRID */}
      {mainTab !== "matches" && (
        <>
          {loading && <p className="lf-loading">Loading {mainTab} items…</p>}
          <div className="lf-grid">
            {items.map(item => (
              <div
                key={item.id}
                className={`lf-card ${focusedCard?.id === item.id ? "focused" : focusedCard ? "blur-background" : ""}`}
                onClick={(e) => { e.stopPropagation(); setFocusedCard(item); }}
              >
                <img src={item.photoUrl || "/placeholder.png"} alt={item.title} />
                <div className="lf-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="lf-location">📍 {item.location}</span>
                  <button
                    className="contact-owner-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Contact ${item.ownerName || "owner"}!`);
                    }}
                  >
                    Contact Owner
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MATCHES */}
      {mainTab === "matches" && <Matches />}
    </div>
  );
}
