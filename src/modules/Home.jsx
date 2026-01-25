import "../styles/dashboard.css";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      {/* GLASS HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <span>Hello 👋 Welcome Back</span>
        </h1>

        <p className="dashboard-subtitle">
          What would you like to do today?
        </p>

        {/* APP DOWNLOAD LINE */}

      <p className="dashboard-app">
  📱 The main platform is a mobile application, available for download and installation on Android.{" "}
  <a
    href="https://drive.google.com/file/d/1tnFt2Q9IO3lbopSl4huIYAFGgABWlDdH/view?usp=sharing"
    target="_blank"
    rel="noopener noreferrer"
  >
    Download APK
  </a>
</p>

      </div>

      {/* CARDS */}
      <div className="cards">
        <div className="card purple" onClick={() => navigate("/lost")}>
          <div className="icon">🔍</div>
          <h3>Lost & Found</h3>
          <p>AI powered matching system</p>
        </div>

        <div className="card blue" onClick={() => navigate("/events")}>
          <div className="icon">📅</div>
          <h3>Calendar</h3>
          <p>Campus events & schedules</p>
        </div>

        <div className="card green" onClick={() => navigate("/market")}>
          <div className="icon">🏬</div>
          <h3>Marketplace</h3>
          <p>Buy & Sell inside campus</p>
        </div>

        <div className="card pink" onClick={() => navigate("/wellness")}>
          <div className="icon">❤️</div>
          <h3>MindCare AI</h3>
          <p>Mental wellness assistant</p>
        </div>

        <div className="card orange" onClick={() => navigate("/people_pulse")}>
          <div className="icon">📊</div>
          <h3>Campus Pulse</h3>
          <p>Quick student polls</p>
        </div>
      </div>
    </div>
  );
}
