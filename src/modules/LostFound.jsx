import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import Matches from "./Matches";
import "../styles/lostfound.css";

export default function LostFound() {
  const [mainTab, setMainTab] = useState("lost");   // lost | found | matches
  const [subTab, setSubTab] = useState("all");     // all | my
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Load Lost / Found items */
  const loadItems = async () => {
    if (mainTab === "matches") return;

    setLoading(true);
    const ref = collection(db, "items");
    let q;

    if (subTab === "my" && auth.currentUser) {
      q = query(
        ref,
        where("ownerUid", "==", auth.currentUser.uid),
        where("type", "==", mainTab)
      );
    } else {
      q = query(ref, where("type", "==", mainTab));
    }

    const snap = await getDocs(q);
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, [mainTab, subTab]);

  return (
    <div className="lf-page">
      {/* TOP TABS */}
      <div className="lf-tabs main">
        <button
          className={mainTab === "lost" ? "active" : ""}
          onClick={() => {
            setMainTab("lost");
            setSubTab("all");
          }}
        >
          Lost
        </button>

        <button
          className={mainTab === "found" ? "active" : ""}
          onClick={() => {
            setMainTab("found");
            setSubTab("all");
          }}
        >
          Found
        </button>

        <button
          className={mainTab === "matches" ? "active" : ""}
          onClick={() => setMainTab("matches")}
        >
          Matches
        </button>
      </div>

      {/* LOST / FOUND CONTENT */}
      {mainTab !== "matches" && (
        <>
          {/* MY TOGGLE */}
          <div className="lf-toggle">
            <span>
              My {mainTab.charAt(0).toUpperCase() + mainTab.slice(1)}
            </span>

            <label className="switch">
              <input
                type="checkbox"
                checked={subTab === "my"}
                onChange={e =>
                  setSubTab(e.target.checked ? "my" : "all")
                }
              />
              <span className="slider"></span>
            </label>
          </div>

          {loading && <p>Loading {mainTab} items…</p>}

          <div className="lf-grid">
            {items.map(item => (
              <div className="lf-card" key={item.id}>
                <img
                  src={item.photoUrl || "/placeholder.png"}
                  alt={item.title}
                />

                <div className="lf-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="lf-location">
                    📍 {item.location}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* FLOATING ADD BUTTON */}
          <button className="fab">+</button>
        </>
      )}

      {/* MATCHES CONTENT */}
      {mainTab === "matches" && <Matches />}
    </div>
  );
}
