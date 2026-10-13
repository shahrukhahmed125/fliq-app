import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bookmark, MessageSquare, Plus } from 'lucide-react-native';
import { Post, User } from '../../src/types';
import { useApp } from '../../src/context/AppContext';
import { PostCard } from '../../src/components/posts/PostCard';
import { FliqLogo } from '../../src/components/ui/FliqLogo';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function FeedScreen() {
  const router = useRouter();
  const { posts, users, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'forYou' | 'following'>('forYou');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  // Filter posts based on active tab
  const displayedPosts =
    activeTab === 'following'
      ? posts.filter((p) => {
          const author = users[p.user.username];
          return author?.is_following || p.user.id === currentUser.id;
        })
      : posts;

  const creatorsList = Object.values(users);

  const handlePressPost = (post: Post) => {
    router.push(`/post/${post.id}`);
  };

  const handlePressUser = (user: User) => {
    if (user.id === currentUser.id || user.username === currentUser.username) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/users/${user.username.replace('@', '')}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Header with Fliq Logo */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <FliqLogo size={26} />
          <View style={styles.pkBadge}>
            <Text style={styles.pkBadgeText}>PK</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/saved')}
            hitSlop={8}
          >
            <Bookmark size={20} color={COLORS.textPrimary} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push('/(tabs)/create')}
            hitSlop={8}
          >
            <Plus size={22} color={COLORS.primary} />
          </Pressable>
        </View>
      </View>

      {/* Tabs Row: For You & Following */}
      <View style={styles.tabsRow}>
        <Pressable
          style={[styles.tabItem, activeTab === 'forYou' && styles.tabItemActive]}
          onPress={() => setActiveTab('forYou')}
        >
          <Text style={[styles.tabText, activeTab === 'forYou' && styles.tabTextActive]}>
            For You
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabItem, activeTab === 'following' && styles.tabItemActive]}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>
            Following
          </Text>
        </Pressable>
      </View>

      {/* Main Feed List with Featured Creators Header */}
      <FlatList
        data={displayedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPressPost={handlePressPost}
            onPressComment={handlePressPost}
          />
        )}
        ListHeaderComponent={
          activeTab === 'forYou' ? (
            <View style={styles.creatorsSection}>
              <View style={styles.creatorsHeader}>
                <Text style={styles.creatorsTitle}>Featured Creators</Text>
                <Pressable onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.seeAllText}>Explore →</Text>
                </Pressable>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.creatorsScroll}
              >
                {/* Current User add story / post circle */}
                <Pressable
                  style={styles.creatorStoryItem}
                  onPress={() => router.push('/(tabs)/create')}
                >
                  <View style={styles.myAvatarWrap}>
                    <Avatar
                      uri={currentUser.profile_photo}
                      name={currentUser.name}
                      size={54}
                    />
                    <View style={styles.addBadge}>
                      <Plus size={12} color="#FFFFFF" strokeWidth={3} />
                    </View>
                  </View>
                  <Text style={styles.creatorStoryName} numberOfLines={1}>
                    Your Post
                  </Text>
                </Pressable>

                {creatorsList.map((creator) => (
                  <Pressable
                    key={creator.id}
                    style={styles.creatorStoryItem}
                    onPress={() => handlePressUser(creator)}
                  >
                    <View style={styles.creatorAvatarRing}>
                      <Avatar
                        uri={creator.profile_photo}
                        name={creator.name}
                        size={52}
                        isVerified={creator.is_verified}
                      />
                    </View>
                    <Text style={styles.creatorStoryName} numberOfLines={1}>
                      {creator.name.split(' ')[0]}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'following' ? 'No posts from followed creators' : 'No posts yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'following'
                ? 'Follow Pakistani creators and journalists in Explore to populate your feed.'
                : 'Be the first to share an insight with the community.'}
            </Text>
            <Pressable
              style={styles.exploreEmptyBtn}
              onPress={() => router.push(activeTab === 'following' ? '/(tabs)/explore' : '/(tabs)/create')}
            >
              <Text style={styles.exploreEmptyBtnText}>
                {activeTab === 'following' ? 'Find Creators' : 'Create a Thought'}
              </Text>
            </Pressable>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  pkBadge: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  pkBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 9,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconButton: {
    padding: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  tabItem: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  creatorsSection: {
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  creatorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  creatorsTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  seeAllText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primary,
  },
  creatorsScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  creatorStoryItem: {
    alignItems: 'center',
    width: 64,
  },
  myAvatarWrap: {
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: COLORS.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  creatorAvatarRing: {
    padding: 2,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  creatorStoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    marginTop: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    maxWidth: 280,
    lineHeight: 20,
  },
  exploreEmptyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.full,
  },
  exploreEmptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
});
