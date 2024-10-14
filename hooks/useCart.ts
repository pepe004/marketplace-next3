import { useState, useEffect } from 'react';

interface CartItem {
  $id: string;
  name: string;
  price: number;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: { $id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.$id === product.$id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.$id === product.$id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.$id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.$id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice };
}