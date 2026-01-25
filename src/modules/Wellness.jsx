import { useState } from "react";
import "../styles/wellness.css";

export default function Wellness() {
  const [userMessage, setUserMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    setError("");
    setReply("");

    try {
      const res = await fetch("/api/wellness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setReply(data.reply);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      <h2>🧠 MindCare AI</h2>

      <textarea
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="How are you feeling today?"
      />

      <button onClick={sendMessage} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      {reply && (
        <div className="reply-box">
          <strong>MindCare AI:</strong>
          <p>{reply}</p>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
