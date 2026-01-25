import React, { useState, useEffect } from "react";

export default function ThemeToggle({ open }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  return (
    <div
      className="sidebar-item"
      onClick={() => setDarkMode(!darkMode)}
      style={{ marginTop: "6px" }}
    >
      <span className="icon">{darkMode ? "☀️" : "🌙"}</span>
      {open && <span className="text">{darkMode ? "Light Mode" : "Dark Mode"}</span>}
    </div>
  );
}
