import React, { useState, useEffect, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

    setLoading(true);
    if (!hasStarted) setHasStarted(true);

    try {
      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: msg }),
      });

      const data = await res.json();
      const aiReply =
        data.reply || "I'm here with you. Want to talk more? 💙";

      await addDoc(collection(db, "wellness_chats"), {
        message: msg,
        reply: aiReply,
        createdAt: serverTimestamp(),
      });

      setChatHistory(prev => [...prev, { user: msg, ai: aiReply }]);
      setMsg("");
    } catch (err) {
      console.error("Wellness error:", err);
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
            Your personal mental wellness companion.<br />
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
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="How are you feeling today?"
            disabled={loading}
            onKeyDown={e => e.key === "Enter" && send()}
            className="wellness-input"
          />
          <button
            onClick={send}
            disabled={loading}
            className="wellness-button"
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
