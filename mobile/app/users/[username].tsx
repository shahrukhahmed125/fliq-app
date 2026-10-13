import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  MapPin,
  Link as LinkIcon,
  MessageSquare,
  ArrowLeft,
  Share2,
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { PostCard } from '../../src/components/posts/PostCard';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function UserProfileScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { getUserByUsername, posts, toggleFollow } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');

  const user = getUserByUsername(username || '');

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Creator profile not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Filter posts by this user
  const userPosts = posts.filter(
    (p) => p.user.username.toLowerCase() === user.username.toLowerCase()
  );

  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'posts', label: 'Posts' },
    { key: 'replies', label: 'Replies' },
    { key: 'media', label: 'Media' },
    { key: 'likes', label: 'Likes' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Banner */}
        <View style={styles.coverBanner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>🇵🇰 Pakistan</Text>
          </View>
        </View>

        {/* Profile Info Area */}
        <View style={styles.profileMetaArea}>
          {/* Avatar and Action buttons */}
          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <Avatar
                uri={user.profile_photo}
                name={user.name}
                size={76}
                isVerified={user.is_verified}
              />
            </View>

            <View style={styles.actionBtnsRow}>
              <Pressable
                style={[styles.followBtn, user.is_following && styles.followingBtn]}
                onPress={() => toggleFollow(user.username)}
              >
                <Text style={[styles.followBtnText, user.is_following && styles.followingBtnText]}>
                  {user.is_following ? 'Following' : 'Follow'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.messageBtn}
                onPress={() => alert(`Direct messages with ${user.name} will be available in the upcoming update!`)}
              >
                <MessageSquare size={18} color={COLORS.textPrimary} />
              </Pressable>
            </View>
          </View>

          {/* Name & verification */}
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{user.name}</Text>
            {user.is_verified && <ShieldCheck size={18} color={COLORS.primary} />}
          </View>
          <Text style={styles.userHandle}>{user.username}</Text>

          {/* Bio */}
          {user.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}

          {/* Meta Details */}
          <View style={styles.detailsRow}>
            {user.city && (
              <View style={styles.detailItem}>
                <MapPin size={13} color={COLORS.textMuted} />
                <Text style={styles.detailText}>{user.city}</Text>
              </View>
            )}
            {user.website && (
              <View style={styles.detailItem}>
                <LinkIcon size={13} color={COLORS.primary} />
                <Text style={[styles.detailText, styles.detailLink]}>
                  {user.website.replace('https://', '')}
                </Text>
              </View>
            )}
          </View>

          {/* Statistics Bar (tappable to view lists) */}
          <View style={styles.statsBar}>
            <Pressable
              style={styles.statItem}
              onPress={() => router.push(`/followers/${user.username.replace('@', '')}`)}
            >
              <Text style={styles.statValue}>
                {user.followers_count >= 1000
                  ? `${(user.followers_count / 1000).toFixed(1)}K`
                  : user.followers_count}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </Pressable>

            <Pressable
              style={styles.statItem}
              onPress={() => router.push(`/following/${user.username.replace('@', '')}`)}
            >
              <Text style={styles.statValue}>{user.following_count}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </Pressable>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userPosts.length || user.posts_count}</Text>
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

        {/* Feed of user posts */}
        {userPosts.length === 0 ? (
          <View style={styles.emptyPostsArea}>
            <Text style={styles.emptyPostsTitle}>No posts yet</Text>
            <Text style={styles.emptyPostsSub}>
              {user.name} hasn't shared any thoughts yet.
            </Text>
          </View>
        ) : (
          userPosts.map((post) => (
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
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
  },
  notFoundText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  backBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  coverBanner: {
    height: 120,
    backgroundColor: COLORS.primaryDark,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: SPACING.sm,
  },
  bannerBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  followBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  followingBtn: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  followingBtnText: {
    color: COLORS.textPrimary,
  },
  messageBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    width: 36,
    height: 36,
    borderRadius: 18,
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
  emptyPostsArea: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
  },
  emptyPostsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptyPostsSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
