import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Products API
export const getCategories = async () => {
  const response = await api.get('/products/categories/');
  return response.data;
};

export const getSubCategories = async () => {
  const response = await api.get('/products/subcategories/');
  return response.data;
};

export const getProducts = async (filters = {}) => {
  const response = await api.get('/products/products/', { params: filters });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/products/${id}/`);
  return response.data;
};

export const uploadProductImage = async (formData) => {
  const response = await api.post('/products/products/upload-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Authentication API
export const register = async (userData) => {
  const response = await api.post('/auth/register/', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout/');
  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get('/auth/profile/');
  return response.data;
};

// Orders API
export const createOrder = async (orderData) => {
  const response = await api.post('/auth/orders/create/', orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/auth/orders/');
  return response.data;
};

export default api;
