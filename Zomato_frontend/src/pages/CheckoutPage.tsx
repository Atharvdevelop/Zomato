import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { restaurants } from "../data/restaurants";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱", desc: "PhonePe, GPay, Paytm & more" },
  { id: "card", label: "Credit/Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🏦", desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive" },
];

const addresses = [
  { id: "a1", label: "Home", address: "B-204, Green Park Apartments, Sector 62, Noida, UP 201301", isDefault: true },
  { id: "a2", label: "Work", address: "Tower A, Cyber Hub, DLF Phase 2, Gurugram, Haryana 122002", isDefault: false },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, restaurant, totalPrice, clearCart } = useCart();

  const [selectedAddress, setSelectedAddress] = useState("a1");
  const [selectedPayment, setSelectedPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [placing, setPlacing] = useState(false);
  const [tip, setTip] = useState(20);

  const deliveryFee = restaurant ? (restaurants.find((r) => r.id === restaurant.id)?.deliveryFee ?? 0) : 0;
  const platformFee = 5;
  const gst = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + deliveryFee + platformFee + gst + tip;

  function placeOrder() {
    setPlacing(true);
    setTimeout(() => {
      clearCart();
      navigate("/order-confirmed");
    }, 2000);
  }

  if (items.length === 0 && !placing) {
    navigate("/restaurants");
    return null;
  }

  return (
    <div style={{ minHeight: "80vh", background: "#f8f8f8" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <button onClick={() => navigate("/cart")} style={{ background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: 0 }}>Checkout</h1>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36, background: "#fff", borderRadius: 12, padding: "16px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {["Cart", "Checkout", "Confirmed"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i <= 1 ? "#e23744" : "#e8e8e8", color: i <= 1 ? "#fff" : "#9e9e9e",
                  fontSize: 13, fontWeight: 700,
                }}>{i < 1 ? "✓" : i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: i === 1 ? 700 : 400, color: i <= 1 ? "#1c1c1c" : "#9e9e9e" }}>{step}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: i === 0 ? "#e23744" : "#e8e8e8", margin: "0 12px" }} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Delivery Address */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e8e8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: 0 }}>
                  📍 Delivery Address
                </h3>
              </div>
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    style={{
                      padding: "16px", borderRadius: 12, border: `1.5px solid ${selectedAddress === addr.id ? "#e23744" : "#e8e8e8"}`,
                      background: selectedAddress === addr.id ? "#fff0f1" : "#fff", cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selectedAddress === addr.id ? "#e23744" : "#9e9e9e"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {selectedAddress === addr.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e23744" }} />}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14, color: "#1c1c1c" }}>{addr.label}</span>
                      {addr.isDefault && <span style={{ background: "#f0fff4", color: "#3d9b6e", border: "1px solid #bbf7d0", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>Default</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#696969", lineHeight: 1.5, paddingLeft: 28 }}>{addr.address}</p>
                  </div>
                ))}
                <button style={{ border: "1.5px dashed #e8e8e8", borderRadius: 12, padding: "14px", background: "none", cursor: "pointer", color: "#e23744", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  + Add new address
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e8e8" }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: 0 }}>
                  💳 Payment Method
                </h3>
              </div>
              <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPayment(pm.id)}
                    style={{
                      padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${selectedPayment === pm.id ? "#e23744" : "#e8e8e8"}`,
                      background: selectedPayment === pm.id ? "#fff0f1" : "#fff", cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selectedPayment === pm.id ? "#e23744" : "#9e9e9e"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selectedPayment === pm.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#e23744" }} />}
                    </div>
                    <span style={{ fontSize: 20 }}>{pm.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#1c1c1c" }}>{pm.label}</div>
                      <div style={{ fontSize: 12, color: "#696969" }}>{pm.desc}</div>
                    </div>
                  </div>
                ))}

                {selectedPayment === "upi" && (
                  <div style={{ marginTop: 4, padding: "0 0 4px 30px" }}>
                    <input
                      type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter your UPI ID (e.g. name@bank)"
                      style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                      onFocus={(e) => (e.target.style.borderColor = "#e23744")}
                      onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tip */}
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e8e8" }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: 0 }}>
                  🙏 Tip for your delivery partner
                </h3>
              </div>
              <div style={{ padding: "16px 24px" }}>
                <p style={{ fontSize: 13, color: "#696969", margin: "0 0 16px" }}>Your kindness means a lot to them!</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {[0, 10, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTip(amount)}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 8,
                        border: `1.5px solid ${tip === amount ? "#e23744" : "#e8e8e8"}`,
                        background: tip === amount ? "#fff0f1" : "#fff",
                        color: tip === amount ? "#e23744" : "#696969",
                        cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.15s",
                      }}
                    >
                      {amount === 0 ? "None" : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div>
            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 80 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8e8e8" }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: 0 }}>
                  Order from {restaurant?.name}
                </h3>
              </div>

              {/* Items list */}
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #e8e8e8" }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ background: "#e8e8e8", borderRadius: 4, padding: "1px 7px", fontSize: 12, fontWeight: 600, color: "#1c1c1c" }}>{item.quantity}x</span>
                      <span style={{ fontSize: 14, color: "#1c1c1c" }}>{item.name}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1c" }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Bill breakdown */}
              <div style={{ padding: "16px 24px" }}>
                {[
                  { label: "Item Total", value: `₹${totalPrice}` },
                  { label: "Delivery Fee", value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, green: deliveryFee === 0 },
                  { label: "Platform Fee", value: `₹${platformFee}` },
                  { label: "GST (5%)", value: `₹${gst}` },
                  { label: `Delivery Tip`, value: tip === 0 ? "None" : `₹${tip}`, green: tip > 0 },
                ].map(({ label, value, green }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#696969", marginBottom: 8 }}>
                    <span>{label}</span>
                    <span style={{ color: green ? "#3d9b6e" : "#1c1c1c", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1.5px solid #e8e8e8", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#1c1c1c", marginTop: 4 }}>
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placing}
                  style={{
                    width: "100%", background: placing ? "#9e9e9e" : "#e23744", color: "#fff", border: "none",
                    borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 800,
                    cursor: placing ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", marginTop: 20,
                    boxShadow: placing ? "none" : "0 4px 20px rgba(226,55,68,0.3)", transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  }}
                >
                  {placing ? (
                    <>
                      <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order · ₹${grandTotal}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
