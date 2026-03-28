import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// User
export const getProfile = () => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);
export const updateCharity = (data) => API.put('/users/charity', data);

// Scores
export const getScores = () => API.get('/scores');
export const addScore = (data) => API.post('/scores', data);
export const updateScore = (id, data) => API.put(`/scores/${id}`, data);
export const deleteScore = (id) => API.delete(`/scores/${id}`);

// Charities
export const getCharities = (params) => API.get('/charities', { params });
export const getCharity = (id) => API.get(`/charities/${id}`);
export const getFeaturedCharities = () => API.get('/charities/featured');

// Subscription
export const getSubscriptionStatus = () => API.get('/subscription/status');
export const subscribe = (data) => API.post('/subscription/subscribe', data);
export const cancelSubscription = () => API.post('/subscription/cancel');

// Draws
export const getCurrentDraw = () => API.get('/draws/current');
export const getDrawHistory = () => API.get('/draws/history');
export const getMyDrawResults = () => API.get('/draws/my-results');

// Verification
export const uploadProof = (data) => API.post('/verification/upload', data);
export const getMyVerifications = () => API.get('/verification/my');

// Admin
export const adminGetUsers = (params) => API.get('/admin/users', { params });
export const adminUpdateUser = (id, data) => API.put(`/admin/users/${id}`, data);
export const adminGetUserScores = (id) => API.get(`/admin/users/${id}/scores`);
export const adminConfigureDraw = (data) => API.post('/admin/draws/configure', data);
export const adminSimulateDraw = (data) => API.post('/admin/draws/simulate', data);
export const adminPublishDraw = (data) => API.post('/admin/draws/publish', data);
export const adminCreateCharity = (data) => API.post('/admin/charities', data);
export const adminUpdateCharity = (id, data) => API.put(`/admin/charities/${id}`, data);
export const adminDeleteCharity = (id) => API.delete(`/admin/charities/${id}`);
export const adminGetWinners = (params) => API.get('/admin/winners', { params });
export const adminVerifyWinner = (id, data) => API.put(`/admin/winners/${id}/verify`, data);
export const adminMarkPaid = (id) => API.put(`/admin/winners/${id}/pay`);
export const adminGetAnalytics = () => API.get('/admin/analytics');

export default API;
