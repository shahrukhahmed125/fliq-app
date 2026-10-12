export const storageService = {
  setUser: async (user: any) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getUser: async () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setToken: async (token: string) => {
    try {
      localStorage.setItem('token', token);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getToken: async () => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  },

  clear: async () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.log('Failed to clear storage:', error);
    }
  },
};
