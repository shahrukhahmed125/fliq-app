import { createContext } from 'react';

export interface AuthContextType {
  user: any;
  token: string | null;
  login: (userData: any, tokenData: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);
