import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/events.css";
import { FaTrash } from "react-icons/fa";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    date: "",
    venue: "",
  });

  const todayDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const snap = await getDocs(collection(db, "Events"));
    const ev = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));
    setEvents(ev);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.date || !form.venue) return;
    await addDoc(collection(db, "Events"), form);
    setForm({ name: "", date: "", venue: "" });
    setShowModal(false);
    loadEvents();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "Events", id));
    loadEvents();
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const hasEvent = (day) =>
    events.some(e => {
      const d = new Date(e.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

  const filteredEvents = selectedDate
    ? events.filter(e => {
        const d = new Date(e.date);
        return (
          d.getDate() === selectedDate &&
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      })
    : events.filter(e => {
        const d = new Date(e.date);
        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="events-page">
      {/* HEADER */}
      <div className="events-header">
        <h2>Calendar</h2>
        <div className="header-actions">
          {selectedDate && (
            <button className="clear-btn" onClick={() => setSelectedDate(null)}>
              ✖ Clear
            </button>
          )}
          <button className="add-btn" onClick={() => setShowModal(true)}>＋</button>
        </div>
      </div>

      {/* TODAY */}
      <div className="events-today">
        <span>Today</span>
        <h3>{todayDate.toDateString()}</h3>
      </div>

      {/* MONTH/YEAR SELECTORS */}
      <div className="calendar-navigation">
        <button onClick={() => setCurrentMonth(prev => prev === 0 ? 11 : prev - 1)}>◀</button>
        <span>{monthNames[currentMonth]} {currentYear}</span>
        <button onClick={() => setCurrentMonth(prev => prev === 11 ? 0 : prev + 1)}>▶</button>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => todayDate.getFullYear() - 5 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* CALENDAR */}
      <div className="calendar-grid">
        {[...Array(daysInMonth(currentMonth, currentYear))].map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={day}
              className={`calendar-day ${hasEvent(day) ? "has-event" : ""} ${selectedDate === day ? "selected" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* EVENTS */}
      <div className="events-section">
        <h3>
          {selectedDate ? `Events on ${selectedDate} ${monthNames[currentMonth]} ${currentYear}` : "Upcoming Events"}
        </h3>

        {loading && <p>Loading...</p>}
        {!loading && filteredEvents.length === 0 && <p className="muted">No events</p>}

        {filteredEvents.map(e => (
          <div className="event-card" key={e.id}>
            <div>
              <h4>{e.name}</h4>
              <p>{new Date(e.date).toDateString()}</p>
              <span>📍 {e.venue}</span>
            </div>
            <button className="delete-btn" onClick={() => handleDelete(e.id)}>
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Add Event</h3>
            <input
              placeholder="Event name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
            <input
              placeholder="Venue"
              value={form.venue}
              onChange={e => setForm({ ...form, venue: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
