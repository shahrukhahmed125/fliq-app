import axios from 'axios';
import { storageService } from '../services/storageService';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://127.0.0.1:8080/api',
  withCredentials: false,
  timeout: 4000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: any) => {
    const token = await storageService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response?.status === 401) {
      await storageService.clear();
    }
    return Promise.reject(error);
  }
);

export default api;
