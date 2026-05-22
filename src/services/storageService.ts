import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageService = {
  setUser: async (user: any) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },

  getUser: async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setToken: async (token: string) => {
    await AsyncStorage.setItem('token', token);
  },

  getToken: async () => {
    return await AsyncStorage.getItem('token');
  },

  clear: async () => {
    await AsyncStorage.multiRemove(['user', 'token']);
  },
};
