import React, { useState, useEffect } from "react";
import "./addtocart.css";

const API_URL = "http://localhost:5000"; // change if needed

function AddToCart() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart items when page opens
  useEffect(() => {
    loadCart();
  }, []);

  // Add product to cart
  const addToCart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: productName,
          product_price: productPrice,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: data.message, type: "success" });
        setProductName("");
        setProductPrice("");
        setQuantity("");
        loadCart();
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "Cannot connect to server. Is backend running?",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load all cart items
  const loadCart = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cart`);
      const data = await response.json();

      if (data.success) {
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    }
  };

  return (
    <div className="cart-container">
      {/* Add to Cart Form */}
      <div className="card">
        <h2>Add Product to Cart (in KG)</h2>

        <form onSubmit={addToCart}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Example: Tomato, Potato, Onion"
              required
            />
          </div>

          <div className="form-group">
            <label>Price per KG (₹)</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Example: 40"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity (in KG)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Example: 2.5"
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </div>

      {/* Cart Items List */}
      <div className="card">
        <div className="cart-header">
          <h2>Cart Items</h2>
          <button className="refresh-btn" onClick={loadCart}>
            Refresh Cart
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart">No items in cart yet.</p>
        ) : (
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <strong>{item.product_name}</strong>
                <p>
                  ₹{item.product_price} / kg × {item.quantity} kg ={" "}
                  <strong>₹{item.total_price}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddToCart;