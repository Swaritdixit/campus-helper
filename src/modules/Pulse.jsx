import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebase";
import "../styles/pulse.css";

export default function Pulse() {
  const [polls, setPolls] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    getDocs(collection(db, "pulse_polls")).then((snap) => {
      setPolls(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });
  }, []);

  /* ---------------- VOTE LOGIC ---------------- */

  const vote = async (poll, choice) => {
    const key = `pulse_vote_${poll.id}`;
    const prev = localStorage.getItem(key);

    if (prev === choice) return;

    const updates = {};
    if (prev) updates[prev === "A" ? "countA" : "countB"] = increment(-1);
    updates[choice === "A" ? "countA" : "countB"] = increment(1);

    await updateDoc(doc(db, "pulse_polls", poll.id), updates);
    localStorage.setItem(key, choice);

    setPolls((prevPolls) =>
      prevPolls.map((p) =>
        p.id === poll.id
          ? {
              ...p,
              countA:
                choice === "A"
                  ? p.countA + 1
                  : prev === "A"
                  ? p.countA - 1
                  : p.countA,
              countB:
                choice === "B"
                  ? p.countB + 1
                  : prev === "B"
                  ? p.countB - 1
                  : p.countB,
            }
          : p
      )
    );
  };

  const resetVote = async (poll) => {
    const key = `pulse_vote_${poll.id}`;
    const prev = localStorage.getItem(key);
    if (!prev) return;

    await updateDoc(doc(db, "pulse_polls", poll.id), {
      [prev === "A" ? "countA" : "countB"]: increment(-1),
    });

    localStorage.removeItem(key);

    setPolls((prevPolls) =>
      prevPolls.map((p) =>
        p.id === poll.id
          ? {
              ...p,
              countA: prev === "A" ? p.countA - 1 : p.countA,
              countB: prev === "B" ? p.countB - 1 : p.countB,
            }
          : p
      )
    );
  };

  /* ---------------- ADD POLL ---------------- */

  const addPoll = async () => {
    if (!question || !optionA || !optionB) return;

    const docRef = await addDoc(collection(db, "pulse_polls"), {
      question,
      optionA,
      optionB,
      countA: 0,
      countB: 0,
      active: true,
      createdAt: serverTimestamp(),
      createdBy: user?.uid || null,
    });

    setPolls([
      {
        id: docRef.id,
        question,
        optionA,
        optionB,
        countA: 0,
        countB: 0,
      },
      ...polls,
    ]);

    setQuestion("");
    setOptionA("");
    setOptionB("");
    setShowAdd(false);
  };

  return (
    <div className="pulse-container">
      {user && (
        <button className="pulse-add-btn" onClick={() => setShowAdd(!showAdd)}>
          + Add Poll
        </button>
      )}

      {showAdd && (
        <div className="pulse-add-card">
          <input
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            placeholder="Option A"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
          />
          <input
            placeholder="Option B"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
          />
          <button onClick={addPoll}>Create</button>
        </div>
      )}

      {polls.map((p) => {
        const total = p.countA + p.countB;
        const percentA = total ? Math.round((p.countA / total) * 100) : 0;
        const percentB = total ? Math.round((p.countB / total) * 100) : 0;
        const myVote = localStorage.getItem(`pulse_vote_${p.id}`);

        return (
          <div className="pulse-card" key={p.id}>
            <h3>{p.question}</h3>

            <div
              className={`pulse-option ${myVote === "A" ? "selected" : ""}`}
              onClick={() => vote(p, "A")}
            >
              <span>{p.optionA}</span>
              <div className="bar">
                <div style={{ width: `${percentA}%` }} />
              </div>
              <span>{percentA}%</span>
            </div>

            <div
              className={`pulse-option ${myVote === "B" ? "selected" : ""}`}
              onClick={() => vote(p, "B")}
            >
              <span>{p.optionB}</span>
              <div className="bar">
                <div style={{ width: `${percentB}%` }} />
              </div>
              <span>{percentB}%</span>
            </div>

            {myVote && (
              <button className="reset-btn" onClick={() => resetVote(p)}>
                Remove my vote
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
