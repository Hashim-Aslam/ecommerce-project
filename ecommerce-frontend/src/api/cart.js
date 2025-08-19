import api from './auth';

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch cart');
  }
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  try {
    const response = await api.post('/cart/add', { product_id: productId, quantity });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add item to cart');
  }
};

// Remove item from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.post(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to remove item from cart');
  }
};

// Clear the cart
export const clearCart = async () => {
  try {
    const response = await api.post('/cart/clear');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to clear cart');
  }
};