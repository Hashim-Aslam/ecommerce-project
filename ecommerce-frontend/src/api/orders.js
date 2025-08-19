import api from './auth';

// Get user's orders
export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch orders');
  }
};

// Get order details
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch order details');
  }
};

// Create a new order
export const checkout = async (orderData) => {
  try {
    const response = await api.post('/orders/checkout', orderData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Checkout failed');
  }
};