import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useState } from "react";
import React from "react";

export default function Wellness() {
  const [msg, setMsg] = useState("");

  const send = async () => {
    await addDoc(collection(db,"wellness_chats"), {
      message: msg,
      reply: "AI response",
      createdAt: new Date()
    });
    setMsg("");
  };

  return (
    <>
      <input value={msg} onChange={e => setMsg(e.target.value)} />
      <button onClick={send}>Send</button>
    </>
  );
}
