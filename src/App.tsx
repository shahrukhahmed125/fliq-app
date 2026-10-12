import React from 'react';
import { AuthProvider } from './context/AuthProvider';
import { NavigationProvider } from './navigation/NavigationContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <AppNavigator />
      </NavigationProvider>
    </AuthProvider>
  );
}
