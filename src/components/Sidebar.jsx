import React, { useState } from "react";

export default function Sidebar({ setPage, onLogout }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      width: open ? 220 : 60,
      transition: "0.3s",
      background: "#020617",
      color: "white",
      height: "100vh",
      padding: 10
    }}>
      <button onClick={() => setOpen(!open)}>☰</button>

      <Menu label="Home" onClick={() => setPage("home")} />
      <Menu label="Lost & Found" onClick={() => setPage("lost")} />
      <Menu label="Matches" onClick={() => setPage("matches")} />
      <Menu label="Calendar" onClick={() => setPage("events")} />
      <Menu label="Marketplace" onClick={() => setPage("market")} />
      <Menu label="Wellness AI" onClick={() => setPage("wellness")} />
      <Menu label="People Pulse" onClick={() => setPage("pulse")} />

      <hr />
      <Menu label="Logout" onClick={onLogout} />
    </div>
  );
}

function Menu({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 5px",
        cursor: "pointer"
      }}
    >
      {label}
    </div>
  );
}
