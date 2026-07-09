import { Link } from "react-router-dom";
import type { Restaurant } from "../data/restaurants";

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)", transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer", height: "100%",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.14)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 180, background: "#f0f0f0", overflow: "hidden" }}>
          <img
            src={restaurant.image}
            alt={restaurant.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Offer badge */}
          {restaurant.offers.length > 0 && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
              padding: "20px 12px 10px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 12, fontWeight: 600 }}>
                <span style={{ fontSize: 14 }}>🏷️</span>
                <span>{restaurant.offers[0]}</span>
              </div>
            </div>
          )}
          {/* Closed overlay */}
          {!restaurant.isOpen && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Currently Closed</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1c1c1c", fontFamily: "Poppins, sans-serif", lineHeight: 1.3 }}>
              {restaurant.name}
            </h3>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: restaurant.rating >= 4.5 ? "#3d9b6e" : restaurant.rating >= 4 ? "#60b246" : "#f59d0e",
              color: "#fff", borderRadius: 6, padding: "3px 7px", fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              ⭐ {restaurant.rating}
            </div>
          </div>

          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#696969", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {restaurant.cuisine.join(" · ")}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#696969" }}>
            <span>🕐 {restaurant.deliveryTime}</span>
            <span>•</span>
            <span>{restaurant.deliveryFee === 0 ? "🆓 Free delivery" : `🚴 ₹${restaurant.deliveryFee} delivery`}</span>
          </div>

          {/* Tags */}
          {restaurant.tags.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {restaurant.tags.map((tag) => (
                <span key={tag} style={{
                  padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: tag === "Trending" ? "#fff0f1" : tag === "Premium" ? "#f5f0ff" : "#f0f9f4",
                  color: tag === "Trending" ? "#e23744" : tag === "Premium" ? "#7c3aed" : "#3d9b6e",
                  border: `1px solid ${tag === "Trending" ? "#ffd6d9" : tag === "Premium" ? "#ddd6fe" : "#bbf7d0"}`,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
