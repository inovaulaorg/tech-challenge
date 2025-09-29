import axios, { AxiosResponse, AxiosError } from 'axios';

const COOKIE_NAME = 'auth_token';

const setAuthToken = (token: string) => {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=604800`; 
};

const getAuthToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
  return match ? match[2] : null;
};

const removeAuthToken = () => {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
};

const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { setAuthToken, removeAuthToken, isAuthenticated, getAuthToken };
export default api;