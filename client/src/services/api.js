import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for image uploads
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('evenx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (password) => api.post('/admin/login', { password }),
  verify: () => api.get('/admin/verify'),
};

export const eventsAPI = {
  getAll: (date) => api.get('/events', { params: { date } }),
  getById: (id) => api.get(`/events/${id}`),
  getStageSchedule: (date) => api.get('/events/schedule/stage', { params: { date } }),
};

export const adminAPI = {
  getAllEvents: () => api.get('/admin/events'),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/admin/upload', formData, {
      headers: {
        // Let browser set Content-Type with boundary
      },
      timeout: 60000, // 60 seconds for large uploads
    });
  },
};

export default api;