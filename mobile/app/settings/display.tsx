import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon, Smartphone, Check } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function DisplaySettingsScreen() {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('light');

  const options = [
    { key: 'light', label: 'Light', desc: 'Crisp white interface with emerald accents', icon: Sun },
    { key: 'dark', label: 'Dark', desc: 'Calm, low-light palette for night reading', icon: Moon },
    { key: 'system', label: 'System', desc: 'Follow device system appearance', icon: Smartphone },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.heading}>Theme Preference</Text>
        <Text style={styles.subheading}>
          Choose how Fliq appears on your mobile device.
        </Text>

        <View style={styles.optionGroup}>
          {options.map((opt) => {
            const isSelected = selectedTheme === opt.key;
            const Icon = opt.icon;
            return (
              <Pressable
                key={opt.key}
                style={[styles.optionCard, isSelected && styles.optionCardActive]}
                onPress={() => setSelectedTheme(opt.key as any)}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconWrap, isSelected && styles.iconWrapActive]}>
                    <Icon size={18} color={isSelected ? '#FFFFFF' : COLORS.textSecondary} />
                  </View>
                  <View>
                    <Text style={styles.optionLabel}>{opt.label}</Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                </View>

                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Check size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Calmer Public Square Design</Text>
          <Text style={styles.infoText}>
            Fliq balances emerald tones and natural contrast to prevent eye fatigue during long discussions.
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
  content: {
    padding: SPACING.lg,
  },
  heading: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  subheading: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.lg,
  },
  optionGroup: {
    gap: SPACING.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md + 2,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  optionCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  optionDesc: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    marginTop: SPACING.xxxl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  infoTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  infoText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryDark,
    lineHeight: 18,
  },
});
