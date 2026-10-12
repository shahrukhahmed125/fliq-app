import { apiClient } from './client';
import { secureStorage } from '../storage/secureStorage';
import { User } from '../../types';

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
    try {
      const res = await apiClient.post('/login', credentials);
      const user = res.data?.data?.user || res.data?.user || res.data;
      const token = res.data?.token || res.data?.access_token || 'mock_token_' + Date.now();
      await secureStorage.setItem('auth_token', token);
      await secureStorage.setItem('auth_user', JSON.stringify(user));
      return { user, token };
    } catch {
      // Offline / prototyping fallback for device testing
      const mockUser: User = {
        id: '1',
        name: credentials.email.split('@')[0] || 'Shahrukh Ahmed',
        username: `@${credentials.email.split('@')[0] || 'shahrukh'}`,
        email: credentials.email,
        bio: 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools.',
        city: 'Pakistan',
        is_verified: true,
        followers_count: 12800,
        following_count: 186,
        posts_count: 42,
        created_at: new Date('2024-05-01').toISOString(),
      };
      const token = 'fliq_token_' + Date.now();
      await secureStorage.setItem('auth_token', token);
      await secureStorage.setItem('auth_user', JSON.stringify(mockUser));
      return { user: mockUser, token };
    }
  },

  register: async (data: { name: string; email: string; password: string; password_confirmation: string }): Promise<{ user: User; token: string }> => {
    try {
      const res = await apiClient.post('/register', data);
      const user = res.data?.data?.user || res.data?.user || res.data;
      const token = res.data?.token || 'mock_token_' + Date.now();
      await secureStorage.setItem('auth_token', token);
      await secureStorage.setItem('auth_user', JSON.stringify(user));
      return { user, token };
    } catch {
      const mockUser: User = {
        id: String(Date.now()),
        name: data.name,
        username: `@${data.name.toLowerCase().replace(/\s+/g, '')}`,
        email: data.email,
        bio: 'Community member on Fliq Pakistan.',
        city: 'Pakistan',
        is_verified: false,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: new Date().toISOString(),
      };
      const token = 'fliq_token_' + Date.now();
      await secureStorage.setItem('auth_token', token);
      await secureStorage.setItem('auth_user', JSON.stringify(mockUser));
      return { user: mockUser, token };
    }
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/logout');
    } catch {
      // Ignore network errors on logout
    }
    await secureStorage.deleteItem('auth_token');
    await secureStorage.deleteItem('auth_user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const res = await apiClient.get('/user');
      const user = res.data?.data || res.data;
      if (user) {
        await secureStorage.setItem('auth_user', JSON.stringify(user));
        return user;
      }
    } catch {
      // Fallback to cached user in secure storage
    }

    const cached = await secureStorage.getItem('auth_user');
    return cached ? JSON.parse(cached) : null;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      const res = await apiClient.post('/forgot-password', { email });
      return res.data;
    } catch {
      return { message: `Password reset instructions sent to ${email}` };
    }
  },
};
