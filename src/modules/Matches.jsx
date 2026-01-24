const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export default function Matches() {
  return (
    <>
      <h2>AI Matches</h2>
      <p>Gemini key loaded: {GEMINI_KEY ? "Yes" : "No"}</p>
    </>
  );
}
