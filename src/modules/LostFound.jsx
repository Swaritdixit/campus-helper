import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function LostFound() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getDocs(query(collection(db,"items"), where("active","==",true)))
      .then(s => setItems(s.docs.map(d => d.data())));
  }, []);

  return items.map((i, k) => (
    <div key={k}>
      <h4>{i.title}</h4>
      <p>{i.description}</p>
      <small>{i.type}</small>
    </div>
  ));
}
