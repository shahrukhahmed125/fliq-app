import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// In-memory fallback for environments where SecureStore is unavailable
const memoryFallback = new Map<string, string>();

export const secureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(key, value);
        return;
      }
    } catch {
      // Fallback
    }
    memoryFallback.set(key, value);
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS !== 'web') {
        const value = await SecureStore.getItemAsync(key);
        if (value !== null) return value;
      }
    } catch {
      // Fallback
    }
    return memoryFallback.get(key) ?? null;
  },

  deleteItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(key);
        return;
      }
    } catch {
      // Fallback
    }
    memoryFallback.delete(key);
  },
};
