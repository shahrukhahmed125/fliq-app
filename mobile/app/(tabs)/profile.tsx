import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Settings,
  ShieldCheck,
  MapPin,
  Link as LinkIcon,
  Calendar,
} from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Post } from '../../src/types';
import { postService } from '../../src/services/api/postService';
import { PostCard } from '../../src/components/posts/PostCard';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'media' | 'likes'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const posts = await postService.getPosts({ user_id: user?.id || '1' });
        setUserPosts(posts);
      } finally {
        setLoading(false);
      }
    };
    fetchUserPosts();
  }, [user]);

  const tabs: Array<{ key: typeof activeTab; label: string }> = [
    { key: 'posts', label: 'Posts' },
    { key: 'replies', label: 'Replies' },
    { key: 'media', label: 'Media' },
    { key: 'likes', label: 'Likes' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top action header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{user?.name || 'Shahrukh Ahmed'}</Text>
          <Text style={styles.headerSubtitle}>{userPosts.length} thoughts</Text>
        </View>

        <Pressable
          style={styles.settingsIconBtn}
          onPress={() => router.push('/settings/account')}
        >
          <Settings size={20} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Banner */}
        <View style={styles.coverBanner}>
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
                uri={user?.profile_photo}
                name={user?.name || 'Shahrukh Ahmed'}
                size={76}
                isVerified
              />
            </View>

            <Pressable
              style={styles.editProfileBtn}
              onPress={() => router.push('/settings/account')}
            >
              <Text style={styles.editProfileText}>Edit profile</Text>
            </Pressable>
          </View>

          {/* Name & verification */}
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{user?.name || 'Shahrukh Ahmed'}</Text>
            <ShieldCheck size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.userHandle}>{user?.username || '@shahrukh'}</Text>

          {/* Bio */}
          <Text style={styles.userBio}>
            {user?.bio ||
              'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking.'}
          </Text>

          {/* Meta Details */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <MapPin size={13} color={COLORS.textMuted} />
              <Text style={styles.detailText}>{user?.city || 'Pakistan'}</Text>
            </View>
            <View style={styles.detailItem}>
              <LinkIcon size={13} color={COLORS.primary} />
              <Text style={[styles.detailText, styles.detailLink]}>fliq.pk</Text>
            </View>
            <View style={styles.detailItem}>
              <Calendar size={13} color={COLORS.textMuted} />
              <Text style={styles.detailText}>Joined May 2024</Text>
            </View>
          </View>

          {/* Statistics Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12.8K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>186</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userPosts.length || 42}</Text>
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
        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator size="small" color={COLORS.primary} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
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
  loadingArea: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
  },
});
