import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { restaurants } from "../data/restaurants";
import { useCart } from "../context/CartContext";
import type { MenuItem } from "../data/restaurants";

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, items, updateQuantity, totalItems, totalPrice } = useCart();

  const restaurant = restaurants.find((r) => r.id === id);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!restaurant) {
    return (
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <div style={{ fontSize: 64 }}>😕</div>
        <h2 style={{ fontFamily: "Poppins, sans-serif", margin: "16px 0 8px" }}>Restaurant not found</h2>
        <button onClick={() => navigate("/restaurants")} style={{ background: "#e23744", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", fontSize: 15 }}>
          Browse Restaurants
        </button>
      </div>
    );
  }

  const categories = Object.keys(restaurant.menu);
  const activeCat = activeCategory || categories[0];

  function getQuantity(itemId: string) {
    return items.find((i) => i.id === itemId)?.quantity || 0;
  }

  const allItems = Object.values(restaurant.menu).flat();
  const filteredItems = allItems.filter((item) => {
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const displayItems = searchQuery || vegOnly ? filteredItems : restaurant.menu[activeCat] || [];

  return (
    <div>
      {/* Cover Image */}
      <div style={{ height: 260, background: "#1c1c1c", position: "relative", overflow: "hidden" }}>
        <img src={restaurant.coverImage} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
        <button
          onClick={() => navigate(-1)}
          style={{ position: "absolute", top: 20, left: 24, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          ←
        </button>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "Poppins, sans-serif", color: "#fff", fontWeight: 800, fontSize: 32, margin: "0 0 4px" }}>{restaurant.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", margin: 0, fontSize: 15 }}>{restaurant.cuisine.join(" · ")} · {restaurant.address}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Info Bar */}
        <div style={{ background: "#fff", borderRadius: "0 0 16px 16px", padding: "20px 24px", marginBottom: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", display: "flex", gap: 32, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: "#3d9b6e", color: "#fff", borderRadius: 6, padding: "4px 10px", fontSize: 14, fontWeight: 700 }}>⭐ {restaurant.rating}</div>
            <span style={{ color: "#696969", fontSize: 14 }}>{restaurant.reviewCount.toLocaleString()} reviews</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#696969", fontSize: 14 }}>
            <span>🕐</span><span>{restaurant.deliveryTime}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#696969", fontSize: 14 }}>
            <span>🚴</span>
            <span>{restaurant.deliveryFee === 0 ? "Free delivery" : `₹${restaurant.deliveryFee} delivery`}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#696969", fontSize: 14 }}>
            <span>🛒</span><span>Min order ₹{restaurant.minOrder}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexWrap: "wrap" }}>
            {restaurant.offers.map((offer) => (
              <div key={offer} style={{ background: "#fff0f1", border: "1px solid #ffd6d9", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#e23744", fontWeight: 600 }}>
                🏷️ {offer}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }} className="restaurant-layout">
          {/* Left Sidebar — Categories */}
          <div className="hidden md:block">
            <div style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", position: "sticky", top: 80 }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e8e8e8" }}>
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 14, color: "#1c1c1c", margin: 0, letterSpacing: "0.5px" }}>MENU CATEGORIES</h3>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearchQuery(""); setVegOnly(false); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "14px 20px",
                    background: activeCat === cat && !searchQuery && !vegOnly ? "#fff0f1" : "transparent",
                    border: "none", borderLeft: `3px solid ${activeCat === cat && !searchQuery && !vegOnly ? "#e23744" : "transparent"}`,
                    cursor: "pointer", fontSize: 14, fontWeight: activeCat === cat ? 600 : 400,
                    color: activeCat === cat && !searchQuery && !vegOnly ? "#e23744" : "#1c1c1c",
                    transition: "all 0.15s", display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <span>{cat}</span>
                  <span style={{ fontSize: 12, color: "#9e9e9e" }}>{restaurant.menu[cat].length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right — Menu Items */}
          <div>
            {/* Controls */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in menu..."
                  style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none" }}
                />
              </div>
              <button
                onClick={() => setVegOnly(!vegOnly)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                  border: `1.5px solid ${vegOnly ? "#3d9b6e" : "#e8e8e8"}`,
                  background: vegOnly ? "#f0fff4" : "#fff",
                  color: vegOnly ? "#3d9b6e" : "#696969",
                  borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500,
                }}
              >
                <div style={{ width: 14, height: 14, border: `2px solid #3d9b6e`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {vegOnly && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3d9b6e" }} />}
                </div>
                Veg Only
              </button>
            </div>

            {/* Category header */}
            {!searchQuery && !vegOnly && (
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 22, color: "#1c1c1c", margin: "0 0 20px" }}>
                {activeCat} <span style={{ fontSize: 15, fontWeight: 400, color: "#9e9e9e" }}>({displayItems.length})</span>
              </h2>
            )}
            {(searchQuery || vegOnly) && (
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 22, color: "#1c1c1c", margin: "0 0 20px" }}>
                {displayItems.length} item{displayItems.length !== 1 ? "s" : ""} found
              </h2>
            )}

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {displayItems.map((item: MenuItem) => {
                const qty = getQuantity(item.id);
                return (
                  <div key={item.id} style={{
                    background: "#fff", borderRadius: 14, padding: "20px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)", display: "flex", gap: 16, alignItems: "flex-start",
                  }}>
                    {/* Veg/non-veg indicator */}
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <div style={{ width: 16, height: 16, border: `2px solid ${item.isVeg ? "#3d9b6e" : "#e23744"}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.isVeg ? "#3d9b6e" : "#e23744" }} />
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1c1c1c" }}>{item.name}</h3>
                        {item.isBestseller && (
                          <span style={{ background: "#fff8e7", color: "#f59d0e", border: "1px solid #fde68a", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>
                            ⭐ Bestseller
                          </span>
                        )}
                      </div>
                      <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#1c1c1c" }}>₹{item.price}</p>
                      <p style={{ margin: 0, fontSize: 13, color: "#696969", lineHeight: 1.5 }}>{item.description}</p>
                    </div>

                    {/* Image + Add button */}
                    <div style={{ flexShrink: 0, textAlign: "center" }}>
                      <div style={{ width: 100, height: 80, borderRadius: 10, overflow: "hidden", background: "#f0f0f0", marginBottom: 10 }}>
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {qty === 0 ? (
                        <button
                          onClick={() => addItem(item, restaurant)}
                          style={{
                            background: "#fff", border: "1.5px solid #e23744", color: "#e23744",
                            borderRadius: 8, padding: "7px 20px", fontSize: 14, fontWeight: 700,
                            cursor: "pointer", width: "100%", fontFamily: "Poppins, sans-serif",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#e23744"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; (e.currentTarget as HTMLButtonElement).style.color = "#e23744"; }}
                        >
                          ADD
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 0, background: "#e23744", borderRadius: 8, overflow: "hidden", width: "100%" }}>
                          <button
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "7px 10px", fontSize: 18, fontWeight: 700 }}
                          >−</button>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, flex: 1, textAlign: "center" }}>{qty}</span>
                          <button
                            onClick={() => addItem(item, restaurant)}
                            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "7px 10px", fontSize: 18, fontWeight: 700 }}
                          >+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {displayItems.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: "#696969" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                  <p>No items found. Try a different search.</p>
                </div>
              )}
            </div>

            {/* Mobile — categories row */}
            <div className="flex md:hidden" style={{ gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24, scrollbarWidth: "none" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${activeCat === cat ? "#e23744" : "#e8e8e8"}`,
                    background: activeCat === cat ? "#fff0f1" : "#fff",
                    color: activeCat === cat ? "#e23744" : "#696969",
                    cursor: "pointer", fontSize: 13, fontWeight: 500, flexShrink: 0,
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Bar */}
      {totalItems > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, padding: "12px 24px", background: "transparent", pointerEvents: "none" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", pointerEvents: "all" }}>
            <button
              onClick={() => navigate("/cart")}
              style={{
                width: "100%", background: "#e23744", color: "#fff", border: "none",
                borderRadius: 14, padding: "16px 24px", fontSize: 16, fontWeight: 700,
                cursor: "pointer", fontFamily: "Poppins, sans-serif",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 8px 32px rgba(226,55,68,0.4)",
              }}
            >
              <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 10px" }}>{totalItems} items</span>
              <span>View Cart</span>
              <span>₹{totalPrice}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
