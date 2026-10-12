import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { storageService } from '../services/storageService';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const storedUser = await storageService.getUser();
      const storedToken = await storageService.getToken();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      } else {
        // Seed default friendly profile for Pakistan community experience
        const defaultUser = {
          id: 1,
          name: 'Shahrukh Ahmed',
          username: '@shahrukh',
          email: 'shahrukh@fliq.pk',
          bio: 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking for the next generation of social media.',
          created_at: '2024-05-01T00:00:00.000Z',
        };
        const defaultToken = 'demo-fliq-token';
        await storageService.setUser(defaultUser);
        await storageService.setToken(defaultToken);
        setUser(defaultUser);
        setToken(defaultToken);
      }

      setLoading(false);
    };

    loadAuth();
  }, []);

  const login = (userData: any, tokenData: string) => {
    storageService.setUser(userData);
    storageService.setToken(tokenData);
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    storageService.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
