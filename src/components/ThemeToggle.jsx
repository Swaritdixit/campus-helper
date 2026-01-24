export default function ThemeToggle() {
  return <button onClick={() => document.body.classList.toggle("dark")}>🌗</button>;
}
