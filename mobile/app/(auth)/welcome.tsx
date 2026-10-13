import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FliqMark } from '../../src/components/ui/FliqMark';
import { Button } from '../../src/components/ui/Button';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';
import { Sparkles } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Brand visual center */}
        <View style={styles.heroSection}>
          <View style={styles.iconBadge}>
            <FliqMark size={56} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>fliq</Text>
          <View style={styles.taglineBadge}>
            <Sparkles size={12} color={COLORS.primaryDark} />
            <Text style={styles.taglineBadgeText}>Pakistan's Calmer Social Space</Text>
          </View>
          <Text style={styles.description}>
            Fast enough for live Pakistani trends, thoughtful enough for creators, and simple enough to use every day.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            title="Create Account"
            onPress={() => router.push('/(auth)/sign-up')}
            size="lg"
            style={styles.primaryBtn}
          />
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/sign-in')}
            variant="outline"
            size="lg"
            style={styles.outlineBtn}
          />

          <Pressable
            style={styles.guestLink}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.guestText}>Explore as Guest →</Text>
          </Pressable>

          <Text style={styles.termsNote}>
            By continuing, you agree to Fliq's Community Guidelines and Privacy Policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xxl,
    justifyContent: 'space-between',
    paddingVertical: SPACING.xl,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  iconBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  taglineBadgeText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  actionSection: {
    width: '100%',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },
  primaryBtn: {
    width: '100%',
  },
  outlineBtn: {
    width: '100%',
  },
  guestLink: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  guestText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  termsNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
});
