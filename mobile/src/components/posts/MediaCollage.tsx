import React from 'react';
import { View, Image, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { PostMedia } from '../../types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface MediaCollageProps {
  media: PostMedia[];
  onPressMedia?: (index: number) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Assume feed padding: 16px each side
const COLLAGE_WIDTH = SCREEN_WIDTH - 32;

export const MediaCollage: React.FC<MediaCollageProps> = ({ media, onPressMedia }) => {
  if (!media || media.length === 0) return null;

  const count = media.length;

  // Single Image
  if (count === 1) {
    const item = media[0];
    return (
      <Pressable
        style={styles.singleContainer}
        onPress={() => onPressMedia?.(0)}
      >
        <Image source={{ uri: item.file_path }} style={styles.singleImage} />
      </Pressable>
    );
  }

  // Two Images (50 / 50 columns)
  if (count === 2) {
    return (
      <View style={styles.twoGrid}>
        {media.map((item, idx) => (
          <Pressable
            key={item.id || idx}
            style={styles.twoItem}
            onPress={() => onPressMedia?.(idx)}
          >
            <Image source={{ uri: item.file_path }} style={styles.coverImage} />
          </Pressable>
        ))}
      </View>
    );
  }

  // Three Images (1 large on left, 2 stacked on right)
  if (count === 3) {
    return (
      <View style={styles.threeGrid}>
        <Pressable
          style={styles.threeLeft}
          onPress={() => onPressMedia?.(0)}
        >
          <Image source={{ uri: media[0].file_path }} style={styles.coverImage} />
        </Pressable>
        <View style={styles.threeRight}>
          <Pressable
            style={styles.threeStackedItem}
            onPress={() => onPressMedia?.(1)}
          >
            <Image source={{ uri: media[1].file_path }} style={styles.coverImage} />
          </Pressable>
          <Pressable
            style={styles.threeStackedItem}
            onPress={() => onPressMedia?.(2)}
          >
            <Image source={{ uri: media[2].file_path }} style={styles.coverImage} />
          </Pressable>
        </View>
      </View>
    );
  }

  // 4 or more Images (2x2 grid, with overlay on 4th tile if > 4)
  const displayed = media.slice(0, 4);
  const remainingCount = count - 4;

  return (
    <View style={styles.fourGrid}>
      {displayed.map((item, idx) => {
        const isFourthWithExtra = idx === 3 && remainingCount > 0;
        return (
          <Pressable
            key={item.id || idx}
            style={styles.fourItem}
            onPress={() => onPressMedia?.(idx)}
          >
            <Image source={{ uri: item.file_path }} style={styles.coverImage} />
            {isFourthWithExtra && (
              <View style={styles.overlayTile}>
                <Text style={styles.overlayText}>+{remainingCount}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  singleContainer: {
    width: '100%',
    height: 220,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceSubtle,
    marginTop: SPACING.sm,
  },
  singleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  twoGrid: {
    flexDirection: 'row',
    height: 190,
    gap: SPACING.xs,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  twoItem: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.surfaceSubtle,
  },
  threeGrid: {
    flexDirection: 'row',
    height: 220,
    gap: SPACING.xs,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  threeLeft: {
    flex: 1.2,
    height: '100%',
    backgroundColor: COLORS.surfaceSubtle,
  },
  threeRight: {
    flex: 1,
    gap: SPACING.xs,
    height: '100%',
  },
  threeStackedItem: {
    flex: 1,
    backgroundColor: COLORS.surfaceSubtle,
  },
  fourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 230,
    gap: SPACING.xs,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  fourItem: {
    width: '49.2%',
    height: '48.8%',
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  overlayTile: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
