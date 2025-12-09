import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCategories = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export const getSubCategories = async () => {
  const response = await api.get('/subcategories/');
  return response.data;
};

export const getProducts = async (filters = {}) => {
  const response = await api.get('/products/', { params: filters });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}/`);
  return response.data;
};

export const uploadProductImage = async (formData) => {
  const response = await api.post('/products/upload-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
