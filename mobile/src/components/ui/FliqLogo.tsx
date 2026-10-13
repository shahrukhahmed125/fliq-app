import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { FliqMark } from './FliqMark';
import { COLORS } from '../../constants/theme';

interface FliqLogoProps {
  size?: number; // Height of the mark
  theme?: 'light' | 'dark';
  style?: ViewStyle;
}

export const FliqLogo: React.FC<FliqLogoProps> = ({
  size = 28,
  theme = 'light',
  style,
}) => {
  const textColor = theme === 'dark' ? '#FFFFFF' : COLORS.textPrimary;
  const fontSize = size * 0.95;

  return (
    <View style={[styles.container, style]}>
      <FliqMark size={size} color={COLORS.primary} />
      <Text style={[styles.text, { fontSize, color: textColor }]}>fliq</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '900',
    letterSpacing: -0.75,
    fontFamily: 'System',
    transform: [{ translateY: -1 }],
  },
});
