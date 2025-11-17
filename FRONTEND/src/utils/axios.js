import axios from 'axios';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, // Include cookies in all requests
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;

