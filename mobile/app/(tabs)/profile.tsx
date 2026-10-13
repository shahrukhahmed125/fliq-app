import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  ShieldCheck,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Bookmark,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { PostCard } from '../../src/components/posts/PostCard';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, posts, savedPosts } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'saved' | 'media'>('posts');

  // Filter posts authored by current user
  const userPosts = posts.filter(
    (p) => p.user.id === currentUser.id || p.user.username === currentUser.username
  );

  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'posts', label: 'Posts' },
    { key: 'replies', label: 'Replies' },
    { key: 'saved', label: 'Saved' },
    { key: 'media', label: 'Media' },
  ];

  const getDisplayedFeed = () => {
    switch (activeTab) {
      case 'saved':
        return savedPosts;
      case 'media':
        return userPosts.filter((p) => p.media && p.media.length > 0);
      case 'replies':
      case 'posts':
      default:
        return userPosts;
    }
  };

  const displayedList = getDisplayedFeed();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top action header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{currentUser.name}</Text>
          <Text style={styles.headerSubtitle}>{userPosts.length} thoughts</Text>
        </View>

        <Pressable
          style={styles.settingsIconBtn}
          onPress={() => router.push('/settings/account')}
          hitSlop={8}
        >
          <Settings size={22} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Banner */}
        <View style={styles.coverBanner}>
          {currentUser.profile_cover ? (
            <Image
              source={{ uri: currentUser.profile_cover }}
              style={styles.coverImage}
            />
          ) : (
            <View style={styles.coverFallback} />
          )}
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>🇵🇰 Pakistan</Text>
          </View>
        </View>

        {/* Profile Info Area */}
        <View style={styles.profileMetaArea}>
          {/* Avatar and Edit button */}
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Avatar
                uri={currentUser.profile_photo}
                name={currentUser.name}
                size={76}
                isVerified={currentUser.is_verified}
              />
            </View>

            <View style={styles.actionRow}>
              <Pressable
                style={styles.editProfileBtn}
                onPress={() => router.push('/edit-profile')}
              >
                <Text style={styles.editProfileText}>Edit profile</Text>
              </Pressable>
              <Pressable
                style={styles.savedIconBtn}
                onPress={() => router.push('/saved')}
                hitSlop={4}
              >
                <Bookmark size={16} color={COLORS.textPrimary} />
              </Pressable>
            </View>
          </View>

          {/* Name & verification */}
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            {currentUser.is_verified && <ShieldCheck size={18} color={COLORS.primary} />}
          </View>
          <Text style={styles.userHandle}>{currentUser.username}</Text>

          {/* Bio */}
          {currentUser.bio ? <Text style={styles.userBio}>{currentUser.bio}</Text> : null}

          {/* Meta Details */}
          <View style={styles.detailsRow}>
            {currentUser.city ? (
              <View style={styles.detailItem}>
                <MapPin size={13} color={COLORS.textMuted} />
                <Text style={styles.detailText}>{currentUser.city}</Text>
              </View>
            ) : null}
            {currentUser.website ? (
              <View style={styles.detailItem}>
                <LinkIcon size={13} color={COLORS.primary} />
                <Text style={[styles.detailText, styles.detailLink]}>
                  {currentUser.website.replace('https://', '')}
                </Text>
              </View>
            ) : null}
            <View style={styles.detailItem}>
              <Calendar size={13} color={COLORS.textMuted} />
              <Text style={styles.detailText}>Joined May 2024</Text>
            </View>
          </View>

          {/* Statistics Bar (tappable to view lists) */}
          <View style={styles.statsBar}>
            <Pressable
              style={styles.statItem}
              onPress={() => router.push(`/followers/${currentUser.username.replace('@', '')}`)}
            >
              <Text style={styles.statValue}>
                {currentUser.followers_count >= 1000
                  ? `${(currentUser.followers_count / 1000).toFixed(1)}K`
                  : currentUser.followers_count}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>

            <Pressable
              style={styles.statItem}
              onPress={() => router.push(`/following/${currentUser.username.replace('@', '')}`)}
            >
              <Text style={styles.statValue}>{currentUser.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userPosts.length || currentUser.posts_count}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>
        </View>

        {/* Profile Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((t) => (
            <Pressable
              key={t.key}
              style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Feed of posts */}
        {displayedList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'saved' ? 'No saved posts' : 'No posts under this tab'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'saved'
                ? 'Bookmarks you save from the feed will appear here.'
                : 'Share your first thought with the Pakistani community.'}
            </Text>
            {activeTab === 'posts' && (
              <Pressable
                style={styles.createBtn}
                onPress={() => router.push('/(tabs)/create')}
              >
                <Text style={styles.createBtnText}>Post a Thought</Text>
              </Pressable>
            )}
          </View>
        ) : (
          displayedList.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPressPost={() => router.push(`/post/${post.id}`)}
            />
          ))
        )}
      </ScrollView>
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
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  settingsIconBtn: {
    padding: SPACING.xs,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  coverBanner: {
    height: 124,
    backgroundColor: COLORS.primaryDark,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: SPACING.sm,
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primaryDark,
  },
  bannerBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  profileMetaArea: {
    paddingHorizontal: SPACING.lg,
    backgroundColor: '#FFFFFF',
    paddingBottom: SPACING.md,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -38,
    marginBottom: SPACING.sm,
  },
  avatarWrap: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    elevation: 3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  editProfileBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
  },
  editProfileText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  savedIconBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  userHandle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  userBio: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginVertical: SPACING.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginVertical: SPACING.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  detailLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsBar: {
    flexDirection: 'row',
    gap: SPACING.xxl,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: SPACING.xxxl,
    marginTop: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
    lineHeight: 18,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.lg,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
});
