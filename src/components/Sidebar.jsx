import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/sidebar.css";

export default function Sidebar({ setPage }) {
  return (
    <div className="sidebar">
      <h3>CampusHub AI</h3>
      <button onClick={() => setPage("home")}>Home</button>
      <button onClick={() => setPage("lost")}>Lost & Found</button>
      <button onClick={() => setPage("matches")}>Matches</button>
      <button onClick={() => setPage("events")}>Calendar</button>
      <button onClick={() => setPage("market")}>Marketplace</button>
      <button onClick={() => setPage("wellness")}>Wellness</button>
      <button onClick={() => setPage("pulse")}>People Pulse</button>
      <button className="logout" onClick={() => signOut(auth)}>Logout →</button>
    </div>
  );
}
