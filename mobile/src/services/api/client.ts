import axios from 'axios';
import { secureStorage } from '../storage/secureStorage';

// Configurable via EXPO_PUBLIC_API_URL in .env
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api'; // 10.0.2.2 is Android emulator localhost to host

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// Attach Authorization token to outgoing requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept unauthorized responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await secureStorage.deleteItem('auth_token');
      await secureStorage.deleteItem('auth_user');
    }
    return Promise.reject(error);
  }
);
