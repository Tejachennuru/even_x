import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    // Do NOT set Content-Type header manually — letting the browser set it
    // ensures the multipart boundary is included. Setting it without the
    // boundary can break multer on the server and cause upload failures.
    return api.post('/admin/upload', formData);
  },
};

export default api;