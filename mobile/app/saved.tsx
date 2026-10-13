import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bookmark } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';
import { PostCard } from '../src/components/posts/PostCard';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../src/constants/theme';

export default function SavedPostsScreen() {
  const router = useRouter();
  const { savedPosts } = useApp();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <FlatList
        data={savedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPressPost={() => router.push(`/post/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <Bookmark size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No saved posts</Text>
            <Text style={styles.emptySub}>
              Tap the bookmark icon on any post to save it for reading later.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    marginTop: SPACING.xxxl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptySub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
    lineHeight: 20,
  },
});
