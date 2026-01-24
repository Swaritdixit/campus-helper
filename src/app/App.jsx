import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Login from "../auth/Login";

import Home from "../modules/Home";
import LostFound from "../modules/LostFound";
import Matches from "../modules/Matches";
import Events from "../modules/Events";
import Marketplace from "../modules/Marketplace";
import Wellness from "../modules/Wellness";
import Pulse from "../modules/Pulse";

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (!user) {
    return <Login />;
  }

  const pages = {
    home: <Home setPage={setPage} />,
    lost: <LostFound />,
    matches: <Matches />,
    events: <Events />,
    market: <Marketplace />,
    wellness: <Wellness />,
    people_pulse: <Pulse />
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar setPage={setPage} onLogout={() => signOut(auth)} />

      <div style={{ flex: 1, padding: 20 }}>
        <ThemeToggle />
        {pages[page]}
      </div>
    </div>
  );
}
