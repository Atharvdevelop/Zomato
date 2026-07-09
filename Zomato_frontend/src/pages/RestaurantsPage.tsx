import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { restaurants, cuisineCategories } from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";

const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating (High to Low)", value: "rating" },
  { label: "Delivery Time", value: "delivery" },
  { label: "Cost: Low to High", value: "cost_asc" },
];

const filterOptions = ["Pure Veg", "Free Delivery", "Open Now", "Rating 4.0+"];

export default function RestaurantsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const cuisineParam = searchParams.get("cuisine") || "";
  const sortParam = searchParams.get("sort") || "relevance";

  const [sort, setSort] = useState(sortParam);
  const [activeCuisine, setActiveCuisine] = useState(cuisineParam);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(q);

  function toggleFilter(f: string) {
    setActiveFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  }

  const filtered = useMemo(() => {
    let list = [...restaurants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some((c) => c.toLowerCase().includes(q)) ||
        Object.values(r.menu).flat().some((item) => item.name.toLowerCase().includes(q))
      );
    }

    if (activeCuisine) {
      list = list.filter((r) => r.cuisine.some((c) => c.toLowerCase().includes(activeCuisine.toLowerCase())));
    }

    if (activeFilters.includes("Pure Veg")) {
      list = list.filter((r) => r.tags.includes("Pure Veg") || r.cuisine.includes("South Indian"));
    }
    if (activeFilters.includes("Free Delivery")) {
      list = list.filter((r) => r.deliveryFee === 0);
    }
    if (activeFilters.includes("Open Now")) {
      list = list.filter((r) => r.isOpen);
    }
    if (activeFilters.includes("Rating 4.0+")) {
      list = list.filter((r) => r.rating >= 4.0);
    }

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "delivery") list.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    else if (sort === "cost_asc") list.sort((a, b) => a.minOrder - b.minOrder);

    return list;
  }, [searchQuery, activeCuisine, activeFilters, sort]);

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Page Header */}
      <div style={{ background: "linear-gradient(135deg, #1c1c1c, #2d1a1a)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Poppins, sans-serif", color: "#fff", fontWeight: 800, fontSize: 32, margin: "0 0 20px" }}>
            Restaurants near you 📍
          </h1>
          {/* Search */}
          <div style={{ position: "relative", maxWidth: 560 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>🔍</span>
            <input
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, cuisines, dishes..."
              style={{
                width: "100%", padding: "14px 16px 14px 48px", border: "none",
                borderRadius: 12, fontSize: 15, fontFamily: "Inter, sans-serif",
                background: "#fff", outline: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Cuisine filter pills */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          <button
            onClick={() => setActiveCuisine("")}
            style={{
              padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${activeCuisine === "" ? "#e23744" : "#e8e8e8"}`,
              background: activeCuisine === "" ? "#fff0f1" : "#fff", color: activeCuisine === "" ? "#e23744" : "#696969",
              cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            }}
          >
            All
          </button>
          {cuisineCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCuisine(activeCuisine === cat.name ? "" : cat.name)}
              style={{
                padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${activeCuisine === cat.name ? "#e23744" : "#e8e8e8"}`,
                background: activeCuisine === cat.name ? "#fff0f1" : "#fff",
                color: activeCuisine === cat.name ? "#e23744" : "#696969",
                cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Filters + Sort row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 32 }}>
          {/* Filters */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                style={{
                  padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${activeFilters.includes(f) ? "#e23744" : "#e8e8e8"}`,
                  background: activeFilters.includes(f) ? "#fff0f1" : "#fff",
                  color: activeFilters.includes(f) ? "#e23744" : "#696969",
                  cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                }}
              >
                {activeFilters.includes(f) ? "✓ " : ""}{f}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#696969", fontWeight: 500 }}>Sort by:</span>
            <select
              value={sort} onChange={(e) => setSort(e.target.value)}
              style={{
                padding: "7px 12px", border: "1.5px solid #e8e8e8", borderRadius: 8,
                fontSize: 13, fontFamily: "Inter, sans-serif", color: "#1c1c1c",
                background: "#fff", cursor: "pointer", outline: "none",
              }}
            >
              {sortOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p style={{ fontSize: 14, color: "#696969", marginBottom: 24 }}>
          {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""} found
          {activeCuisine ? ` for "${activeCuisine}"` : ""}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 22, color: "#1c1c1c", margin: "0 0 8px" }}>
              No restaurants found
            </h3>
            <p style={{ color: "#696969", fontSize: 15 }}>Try adjusting your filters or search for something else</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCuisine(""); setActiveFilters([]); }}
              style={{ marginTop: 20, background: "#e23744", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", fontSize: 15, fontWeight: 600 }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
