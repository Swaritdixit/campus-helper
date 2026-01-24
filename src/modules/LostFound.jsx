import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LostFound() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "items"));
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  return (
    <div>
      <h2>Lost & Found</h2>
      {items.map(i => (
        <div key={i.id}>{i.title}</div>
      ))}
    </div>
  );
}
