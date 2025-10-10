import axios from 'axios';
import { getUserIdForApi } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach X-User-ID header for authenticated requests
api.interceptors.request.use(
  async (config) => {
    const userId = getUserIdForApi && getUserIdForApi();
    if (userId) {
      config.headers['X-User-ID'] = userId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;