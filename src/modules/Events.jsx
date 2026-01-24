import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getDocs(collection(db,"Events"))
      .then(s => setEvents(s.docs.map(d => d.data())));
  }, []);

  return events.map((e,i) => (
    <div key={i}>
      <b>{e.name}</b>
      <p>{e.date} | {e.time}</p>
      <small>{e.venue}</small>
    </div>
  ));
}
