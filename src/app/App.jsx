import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

import Sidebar from "../components/Sidebar";
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
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/home", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar onLogout={() => signOut(auth)} />

      <div style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/lost" element={<LostFound />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/events" element={<Events />} />
          <Route path="/market" element={<Marketplace />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/people_pulse" element={<Pulse />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}
