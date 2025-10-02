import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = user?.id ? `cart:${user.id}:v1` : 'cart:guest:v1';
  const [items, setItems] = useState([]);

  // Load items whenever the active user (storageKey) changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
  }, [items, storageKey]);

  const addToCart = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        // Item already in cart; do nothing (only one per course allowed)
        return prev;
      }
      const { quantity, ...rest } = item || {};
      return [...prev, { ...rest }];
    });
  };

  const removeFromCart = (id) => setItems((prev) => prev.filter((p) => p.id !== id));

  const updateItemQuantity = () => {
    // Quantities are not supported; no-op
  };

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({ items, addToCart, removeFromCart, updateItemQuantity, clearCart }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
