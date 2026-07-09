import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmedPage from "./pages/OrderConfirmedPage";
import ProtectRoutes from "./components/ProtectRoutes";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";


export default function App() {
  const [isloggedIn, setIsLogin] = useState(() => {
    return localStorage.getItem("isloggedIn") === "true";
  });
  const [data, setdata] = useState<any[]>([]);
  async function fetchdata() {
    const res = await fetch("http://localhost:8006/api/users/all");
    const data = await res.json();
    setdata(data);
  }
  useEffect(() => {
    fetchdata();
  }, [])
  return (

    <CartProvider>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8f8f8" }}>
        <Navbar isloggedIn={isloggedIn} setIsLogin={setIsLogin} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
            <Route path="/cart" element={
              <ProtectRoutes isloggedIn={isloggedIn}>
                <CartPage />
              </ProtectRoutes>
            } />
            <Route path="/profile" element={
              <ProtectRoutes isloggedIn={isloggedIn}>
                <Profile />
              </ProtectRoutes>
            } />
            <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="/signup" element={<Signup setData={setdata} />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
            <Route path="*" element={
              <div style={{ textAlign: "center", padding: "120px 20px" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
                <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: 28, color: "#1c1c1c" }}>Page not found</h2>
                <a href="/" style={{ color: "#e23744", fontSize: 16, fontWeight: 600 }}>Go back home</a>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
