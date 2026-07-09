import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) navigate(`/restaurants?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <nav style={{ backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 24, height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #e23744, #ff6b7a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 20 }}>🍽️</span>
            </div>
            <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 22, color: "#e23744", letterSpacing: "-0.5px" }}>zomato</span>
          </div>
        </Link>

        {/* Location */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#1c1c1c", flexShrink: 0 }} className="hidden md:flex">
          <span style={{ fontSize: 18 }}>📍</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>New Delhi</div>
            <div style={{ fontSize: 11, color: "#9e9e9e" }}>110001</div>
          </div>
          <span style={{ fontSize: 12, color: "#9e9e9e" }}>▼</span>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#9e9e9e" }}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for restaurant, cuisine or dish..."
              style={{
                width: "100%", padding: "10px 14px 10px 42px",
                border: "1.5px solid #e8e8e8", borderRadius: 10,
                fontSize: 14, fontFamily: "Inter, sans-serif",
                background: "#f8f8f8", outline: "none", color: "#1c1c1c",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#e23744")}
              onBlur={(e) => (e.target.style.borderColor = "#e8e8e8")}
            />
          </div>
        </form>

        {/* Nav Links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: 20 }}>
          <Link to="/restaurants" style={{ textDecoration: "none", fontSize: 14, fontWeight: 500, color: "#696969" }}>
            Restaurants
          </Link>
          <Link to="/cart" style={{ position: "relative", textDecoration: "none" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
              background: "#e23744", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600,
            }}>
              <span>🛒</span>
              <span>Cart</span>
              {totalItems > 0 && (
                <span style={{
                  background: "#fff", color: "#e23744", borderRadius: "50%",
                  width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                }}>{totalItems}</span>
              )}
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex md:hidden"
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 24, padding: 4 }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid #e8e8e8", padding: "12px 24px 16px", background: "#fff" }} className="flex md:hidden flex-col gap-3">
          <Link to="/restaurants" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", fontSize: 15, fontWeight: 500, color: "#1c1c1c", padding: "8px 0" }}>
            🍴 Restaurants
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", fontSize: 15, fontWeight: 500, color: "#e23744", padding: "8px 0" }}>
            🛒 Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
        </div>
      )}
    </nav>
  );
}
