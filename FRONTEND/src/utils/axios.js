import axios from 'axios';
import { getAdminToken } from './cookies';

// Get backend URL from environment variable or use default
// In Vite, environment variables must be prefixed with VITE_ to be exposed to client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach admin token from localStorage to Authorization header if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

