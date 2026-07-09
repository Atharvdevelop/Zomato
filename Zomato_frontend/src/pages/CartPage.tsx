import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { restaurants } from "../data/restaurants";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, restaurant, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();

  const deliveryFee = restaurant
    ? (restaurants.find((r) => r.id === restaurant.id)?.deliveryFee ?? 0)
    : 0;

  const platformFee = 5;
  const gstRate = 0.05;
  const gst = Math.round(totalPrice * gstRate);
  const grandTotal = totalPrice + deliveryFee + platformFee + gst;

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🛒</div>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: "0 0 10px" }}>
          Your cart is empty
        </h2>
        <p style={{ color: "#696969", fontSize: 16, marginBottom: 32 }}>
          Add items from a restaurant to get started
        </p>
        <button
          onClick={() => navigate("/restaurants")}
          style={{ background: "#e23744", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "80vh", background: "#f8f8f8" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <button onClick={() => navigate(-1)} style={{ background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: 0 }}>Your Cart</h1>
            <p style={{ color: "#696969", margin: "2px 0 0", fontSize: 14 }}>
              {totalItems} item{totalItems !== 1 ? "s" : ""} from <strong>{restaurant?.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
          {/* Items List */}
          <div>
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              {/* Restaurant header */}
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff0f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🍽️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#1c1c1c" }}>{restaurant?.name}</div>
                  <div style={{ fontSize: 13, color: "#696969" }}>{deliveryFee === 0 ? "Free delivery" : `₹${deliveryFee} delivery fee`}</div>
                </div>
                <button
                  onClick={() => { if (window.confirm("Clear entire cart?")) clearCart(); }}
                  style={{ marginLeft: "auto", background: "none", border: "1px solid #e8e8e8", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: "#696969" }}
                >
                  Clear Cart
                </button>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div key={item.id} style={{ padding: "16px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", gap: 14, alignItems: "center" }}>
                  {/* Veg indicator */}
                  <div style={{ width: 14, height: 14, border: `2px solid ${item.isVeg ? "#3d9b6e" : "#e23744"}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.isVeg ? "#3d9b6e" : "#e23744" }} />
                  </div>

                  {/* Image */}
                  <div style={{ width: 56, height: 52, borderRadius: 8, overflow: "hidden", background: "#f0f0f0", flexShrink: 0 }}>
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  {/* Name & price */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: "#1c1c1c" }}>{item.name}</div>
                    <div style={{ fontSize: 14, color: "#696969", marginTop: 2 }}>₹{item.price} each</div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#e23744", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "8px 12px", fontSize: 18, fontWeight: 700 }}>−</button>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "8px 12px", fontSize: 18, fontWeight: 700 }}>+</button>
                  </div>

                  {/* Subtotal */}
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1c1c1c", minWidth: 64, textAlign: "right" }}>
                    ₹{item.price * item.quantity}
                  </div>

                  {/* Remove */}
                  <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9e9e9e", fontSize: 18, padding: 4 }}>✕</button>
                </div>
              ))}

              {/* Add more */}
              <div style={{ padding: "16px 24px" }}>
                <button
                  onClick={() => navigate(`/restaurant/${restaurant?.id}`)}
                  style={{ background: "none", border: "1.5px dashed #e8e8e8", borderRadius: 10, padding: "12px 20px", cursor: "pointer", width: "100%", color: "#696969", fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <span style={{ fontSize: 18, color: "#e23744" }}>+</span>
                  Add more items
                </button>
              </div>
            </div>

            {/* Delivery instructions */}
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginTop: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 15, color: "#1c1c1c", margin: "0 0 12px", display: "flex", gap: 8, alignItems: "center" }}>
                <span>📝</span> Delivery Instructions
              </h3>
              <textarea
                placeholder="Add instructions for your order (e.g., less spicy, extra sauce, ring the bell)"
                rows={3}
                style={{ width: "100%", border: "1.5px solid #e8e8e8", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: "Inter, sans-serif", resize: "none", outline: "none", color: "#1c1c1c", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#e23744")}
                onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
              />
            </div>
          </div>

          {/* Bill Summary */}
          <div>
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 80 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e8e8" }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: 0 }}>Bill Summary</h3>
              </div>

              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Item Total", value: `₹${totalPrice}` },
                    { label: "Delivery Fee", value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, green: deliveryFee === 0 },
                    { label: "Platform Fee", value: `₹${platformFee}` },
                    { label: `GST & Charges (5%)`, value: `₹${gst}` },
                  ].map(({ label, value, green }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#696969" }}>
                      <span>{label}</span>
                      <span style={{ color: green ? "#3d9b6e" : "#1c1c1c", fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}

                  <div style={{ borderTop: "1.5px solid #e8e8e8", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#1c1c1c" }}>
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                {/* Savings badge */}
                {deliveryFee === 0 && (
                  <div style={{ background: "#f0fff4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
                    <span>🎉</span>
                    <span style={{ fontSize: 13, color: "#3d9b6e", fontWeight: 600 }}>You're saving on delivery fee!</span>
                  </div>
                )}

                <button
                  onClick={() => navigate("/checkout")}
                  style={{
                    width: "100%", background: "#e23744", color: "#fff", border: "none",
                    borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800,
                    cursor: "pointer", fontFamily: "Poppins, sans-serif", marginTop: 20,
                    boxShadow: "0 4px 20px rgba(226,55,68,0.3)", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Proceed to Checkout →
                </button>
              </div>
            </div>

            {/* Safety card */}
            <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", marginTop: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>🛡️</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#1c1c1c" }}>Safe & Secure Payments</div>
                  <div style={{ fontSize: 12, color: "#696969" }}>Your payment info is never stored</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
