import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "fortified_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) || [];
      return parsed.map((i) => {
        const qty = parseInt(i.quantity, 10);
        return {
          ...i,
          quantity: isNaN(qty) ? 1 : qty,
          colour: i.colour || "Black",
          price: Number(i.price) || 0,
        };
      });
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, size, colorOrQuantity = "Black", quantity = 1) => {
    let colour = "Black";
    let qty = 1;

    if (typeof colorOrQuantity === "number") {
      qty = colorOrQuantity;
      colour = product.colors?.[0] || "Black";
    } else if (typeof colorOrQuantity === "string") {
      colour = colorOrQuantity;
      qty = typeof quantity === "number" ? quantity : 1;
    }

    setItems((prev) => {
      const key = `${product.id}-${size}-${colour}`;
      const existing = prev.find((i) => i.key === key);

      let itemImage = product.images?.[0];

      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          key,
          product_id: product.id,
          name: product.name,
          size,
          colour,
          quantity: qty,
          price: Number(product.price) || 0,
          image: itemImage,
        },
      ];
    });
    setOpen(true);
  };

  const removeItem = (key) => setItems((prev) => prev.filter((i) => i.key !== key));
  const updateQty = (key, quantity) =>
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, count, subtotal, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);