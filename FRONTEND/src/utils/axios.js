import axios from 'axios';

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

export default axiosInstance;

