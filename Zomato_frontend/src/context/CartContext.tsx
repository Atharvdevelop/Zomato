import { createContext, useContext, useState, ReactNode } from "react";
import type { MenuItem, Restaurant } from "../data/restaurants";

export interface CartItem extends MenuItem {
  quantity: number;
  restaurantId: string;
  restaurantName: string;
}

interface CartContextType {
  items: CartItem[];
  restaurant: { id: string; name: string } | null;
  addItem: (item: MenuItem, restaurant: Restaurant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurant, setRestaurant] = useState<{ id: string; name: string } | null>(null);

  function addItem(item: MenuItem, rest: Restaurant) {
    if (restaurant && restaurant.id !== rest.id) {
      if (!window.confirm(`Your cart has items from ${restaurant.name}. Clear cart and add from ${rest.name}?`)) return;
      setItems([]);
    }
    setRestaurant({ id: rest.id, name: rest.name });
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, restaurantId: rest.id, restaurantName: rest.name }];
    });
  }

  function removeItem(itemId: string) {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== itemId);
      if (next.length === 0) setRestaurant(null);
      return next;
    });
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, quantity } : i));
  }

  function clearCart() {
    setItems([]);
    setRestaurant(null);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, restaurant, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
