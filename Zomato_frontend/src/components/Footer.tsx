import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#1c1c1c", color: "#9e9e9e", marginTop: 80, paddingTop: 60, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #e23744, #ff6b7a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🍽️</div>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 20, color: "#e23744" }}>zomato</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>Delivering happiness to your doorstep. Order food from the best restaurants near you.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {["📘", "🐦", "📸", "▶️"].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: "0.5px" }}>COMPANY</h4>
            {["About Us", "Careers", "Blog", "Investor Relations", "Report Fraud"].map((item) => (
              <div key={item} style={{ marginBottom: 10 }}>
                <Link to="/" style={{ color: "#9e9e9e", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e23744")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9e9e9e")}
                >{item}</Link>
              </div>
            ))}
          </div>

          {/* For Restaurants */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: "0.5px" }}>FOR RESTAURANTS</h4>
            {["Partner with us", "Apps for you", "Business Blog", "Advertise", "Hygiene Ratings"].map((item) => (
              <div key={item} style={{ marginBottom: 10 }}>
                <Link to="/" style={{ color: "#9e9e9e", textDecoration: "none", fontSize: 13 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e23744")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9e9e9e")}
                >{item}</Link>
              </div>
            ))}
          </div>

          {/* Learn More */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: "0.5px" }}>LEARN MORE</h4>
            {["Privacy", "Security", "Terms", "Sitemap", "Help"].map((item) => (
              <div key={item} style={{ marginBottom: 10 }}>
                <Link to="/" style={{ color: "#9e9e9e", textDecoration: "none", fontSize: 13 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e23744")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9e9e9e")}
                >{item}</Link>
              </div>
            ))}
          </div>

          {/* Download App */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 14, letterSpacing: "0.5px" }}>GET THE APP</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#2a2a2a", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>
                <span style={{ fontSize: 22 }}>🍎</span>
                <div><div style={{ fontSize: 10, color: "#9e9e9e" }}>Download on the</div><div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>App Store</div></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#2a2a2a", borderRadius: 10, padding: "10px 14px", cursor: "pointer" }}>
                <span style={{ fontSize: 22 }}>🤖</span>
                <div><div style={{ fontSize: 10, color: "#9e9e9e" }}>Get it on</div><div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Google Play</div></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, margin: 0 }}>© 2024 Zomato Clone. Built with ❤️ in India</p>
          <p style={{ fontSize: 13, margin: 0 }}>🌍 India · 🌐 English</p>
        </div>
      </div>
    </footer>
  );
}
