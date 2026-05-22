import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { storageService } from '../services/storageService';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth on app start
  useEffect(() => {
    const loadAuth = async () => {
      const storedUser = await storageService.getUser();
      const storedToken = await storageService.getToken();

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }

      setLoading(false);
    };

    loadAuth();
  }, []);

  // LOGIN (central function)
  const login = (userData: any, tokenData: string) => {
    storageService.setUser(userData);
    storageService.setToken(tokenData);

    setUser(userData);
    setToken(tokenData);
  };

  // LOGOUT (global)
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
