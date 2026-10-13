import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../../constants/theme';

interface FliqMarkProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Fliq Winged 'F' Brand Mark
 * Vector representation of Fliq's signature 3-feather diagonal logo
 */
export const FliqMark: React.FC<FliqMarkProps> = ({
  size = 32,
  color = COLORS.primary,
  style,
}) => {
  // Original aspect ratio: 80 wide x 90 high
  const scale = size / 32;

  return (
    <View style={[{ width: size, height: size * 1.1 }, styles.container, style]}>
      <Svg
        width={size}
        height={size * 1.1}
        viewBox="0 0 100 110"
        fill="none"
      >
        {/* Top Wing / Feather */}
        <Path
          d="M32 10 L88 10 L56 32 L22 32 L32 10 Z"
          fill={color}
        />
        {/* Middle Wing / Feather */}
        <Path
          d="M22 38 L72 38 L42 60 L14 60 L22 38 Z"
          fill={color}
        />
        {/* Bottom Wing / Feather */}
        <Path
          d="M14 66 L52 66 L28 88 L6 88 L14 66 Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
