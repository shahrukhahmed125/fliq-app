import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Sparkles, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { FliqMark } from '../../src/components/ui/FliqMark';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('shahrukh@fliq.pk');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await login({ email: email.trim(), password: password.trim() });
      router.replace('/(tabs)');
    } catch {
      setError('Unable to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setEmail('shahrukh@fliq.pk');
    setPassword('password123');
    try {
      setLoading(true);
      await login({ email: 'shahrukh@fliq.pk', password: 'password123' });
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Back to Welcome */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={22} color={COLORS.textPrimary} />
          </Pressable>

          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <FliqMark size={34} color="#FFFFFF" />
            </View>
            <Text style={styles.brandTitle}>Welcome back</Text>
            <Text style={styles.brandSubtitle}>Sign in to your Fliq account</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@fliq.pk"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passwordLabelRow}>
                <Text style={styles.label}>Password</Text>
                <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={styles.forgotLink}>Forgot?</Text>
                </Pressable>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={8}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={COLORS.textMuted} />
                  ) : (
                    <Eye size={18} color={COLORS.textMuted} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Sign In</Text>
              )}
            </Pressable>

            {/* Quick Demo Fill Button */}
            <Pressable style={styles.demoFillBtn} onPress={handleDemoSignIn}>
              <Sparkles size={14} color={COLORS.primaryDark} />
              <Text style={styles.demoFillText}>Quick Demo Sign In (1-Tap)</Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push('/(auth)/sign-up')}>
                <Text style={styles.signupLink}> Sign up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.xxl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  errorBanner: {
    backgroundColor: COLORS.likeSurface,
    color: COLORS.like,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    fontSize: FONT_SIZE.xs,
    textAlign: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotLink: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  eyeBtn: {
    paddingHorizontal: SPACING.md,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySurface,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  demoFillText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xxl,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  signupLink: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
