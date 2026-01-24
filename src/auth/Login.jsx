import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useState } from "react";

export default function Login() {
  const [email, setE] = useState("");
  const [password, setP] = useState("");

  return (
    <div className="center">
      <h2>CampusHub AI</h2>
      <input placeholder="Email" onChange={e => setE(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setP(e.target.value)} />
      <button onClick={() => signInWithEmailAndPassword(auth, email, password)}>
        Login
      </button>
    </div>
  );
}
