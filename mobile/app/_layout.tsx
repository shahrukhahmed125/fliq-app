import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORS.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="post/[id]"
            options={{
              headerShown: true,
              headerTitle: 'Post',
              headerBackTitle: 'Back',
              headerTintColor: COLORS.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="settings/account"
            options={{
              headerShown: true,
              headerTitle: 'Account Settings',
              headerTintColor: COLORS.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
          <Stack.Screen
            name="settings/display"
            options={{
              headerShown: true,
              headerTitle: 'Display & Appearance',
              headerTintColor: COLORS.textPrimary,
              headerStyle: { backgroundColor: '#FFFFFF' },
            }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
