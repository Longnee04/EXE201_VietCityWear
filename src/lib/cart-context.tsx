"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  toast: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("vcw_cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Failed to parse cart from local storage", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("vcw_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    setToast(`${item.name} (${item.size}) added to cart`);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, toast }}>
      {children}
      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-toast-in">
          <div className="bg-[#111] text-white text-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {toast}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
