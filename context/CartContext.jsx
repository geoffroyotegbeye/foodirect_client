'use client'

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('foodirect_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [clientInfo, setClientInfo] = useState(() => {
    if (typeof window === 'undefined') return { name: '', phone: '', address: '' };
    try {
      const saved = localStorage.getItem('foodirect_client');
      return saved ? JSON.parse(saved) : { name: '', phone: '', address: '' };
    } catch { return { name: '', phone: '', address: '' }; }
  });

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('foodirect_cart', JSON.stringify(cart));
  }, [cart]);

  // Sauvegarder les infos client
  const saveClientInfo = (info) => {
    setClientInfo(info);
    localStorage.setItem('foodirect_client', JSON.stringify(info));
  };

  const addItem = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeItem(id);
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('foodirect_cart');
  };

  const total = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const getQty = (id) => cart.find(i => i.id === id)?.quantity || 0;

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total, itemCount, getQty, clientInfo, saveClientInfo }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
