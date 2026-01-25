import * as React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/marketplace.css";

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
    sellerName: "",
    sellerEmail: "",
  });

  useEffect(() => {
    const q = query(
      collection(db, "marketplace"),
      where("active", "==", true),
      orderBy("createdAt", "desc")
    );

    getDocs(q).then((snapshot) => {
      setItems(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
  }, []);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.price || !newItem.sellerEmail) {
      alert("Title, Price, and Seller Email are required!");
      return;
    }

    try {
      await addDoc(collection(db, "marketplace"), {
        ...newItem,
        price: Number(newItem.price),
        active: true,
        createdAt: new Date(),
      });

      alert("Item added successfully!");
      setShowForm(false);
      setNewItem({
        title: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
        sellerName: "",
        sellerEmail: "",
      });

      // Refresh items
      const q = query(
        collection(db, "marketplace"),
        where("active", "==", true),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setItems(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error(err);
      alert("Error adding item!");
    }
  };

  return (
    <>
      <div className="marketplace-container">
        {items.map((item) => (
          <div className="marketplace-card" key={item.id}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="marketplace-image"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/110?text=No+Image";
              }}
            />

            <div className="marketplace-info">
              <h3 className="marketplace-title">{item.title}</h3>
              <div className="marketplace-price">₹ {item.price}</div>
              <div className="marketplace-category">{item.category}</div>

              {item.description && (
                <p className="marketplace-description">{item.description}</p>
              )}

              <div className="marketplace-seller">
                <span>Seller:</span> {item.sellerName}
              </div>

              <a
                href={`mailto:${item.sellerEmail}`}
                className="marketplace-contact"
              >
                Contact Seller
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Sell Button */}
      <div
        className="sell-button"
        onClick={() => setShowForm(true)}
      >
        + Sell
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Item for Sale</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={newItem.title}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newItem.price}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newItem.category}
                onChange={handleChange}
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newItem.description}
                onChange={handleChange}
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={newItem.imageUrl}
                onChange={handleChange}
              />
              <input
                type="text"
                name="sellerName"
                placeholder="Seller Name"
                value={newItem.sellerName}
                onChange={handleChange}
              />
              <input
                type="email"
                name="sellerEmail"
                placeholder="Seller Email"
                value={newItem.sellerEmail}
                onChange={handleChange}
                required
              />
              <button type="submit">Add Item</button>
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
