import axios from 'axios';

// Read Vercel environment variable or fallback to local backend for testing
const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Strip any trailing slash to prevent double slashes (e.g. /api//auth/login)
const baseURL = rawBaseURL.replace(/\/+$/, '');

const API = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Bearer JWT token to outgoing requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gracefully handle expired sessions or invalid tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if unauthorized and not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;