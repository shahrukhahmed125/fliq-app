import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/context/AuthContext';
import { AppProvider } from '../src/context/AppContext';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProvider>
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
                headerTitle: 'Post Discussion',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="users/[username]"
              options={{
                headerShown: true,
                headerTitle: 'Profile',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="followers/[username]"
              options={{
                headerShown: true,
                headerTitle: 'Followers',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="following/[username]"
              options={{
                headerShown: true,
                headerTitle: 'Following',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="saved"
              options={{
                headerShown: true,
                headerTitle: 'Saved Posts',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="edit-profile"
              options={{
                headerShown: true,
                headerTitle: 'Edit Profile',
                headerBackTitle: 'Cancel',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="settings/account"
              options={{
                headerShown: true,
                headerTitle: 'Account Settings',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="settings/display"
              options={{
                headerShown: true,
                headerTitle: 'Display & Appearance',
                headerBackTitle: 'Back',
                headerTintColor: COLORS.textPrimary,
                headerStyle: { backgroundColor: '#FFFFFF' },
              }}
            />
          </Stack>
        </AppProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
