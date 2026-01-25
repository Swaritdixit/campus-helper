import React, { useState, useRef, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/wellness.css";

export default function Wellness() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  async function send() {
    if (!msg.trim() || loading) return;

    const userMsg = msg;
    setMsg("");
    setLoading(true);
    if (!hasStarted) setHasStarted(true);

    // Show user message immediately
    setChatHistory((prev) => [...prev, { user: userMsg, ai: "Thinking..." }]);

    try {
      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();
      const aiReply =
        data.reply || "I'm here to listen. Tell me more.";

      // Replace last AI placeholder
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].ai = aiReply;
        return updated;
      });

      // Save to Firestore
      await addDoc(collection(db, "wellness_chats"), {
        message: userMsg,
        reply: aiReply,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Wellness error:", err);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].ai =
          "I'm having trouble right now, but I'm still here with you.";
        return updated;
      });
    }

    setLoading(false);
  }

  return (
    <div className="wellness-container">
      {!hasStarted && (
        <>
          <h1 className="wellness-title">MindCare AI</h1>
          <p className="wellness-subtitle">
            Your personal mental wellness companion.
          </p>
        </>
      )}

      <div className={`chat-container ${hasStarted ? "chat-started" : ""}`}>
        <div className="chat-box">
          {chatHistory.map((chat, i) => (
            <div key={i} className="chat-message">
              <p className="user-msg">{chat.user}</p>
              <p className="ai-msg">{chat.ai}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="input-area">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="How are you feeling today?"
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button onClick={send} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}