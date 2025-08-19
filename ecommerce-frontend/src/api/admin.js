import api from './auth';

// Product management
export const createProduct = async (productData) => {
  try {
    const response = await api.post('/admin/products', productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create product');
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/admin/products/${productId}`, productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update product');
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/admin/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete product');
  }
};

export const uploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/admin/products/${productId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to upload image');
  }
};

// Order management
export const getAllOrders = async () => {
  try {
    const response = await api.get('/admin/orders');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch orders');
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update order status');
  }
};