import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

let currentUserId = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach X-User-ID header for authenticated requests (only for endpoints that need it)
api.interceptors.request.use(
  async (config) => {
    // Only add X-User-ID header for instructor application endpoints that specifically need it
    if (config.url && config.url.includes('/instructor-applications') && currentUserId) {
      config.headers['X-User-ID'] = currentUserId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to set the current user ID
export const setCurrentUserId = (userId) => {
  currentUserId = userId;
};

export default api;