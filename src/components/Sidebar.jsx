import React, { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar({ setPage, onLogout }) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("home");

  const go = (page) => {
    setActive(page);
    setPage(page);
  };

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>
        {open && <span className="logo">Campus Helper</span>}
      </div>

      <nav>
        <SidebarItem label="Home" icon="🏠" open={open} active={active==="home"} onClick={() => go("home")} />
        <SidebarItem label="Lost & Found" icon="🔍" open={open} active={active==="lost"} onClick={() => go("lost")} />
        <SidebarItem label="Matches" icon="🤝" open={open} active={active==="matches"} onClick={() => go("matches")} />
        <SidebarItem label="Calendar" icon="📅" open={open} active={active==="events"} onClick={() => go("events")} />
        <SidebarItem label="Marketplace" icon="🛒" open={open} active={active==="market"} onClick={() => go("market")} />
        <SidebarItem label="Wellness AI" icon="❤️" open={open} active={active==="wellness"} onClick={() => go("wellness")} />
        <SidebarItem label="People Pulse" icon="📊" open={open} active={active==="pulse"} onClick={() => go("pulse")} />
      </nav>

      <div className="sidebar-footer">
        <SidebarItem label="Logout" icon="🚪" open={open} onClick={onLogout} danger />
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, open, active, onClick, danger }) {
  return (
    <div
      className={`sidebar-item ${active ? "active" : ""} ${danger ? "danger" : ""}`}
      onClick={onClick}
    >
      <span className="icon">{icon}</span>
      {open && <span className="text">{label}</span>}
    </div>
  );
}
