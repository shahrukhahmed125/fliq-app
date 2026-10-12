import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { authService } from '../services/api/authService';
import { secureStorage } from '../services/storage/secureStorage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await secureStorage.getItem('auth_token');
        const storedUser = await secureStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Provide default guest/demo session for fast on-device onboarding
          const demoUser: User = {
            id: '1',
            name: 'Shahrukh Ahmed',
            username: '@shahrukh',
            email: 'shahrukh@fliq.pk',
            bio: 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools.',
            city: 'Pakistan',
            is_verified: true,
            followers_count: 12800,
            following_count: 186,
            posts_count: 42,
            created_at: '2024-05-01T00:00:00.000Z',
          };
          const demoToken = 'demo_token';
          await secureStorage.setItem('auth_token', demoToken);
          await secureStorage.setItem('auth_user', JSON.stringify(demoUser));
          setToken(demoToken);
          setUser(demoUser);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const next = { ...user, ...updated };
      setUser(next);
      secureStorage.setItem('auth_user', JSON.stringify(next));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
