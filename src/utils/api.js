
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
export const requestAPI = {
  createRequest: (data) => api.post('/api/requests', data),
  getHRRequests: (params) => api.get('/api/requests/hr-requests', { params }),
  getMyRequests: () => api.get('/api/requests/my-requests'),
  approveRequest: (id) => api.put(`/api/requests/${id}/approve`),
  rejectRequest: (id) => api.put(`/api/requests/${id}/reject`),
  returnAsset: (assignmentId) => api.put(`/api/requests/return/${assignmentId}`)
};
export const employeeAPI = {
  getMyAssets: (params) => api.get('/api/employees/my-assets', { params }),
  getMyTeam: () => api.get('/api/employees/my-team'),
  getTeamBirthdays: () => api.get('/api/employees/team-birthdays'),
  getMyAffiliations: () => api.get('/api/employees/my-affiliations'),
  getHREmployees: (params) => api.get('/api/employees/hr-employees', { params }),
  removeEmployee: (email) => api.delete(`/api/employees/remove/${email}`)
};
export const packageAPI = {
  getAllPackages: () => api.get('/api/packages'),
  getMyPackage: () => api.get('/api/packages/my-package')
};