import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config";

const steps = [
  { icon: "✅", label: "Order Placed", desc: "Your order has been received", time: "Just now" },
  { icon: "👨‍🍳", label: "Preparing", desc: "Restaurant is preparing your food", time: "5 mins" },
  { icon: "🚴", label: "Out for Delivery", desc: "Rider is on the way", time: "20 mins" },
  { icon: "🏠", label: "Delivered", desc: "Enjoy your meal!", time: "30 mins" },
];

export default function OrderConfirmedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState(() => {
    return new URLSearchParams(location.search).get("orderId") || `ZOM${Math.floor(100000000 + Math.random() * 900000000)}`;
  });
  const [activeStep, setActiveStep] = useState(0);
  const [countdown, setCountdown] = useState(32 * 60); // 32 minutes in seconds
  const [isCancelled, setIsCancelled] = useState(false);

  // Poll status from database if orderId is valid
  useEffect(() => {
    const isMock = !new URLSearchParams(location.search).get("orderId");
    
    if (isMock) {
      // Run fallback simulated tracking timer
      const stepTimer = setInterval(() => {
        setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 6000);
      return () => clearInterval(stepTimer);
    } else {
      const fetchOrderStatus = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
          if (res.ok) {
            const order = await res.json();
            const status = order.status;
            setIsCancelled(status === 'Cancelled');
            if (status === 'Order Placed') setActiveStep(0);
            else if (status === 'Preparing') setActiveStep(1);
            else if (status === 'Out for Delivery') setActiveStep(2);
            else if (status === 'Delivered') {
              setActiveStep(3);
              setCountdown(0);
            } else if (status === 'Cancelled') {
              setActiveStep(-1);
            }
          }
        } catch (err) {
          console.error("Error polling order status:", err);
        }
      };

      fetchOrderStatus();
      const pollTimer = setInterval(fetchOrderStatus, 4000);
      return () => clearInterval(pollTimer);
    }
  }, [orderId, location.search]);

  // Countdown timer
  useEffect(() => {
    if (isCancelled || activeStep === 3) return;
    const countTimer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countTimer);
  }, [isCancelled, activeStep]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  return (
    <div style={{ minHeight: "80vh", background: "#f8f8f8" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 24px" }}>
        {/* Success animation */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 100, height: 100, borderRadius: "50%", background: isCancelled ? "linear-gradient(135deg, #7f1d1d, #ef4444)" : "linear-gradient(135deg, #3d9b6e, #60b246)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            boxShadow: isCancelled ? "0 8px 32px rgba(239,68,68,0.3)" : "0 8px 32px rgba(61,155,110,0.3)", fontSize: 48,
          }}>
            {isCancelled ? "❌" : "🎉"}
          </div>
          <h1 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 900, fontSize: 30, color: "#1c1c1c", margin: "0 0 8px" }}>
            {isCancelled ? "Order Cancelled" : "Order Confirmed!"}
          </h1>
          <p style={{ color: "#696969", fontSize: 16, margin: 0 }}>
            {isCancelled ? "This order was cancelled by control operations." : "Your food is being prepared with love"}
          </p>
          <div style={{ display: "inline-block", background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: 8, padding: "6px 16px", marginTop: 12 }}>
            <span style={{ fontSize: 13, color: "#9e9e9e" }}>Order ID: </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1c1c1c" }}>{orderId}</span>
          </div>
        </div>

        {/* ETA or Cancelled card */}
        {isCancelled ? (
          <div style={{
            background: "linear-gradient(135deg, #7f1d1d, #ef4444)",
            borderRadius: 20, padding: "28px 32px", textAlign: "center", marginBottom: 28,
            boxShadow: "0 8px 32px rgba(239,68,68,0.25)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.9)", margin: "0 0 8px", fontSize: 14, fontWeight: 700 }}>ORDER CANCELLED</p>
            <div style={{ fontFamily: "Poppins, sans-serif", color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1.4 }}>
              Your order has been manually cancelled by the administrator.
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", margin: "12px 0 0", fontSize: 13 }}>
              Please contact customer support for refund or dispute information.
            </p>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(135deg, #e23744, #c0222f)",
            borderRadius: 20, padding: "28px 32px", textAlign: "center", marginBottom: 28,
            boxShadow: "0 8px 32px rgba(226,55,68,0.25)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.8)", margin: "0 0 8px", fontSize: 14 }}>Estimated Delivery Time</p>
            <div style={{ fontFamily: "Poppins, sans-serif", color: "#fff", fontWeight: 900, fontSize: 52, lineHeight: 1 }}>
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "8px 0 0", fontSize: 13 }}>
              Arriving by {new Date(Date.now() + countdown * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}

        {/* Tracking Steps */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: "0 0 24px" }}>
            Live Order Tracking
          </h3>
          {steps.map((step, i) => (
            <div key={step.label} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: i < steps.length - 1 ? 24 : 0 }}>
              {/* Step indicator */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: i <= activeStep ? (i === activeStep ? "#e23744" : "#3d9b6e") : "#e8e8e8",
                  fontSize: i <= activeStep ? 18 : 16, transition: "all 0.5s",
                  boxShadow: i === activeStep ? "0 4px 16px rgba(226,55,68,0.3)" : "none",
                }}>
                  {i < activeStep ? "✓" : step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: i < activeStep ? "#3d9b6e" : "#e8e8e8", marginTop: 4, height: 32, transition: "background 0.5s" }} />
                )}
              </div>

              {/* Step content */}
              <div style={{ flex: 1, paddingTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: i <= activeStep ? 700 : 400, fontSize: 15, color: i <= activeStep ? "#1c1c1c" : "#9e9e9e", transition: "all 0.5s" }}>
                    {step.label}
                  </span>
                  <span style={{ fontSize: 12, color: "#9e9e9e" }}>{step.time}</span>
                </div>
                <p style={{ margin: "3px 0 0", fontSize: 13, color: i <= activeStep ? "#696969" : "#c0c0c0", transition: "all 0.5s" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery info */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #e23744, #ff6b7a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>👨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1c1c1c" }}>Rahul Kumar</div>
              <div style={{ fontSize: 13, color: "#696969" }}>Your delivery partner</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ width: 40, height: 40, borderRadius: "50%", background: "#f0fff4", border: "1.5px solid #bbf7d0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>📞</button>
              <button style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff0f1", border: "1.5px solid #ffd6d9", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>💬</button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => navigate("/")}
            style={{ flex: 1, background: "#fff", color: "#e23744", border: "1.5px solid #e23744", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/restaurants")}
            style={{ flex: 1, background: "#e23744", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 16px rgba(226,55,68,0.3)" }}
          >
            Order Again 🍽️
          </button>
        </div>
      </div>
    </div>
  );
}
