import React, { useState, useEffect } from "react";

export default function ThemeToggle({ open }) {
  const [darkMode, setDarkMode] = useState(false);

  // On darkMode change, toggle .dark class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className="sidebar-item"
      onClick={() => setDarkMode(!darkMode)}
      style={{ marginTop: "6px", cursor: "pointer" }}
    >
      <span className="icon">{darkMode ? "☀️" : "🌙"}</span>
      {open && <span className="text">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
    </div>
  );
}
