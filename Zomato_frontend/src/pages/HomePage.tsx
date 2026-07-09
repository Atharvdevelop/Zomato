import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { restaurants, cuisineCategories } from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";

const heroStats = [
  { label: "Restaurants", value: "1.5L+" },
  { label: "Cities", value: "800+" },
  { label: "Orders Daily", value: "2M+" },
];

const offers = [
  { title: "50% OFF up to ₹100", subtitle: "Use code WELCOME50", color: "#ff6b7a", bg: "#fff0f1", icon: "🎉" },
  { title: "Free Delivery", subtitle: "On your first 5 orders", color: "#3d9b6e", bg: "#f0fff4", icon: "🚴" },
  { title: "Extra 20% OFF", subtitle: "On weekend orders", color: "#f59d0e", bg: "#fffbeb", icon: "🌟" },
  { title: "Buy 1 Get 1", subtitle: "On selected restaurants", color: "#7c3aed", bg: "#f5f3ff", icon: "🎁" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory) params.set("cuisine", activeCategory);
    navigate(`/restaurants?${params.toString()}`);
  }

  const featured = restaurants.slice(0, 3);
  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #1c1c1c 0%, #2d1a1a 50%, #3a1010 100%)",
        padding: "80px 24px 100px", position: "relative", overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(226,55,68,0.15) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(226,55,68,0.1) 0%, transparent 70%)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(226,55,68,0.15)", border: "1px solid rgba(226,55,68,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ color: "#ff6b7a", fontSize: 13, fontWeight: 600 }}>India's #1 Food Delivery App</span>
              </div>

              <h1 style={{
                fontFamily: "Poppins, sans-serif", color: "#fff", margin: "0 0 8px",
                fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px",
              }}>
                Craving something<br />
                <span style={{ color: "#e23744" }}>delicious?</span>
              </h1>

              <p style={{ color: "#9e9e9e", fontSize: 18, margin: "16px 0 36px", lineHeight: 1.6, maxWidth: 480 }}>
                Order from thousands of restaurants near you. Fast delivery, great food.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch}>
                <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", maxWidth: 560 }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderRight: "1px solid #e8e8e8", gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 18 }}>📍</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1c1c1c" }}>New Delhi</span>
                    <span style={{ fontSize: 11, color: "#9e9e9e" }}>▼</span>
                  </div>
                  <input
                    type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for restaurant or dish..."
                    style={{ flex: 1, padding: "16px 16px", border: "none", outline: "none", fontSize: 15, fontFamily: "Inter, sans-serif", color: "#1c1c1c" }}
                  />
                  <button type="submit" style={{
                    background: "#e23744", color: "#fff", border: "none", padding: "0 24px",
                    fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif",
                  }}>
                    Search
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div style={{ display: "flex", gap: 32, marginTop: 36 }}>
                {heroStats.map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 24, color: "#fff" }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: "#9e9e9e" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden lg:block" style={{ position: "relative" }}>
              <div style={{
                width: 320, height: 320, borderRadius: "50%",
                background: "rgba(226,55,68,0.1)", border: "2px solid rgba(226,55,68,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              }}>
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop&auto=format"
                  alt="Delicious food"
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section style={{ padding: "60px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: 0 }}>
              What are you craving?
            </h2>
            <p style={{ color: "#696969", margin: "4px 0 0", fontSize: 14 }}>Browse by cuisine type</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 16 }}>
          {cuisineCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(activeCategory === cat.name ? null : cat.name);
                navigate(`/restaurants?cuisine=${encodeURIComponent(cat.name)}`);
              }}
              style={{
                background: activeCategory === cat.name ? "#fff0f1" : "#fff",
                border: `2px solid ${activeCategory === cat.name ? "#e23744" : "#e8e8e8"}`,
                borderRadius: 14, padding: "16px 8px", cursor: "pointer", textAlign: "center",
                transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              }}
              onMouseEnter={(e) => { if (activeCategory !== cat.name) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e23744"; }}
              onMouseLeave={(e) => { if (activeCategory !== cat.name) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e8e8e8"; }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", background: "#f0f0f0" }}>
                <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: activeCategory === cat.name ? "#e23744" : "#1c1c1c" }}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Offers Strip */}
      <section style={{ padding: "60px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: "0 0 24px" }}>
          Best Offers for You 🎯
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {offers.map((offer) => (
            <div key={offer.title} style={{
              background: offer.bg, border: `1.5px solid ${offer.color}22`,
              borderRadius: 14, padding: "20px 20px", display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", transition: "transform 0.2s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div style={{ fontSize: 32 }}>{offer.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: offer.color }}>{offer.title}</div>
                <div style={{ fontSize: 12, color: "#696969", marginTop: 2 }}>{offer.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section style={{ padding: "60px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: 0 }}>
              Popular near you 📍
            </h2>
            <p style={{ color: "#696969", margin: "4px 0 0", fontSize: 14 }}>Based on your location</p>
          </div>
          <button
            onClick={() => navigate("/restaurants")}
            style={{ background: "none", border: "1.5px solid #e23744", color: "#e23744", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            See all →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {featured.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      </section>

      {/* Top Rated */}
      <section style={{ padding: "60px 24px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 26, color: "#1c1c1c", margin: 0 }}>
              Top Rated 🌟
            </h2>
            <p style={{ color: "#696969", margin: "4px 0 0", fontSize: 14 }}>Highest rated restaurants</p>
          </div>
          <button
            onClick={() => navigate("/restaurants?sort=rating")}
            style={{ background: "none", border: "1.5px solid #e23744", color: "#e23744", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
          >
            See all →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {topRated.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      </section>

      {/* Why Zomato Section */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 28, color: "#1c1c1c", textAlign: "center", margin: "0 0 48px" }}>
          Why order from Zomato?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 32 }}>
          {[
            { icon: "⚡", title: "Super Fast Delivery", desc: "Average delivery time of 30 minutes or less to your door" },
            { icon: "💰", title: "Best Prices", desc: "Exclusive deals and discounts you won't find anywhere else" },
            { icon: "🔒", title: "Safe & Secure", desc: "100% secure payments with multiple payment options available" },
            { icon: "⭐", title: "Quality Assured", desc: "Restaurants rated by millions of genuine food lovers" },
          ].map((item) => (
            <div key={item.title} style={{ textAlign: "center", padding: "32px 20px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
              <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#1c1c1c", margin: "0 0 10px" }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#696969", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ margin: "0 24px 60px", maxWidth: 1200 - 48, marginLeft: "auto", marginRight: "auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #e23744, #c0222f)",
          borderRadius: 20, padding: "48px 48px", display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 24, overflow: "hidden", position: "relative",
        }}>
          <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "Poppins, sans-serif", color: "#fff", fontWeight: 800, fontSize: 28, margin: "0 0 8px" }}>
              Hungry? Order now!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 16 }}>
              Use code <strong>FIRST50</strong> for 50% off your first order
            </p>
          </div>
          <button
            onClick={() => navigate("/restaurants")}
            style={{
              background: "#fff", color: "#e23744", border: "none",
              borderRadius: 12, padding: "14px 32px", fontSize: 16, fontWeight: 800,
              cursor: "pointer", fontFamily: "Poppins, sans-serif", flexShrink: 0,
            }}
          >
            Order Now →
          </button>
        </div>
      </section>
    </div>
  );
}
