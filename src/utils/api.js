
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const assetAPI = {
  addAsset: (data) => api.post('/api/assets', data),
  getHRAssets: (params) => api.get('/api/assets/hr-assets', { params }),
  getAvailableAssets: (params) => api.get('/api/assets/available', { params }),
  getAssetById: (id) => api.get(`/api/assets/${id}`),
  updateAsset: (id, data) => api.put(`/api/assets/${id}`, data),
  deleteAsset: (id) => api.delete(`/api/assets/${id}`),
  getAssetStats: () => api.get('/api/assets/stats/overview')
};