import "../styles/dashboard.css";
import React from "react";

export default function Home({ setPage }) {
  return (
    <div className="dashboard-container">
      
      {/* GLASS HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
        <span>  Hello 👋 Welcome Back</span>
        </h1>
        <p className="dashboard-subtitle">
          What would you like to do today?
        </p>
      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card purple" onClick={() => setPage("lost")}>
          <div className="icon">🔍</div>
          <h3>Lost & Found</h3>
          <p>AI powered matching system</p>
        </div>

        <div className="card blue" onClick={() => setPage("events")}>
          <div className="icon">📅</div>
          <h3>Calendar</h3>
          <p>Campus events & schedules</p>
        </div>

        <div className="card green" onClick={() => setPage("market")}>
          <div className="icon">🏬</div>
          <h3>Marketplace</h3>
          <p>Buy & Sell inside campus</p>
        </div>

        <div className="card pink" onClick={() => setPage("wellness")}>
          <div className="icon">❤️</div>
          <h3>MindCare AI</h3>
          <p>Mental wellness assistant</p>
        </div>

        <div className="card orange" onClick={() => setPage("people_pulse")}>
          <div className="icon">📊</div>
          <h3>Campus Pulse</h3>
          <p>Quick student polls</p>
        </div>
      </div>
    </div>
  );
}
