import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

import Home from "../modules/Home";
import LostFound from "../modules/LostFound";
import Matches from "../modules/Matches";
import Events from "../modules/Events";
import Marketplace from "../modules/Marketplace";
import Wellness from "../modules/Wellness";
import Pulse from "../modules/Pulse";

export default function App() {
  const [page, setPage] = useState("home");

  const pages = {
    home: <Home setPage={setPage} />,
    lost: <LostFound />,
    matches: <Matches />,
    events: <Events />,
    market: <Marketplace />,
    wellness: <Wellness />,
    pulse: <Pulse />
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />
      <div style={{ flex: 1, padding: 20 }}>
        <ThemeToggle />
        {pages[page]}
      </div>
    </div>
  );
}
