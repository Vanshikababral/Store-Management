import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const inventoryService = {
    getProducts: () => api.get('/products/'),
    getCategories: () => api.get('/categories/'),
    deleteProduct: (id) => api.delete(`/products/${id}/`),
    updateProduct: (id, data) => api.put(`/products/${id}/`, data),
    createProduct: (data) => api.post('/products/', data),
};