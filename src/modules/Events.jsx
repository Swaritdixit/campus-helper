import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "Events")).then((snap) => {
      setEvents(snap.docs.map(d => d.data()));
    });
  }, []);

  return (
    <div>
      <h2>Campus Events</h2>
      {events.map((e, i) => (
        <div key={i}>
          <b>{e.name}</b> – {e.date} @ {e.venue}
        </div>
      ))}
    </div>
  );
}
