import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/auth.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch {
      setError("Invalid email or password");
    }
  };

  const shapes = ["🎓", "📚", "🧠", "🏫", "💡", "✏️", "📊", "🛠️", "🤖", "🖋️"];

  // Generate 200 floating shapes for full coverage
  const floatingShapes = Array.from({ length: 200 }, (_, i) => {
    const size = Math.random() * 2 + 1; // 1rem - 3rem
    const left = Math.random() * 100; // horizontal %
    const top = Math.random() * 100;  // vertical %
    const delay = Math.random() * 40; // seconds
    const duration = Math.random() * 30 + 20; // 20-50s
    const opacity = Math.random() * 0.25 + 0.05;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    return (
      <span
        key={i}
        className="floating-shape"
        style={{
          fontSize: `${size}rem`,
          left: `${left}%`,
          top: `${top}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity: opacity,
        }}
      >
        {shape}
      </span>
    );
  });

  // Optional: Add a class to body to fix background during login
  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  return (
    <div className="auth-container">
      {/* Floating shapes background */}
      <div className="emoji-bg">{floatingShapes}</div>

      {/* Login card */}
      <div className="auth-card">
        <h2>CampusHub AI</h2>
        <p className="auth-subtitle">Your smart campus companion</p>

        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
