import React, { useState, useRef, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/wellness.css";

export default function Wellness() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [hasStarted, setHasStarted] = useState(false); // track if first prompt sent
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const send = async () => {
    if (!msg.trim() || loading) return;

    setLoading(true);
    if (!hasStarted) setHasStarted(true); // first message sent, hide initial UI

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      // Call Gemini AI
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: {
              text:
                "You are a calm, empathetic mental wellness assistant. Respond kindly and supportively.\n\nUser: " +
                msg,
            },
            temperature: 0.7,
            candidateCount: 1,
          }),
        }
      );

      const data = await response.json();

      const aiReply =
        data?.candidates?.[0]?.content ||
        "I'm here with you. Do you want to talk more about what's been going on?";

      // Save to Firestore
      await addDoc(collection(db, "wellness_chats"), {
        message: msg,
        reply: aiReply,
        createdAt: new Date(),
      });

      // Update local chat history
      setChatHistory((prev) => [...prev, { user: msg, ai: aiReply }]);
      setMsg("");
    } catch (error) {
      console.error("Gemini error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      {/* Show header only before first prompt */}
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

      {/* Chat container */}
      <div className={`chat-container ${hasStarted ? "chat-started" : ""}`}>
        <div className="chat-box">
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-message">
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
            onChange={(e) => setMsg(e.target.value)}
            placeholder="How are you feeling today?"
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && send()}
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

      {/* Footer */}
      {!hasStarted && <p className="wellness-footer">You are not alone 💙</p>}
    </div>
  );
}
