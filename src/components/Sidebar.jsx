import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/sidebar.css";

export default function Sidebar({ onLogout }) {
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const go = (page) => navigate(`/${page}`);
  const isActive = (path) => location.pathname === `/${path}`;

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="menu-btn" onClick={() => setOpen(!open)}>
          ☰
        </button>
        {open && <span className="logo">Campus Helper</span>}
      </div>

      <nav>
        <SidebarItem label="Home" icon="🏠" open={open} active={isActive("home")} onClick={() => go("home")} />
        <SidebarItem label="Lost & Found" icon="🔍" open={open} active={isActive("lost")} onClick={() => go("lost")} />
        <SidebarItem label="Calendar" icon="📅" open={open} active={isActive("events")} onClick={() => go("events")} />
        <SidebarItem label="Marketplace" icon="🛒" open={open} active={isActive("market")} onClick={() => go("market")} />
        <SidebarItem label="Wellness AI" icon="❤️" open={open} active={isActive("wellness")} onClick={() => go("wellness")} />
        <SidebarItem label="People Pulse" icon="📊" open={open} active={isActive("people_pulse")} onClick={() => go("people_pulse")} />
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle open={open} />
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
