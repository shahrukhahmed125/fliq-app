import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export function useTheme() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<string>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem('theme');
      setTheme(saved || 'light');
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const saveTheme = async () => {
      if (theme === 'system') {
        await AsyncStorage.removeItem('theme');
      } else {
        await AsyncStorage.setItem('theme', theme);
      }
    };
    saveTheme();
  }, [theme]);

  const effectiveTheme = theme === 'system' ? (colorScheme || 'light') : theme;

  return { theme: effectiveTheme, setTheme };
}
