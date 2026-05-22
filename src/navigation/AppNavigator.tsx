import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../lib/constants';
import SignInPage from '../features/auth/pages/SignInPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import FeedPage from '../features/feed/pages/FeedPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import AccountSettingsPage from '../features/settings/pages/AccountSettingsPage';
import DisplaySettingsPage from '../features/settings/pages/DisplaySettingsPage';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // Will add a loading screen later
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? ROUTES.HOME : ROUTES.SIGN_IN}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Guest Routes */}
        <Stack.Screen name={ROUTES.SIGN_IN} component={SignInPage} />
        <Stack.Screen name={ROUTES.SIGN_UP} component={SignUpPage} />
        <Stack.Screen name={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />

        {/* Protected Routes */}
        <Stack.Screen name={ROUTES.HOME} component={FeedPage} />
        <Stack.Screen name={ROUTES.PROFILE} component={ProfilePage} />
        <Stack.Screen name={ROUTES.SETTINGS_ACCOUNT} component={AccountSettingsPage} />
        <Stack.Screen name={ROUTES.SETTINGS_DISPLAY} component={DisplaySettingsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
