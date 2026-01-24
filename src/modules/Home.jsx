import "../styles/dashboard.css";

export default function Home({ setPage }) {
  return (
    <>
      <h2>Hello 👋 Welcome Back!!</h2>

      <div className="card purple" onClick={() => setPage("lost")}>
        <h3>Lost & Found</h3>
        <p>AI powered matching system</p>
      </div>

      <div className="card blue" onClick={() => setPage("events")}>
        <h3>Calendar</h3>
        <p>Campus events & schedules</p>
      </div>

      <div className="card green" onClick={() => setPage("market")}>
        <h3>Marketplace</h3>
        <p>Buy & Sell inside campus</p>
      </div>

      <div className="card pink" onClick={() => setPage("wellness")}>
        <h3>MindCare AI</h3>
        <p>Wellness & counselling</p>
      </div>
    </>
  );
}
