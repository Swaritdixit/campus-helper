import React, { useState, useMemo, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/auth.css";

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // default is Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Floating shapes
  const shapes = ["🎓", "📚", "🧠", "🏫", "💡", "✏️", "📊", "🛠️", "🤖", "🖋️"];
  const floatingShapes = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      const size = Math.random() * 2 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 40;
      const duration = Math.random() * 30 + 20;
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
  }, []);

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

  // Login
  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch {
      setError("Invalid email or password");
    }
  };

  // Sign Up
  const handleSignup = async () => {
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle Login / Sign Up
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");          // clear error when switching
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="auth-container">
      <div className="emoji-bg">{floatingShapes}</div>

      <div className="auth-card">
        <h2>CampusHub AI</h2>
        <p className="auth-subtitle">
          {isLogin ? "Your smart campus companion" : "Register your account"}
        </p>

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
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        {error && <p className="auth-error">{error}</p>}

        <button
          className="auth-btn"
          onClick={isLogin ? handleLogin : handleSignup}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
