import axios from 'axios';

const BACKEND_URL =
  import.meta.env.VITE_APP_ENVIRONMENT === 'production'
    ? import.meta.env.VITE_API_SERVER
    : import.meta.env.VITE_API_SERVER_DEV;

const APPLICATION_KEY = import.meta.env.VITE_X_APPLICATION_KEY;

const http = axios.create({
  baseURL: BACKEND_URL,
});

// Interceptor de request: injeta Bearer + x-application-key
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (APPLICATION_KEY) config.headers['x-application-key'] = APPLICATION_KEY;
  return config;
});

// Interceptor de response: 401 → logout
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { BACKEND_URL };
export default http;