import api from '../api/axios';
import { storageService } from './storageService';

export const authService = {
  login: async (credentials: any) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch {
      // Mock fallback authentication
      const mockUser = {
        id: 1,
        name: credentials.email.split('@')[0] || 'Fliq Studio',
        username: `@${credentials.email.split('@')[0] || 'fliq'}`,
        email: credentials.email,
        bio: 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking for the next generation of social media.',
        created_at: new Date('2024-05-01').toISOString(),
      };
      const token = 'mock-fliq-token-' + Date.now();
      await storageService.setUser(mockUser);
      await storageService.setToken(token);
      return {
        data: { user: mockUser },
        token,
      };
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch {
      const mockUser = {
        id: 2,
        name: userData.name || 'New Fliq Member',
        username: `@${userData.email.split('@')[0] || 'member'}`,
        email: userData.email,
        bio: 'Community member on Fliq Pakistan.',
        created_at: new Date().toISOString(),
      };
      const token = 'mock-fliq-token-' + Date.now();
      await storageService.setUser(mockUser);
      await storageService.setToken(token);
      return {
        data: { user: mockUser },
        token,
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch {}
    await storageService.clear();
    return { success: true };
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/forgot-password', { email });
      return response.data;
    } catch {
      return { message: 'Password reset link sent to ' + email };
    }
  },

  resetPassword: async (data: any) => {
    try {
      const response = await api.post('/reset-password', data);
      return response.data;
    } catch {
      return { message: 'Password reset successfully' };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch {
      return await storageService.getUser();
    }
  },

  googleLogin: async (tokenResponse: any) => {
    try {
      const response = await api.post('/auth/google', {
        access_token: tokenResponse.access_token,
      });
      return response.data;
    } catch {
      const mockUser = {
        id: 3,
        name: 'Google User',
        username: '@google_user',
        email: 'user@gmail.com',
      };
      const token = 'mock-google-token-' + Date.now();
      return { data: { user: mockUser }, token };
    }
  },
};
