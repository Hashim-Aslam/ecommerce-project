import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart, removeFromCart, clearCart } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addItem = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await addToCart(productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message || 'Failed to add item to cart');
      console.error('Error adding item to cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await removeFromCart(productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message || 'Failed to remove item from cart');
      console.error('Error removing item from cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearAllItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedCart = await clearCart();
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const itemCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  const value = {
    cart,
    loading,
    error,
    itemCount,
    cartTotal,
    fetchCart,
    addItem,
    removeItem,
    clearAllItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};