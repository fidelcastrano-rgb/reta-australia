"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  key: string;
  id: string;
  name: string;
  variant: string;
  price: number;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addToOrder: (item: Omit<CartItem, 'key' | 'qty'> & { qty?: number }) => void;
  removeItem: (key: string) => void;
  clearOrder: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToOrder = (newItem: Omit<CartItem, 'key' | 'qty'> & { qty?: number }) => {
    setItems(prev => {
      // The instructions require using a | separator to avoid slug conflicts.
      const key = `${newItem.id}|${newItem.variant}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + (newItem.qty || 1) } : i);
      }
      return [...prev, { ...newItem, key, qty: newItem.qty || 1 }];
    });
  };

  const removeItem = (key: string) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const clearOrder = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToOrder, removeItem, clearOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
