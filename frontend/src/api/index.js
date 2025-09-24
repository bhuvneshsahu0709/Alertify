import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Auth endpoints
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// Admin endpoints
export const createAlert = (alertData) => api.post('/admin/alerts', alertData);
export const getAdminAlerts = () => api.get('/admin/alerts');
export const updateAlert = (id, alertData) => api.put(`/admin/alerts/${id}`, alertData);
export const archiveAlert = (id) => api.delete(`/admin/alerts/${id}`);
export const getTargetUsersAndTeams = () => api.get('/admin/targets');

// User endpoints
export const getUserAlerts = () => api.get('/users/alerts');
export const markAlertAsRead = (alertId) => api.post(`/users/alerts/${alertId}/read`);
export const snoozeUserAlert = (alertId) => api.post(`/users/alerts/${alertId}/snooze`);

// Analytics endpoints
export const getAnalyticsSummary = () => api.get('/analytics/summary');

export default api;