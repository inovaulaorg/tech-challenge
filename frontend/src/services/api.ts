import axios, { AxiosResponse, AxiosError } from 'axios';
import { AuthResponse, ApiError } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // If the 401 comes from login/register endpoints, let the component handle it
      // (so the LoginPage/RegisterPage can show a specific toast and remain on the page).
      const reqUrl = (error.config && (error.config.url || '')) as string;
      const isAuthEndpoint = /\/auth\/(login|register)$/.test(reqUrl);

      if (!isAuthEndpoint) {
        // Clear token and notify application about unauthorized state.
        // Previously we did a full-page redirect which caused 404s in some deployments.
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        try {
          window.dispatchEvent(new CustomEvent('unauthorized'));
        } catch (e) {
          // ignore
        }
      }
      // If it's an auth endpoint, do not dispatch or clear storage here — allow the
      // caller to show the appropriate error message and remain on the page.
    }
    return Promise.reject(error);
  }
);

// Auth utilities
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setUserData = (user: any) => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

export const getUserData = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export default api;