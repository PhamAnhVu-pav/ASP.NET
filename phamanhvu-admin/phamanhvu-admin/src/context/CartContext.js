import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Lỗi khi parse cart từ localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Lỗi khi lưu cart vào localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      if (!Array.isArray(prevCart)) return [{ ...product, quantity: 1 }];

      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);

    setCart((prevCart) =>
      Array.isArray(prevCart)
        ? prevCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        : []
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      Array.isArray(prevCart)
        ? prevCart.filter((item) => item.id !== productId)
        : []
    );
  };

  const getTotalPrice = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
