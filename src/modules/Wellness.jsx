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

  const send = async () => {
    if (!msg.trim() || loading) return;

    const userMsg = msg;
    setMsg("");
    setLoading(true);
    if (!hasStarted) setHasStarted(true);

    // show user message instantly
    setChatHistory(prev => [...prev, { user: userMsg, ai: "…" }]);

    try {
      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // 🔥 FIX: backend expects "message"
        body: JSON.stringify({ message: userMsg }),
      });

      if (!res.ok) throw new Error("Backend failed");

      const data = await res.json();
      const aiReply =
        data?.reply ||
        "I'm here to listen. Can you tell me more?";

      // replace placeholder
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].ai = aiReply;
        return updated;
      });

      await addDoc(collection(db, "wellness_chats"), {
        message: userMsg,
        reply: aiReply,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error("Wellness API failed:", err);

      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].ai =
          "I'm having a little trouble right now, but I'm still here with you 💙";
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      {!hasStarted && (
        <>
          <div className="wellness-heart">❤️</div>
          <h1 className="wellness-title">MindCare AI</h1>
          <p className="wellness-subtitle">
            Your personal mental wellness companion.
            <br />
            Safe. Anonymous. Supportive.
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
            className="wellness-input"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="How are you feeling today?"
            disabled={loading}
            onKeyDown={e => e.key === "Enter" && send()}
          />
          <button
            className="wellness-button"
            onClick={send}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>

      {!hasStarted && (
        <p className="wellness-footer">You are not alone 💙</p>
      )}
    </div>
  );
}
