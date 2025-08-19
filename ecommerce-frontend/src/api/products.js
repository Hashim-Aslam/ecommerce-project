import api from './auth';

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch products');
  }
};

// Get a single product by ID
export const getProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch product details');
  }
};