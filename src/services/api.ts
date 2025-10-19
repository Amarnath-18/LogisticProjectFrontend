import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on /me route 401 errors to prevent infinite refresh
    if (error.response?.status === 401 && 
        !error.config?.url?.includes('/Auth/me')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
