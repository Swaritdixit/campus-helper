import * as React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs, where, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "../styles/marketplace.css";

export default function Marketplace() {
  const [items, setItems] = useState([]);

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
                <p className="marketplace-description">
                  {item.description}
                </p>
              )}

              {/* Seller info */}
              <div className="marketplace-seller">
                <span>Seller:</span> {item.sellerName}
              </div>

              {/* Contact seller */}
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
        onClick={() => {
          window.location.href = "/sell";
        }}
      >
        + Sell
      </div>
    </>
  );
}
