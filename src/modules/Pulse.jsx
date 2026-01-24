import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function Pulse() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    getDocs(collection(db,"pulse_polls"))
      .then(s => setPolls(s.docs.map(d => ({id:d.id,...d.data()}))));
  }, []);

  return polls.map(p => (
    <div key={p.id}>
      <p>{p.question}</p>
      <button onClick={() => updateDoc(doc(db,"pulse_polls",p.id),{countA:increment(1)})}>{p.optionA}</button>
      <button onClick={() => updateDoc(doc(db,"pulse_polls",p.id),{countB:increment(1)})}>{p.optionB}</button>
    </div>
  ));
}
