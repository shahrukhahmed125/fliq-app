import React from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  MapPin,
  MoreHorizontal,
} from 'lucide-react-native';
import { Post } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { Avatar } from '../ui/Avatar';
import { MediaCollage } from './MediaCollage';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
  onPressPost?: (post: Post) => void;
  onPressComment?: (post: Post) => void;
  showBorder?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPressPost,
  onPressComment,
  showBorder = true,
}) => {
  const router = useRouter();
  const { toggleLike, toggleRepost, toggleBookmark, currentUser } = useApp();

  const handlePressAuthor = () => {
    if (post.user.id === currentUser.id || post.user.username === currentUser.username) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/users/${post.user.username.replace('@', '')}`);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.user.name} on Fliq: "${post.content.slice(0, 100)}..." https://fliq.pk/post/${post.id}`,
      });
    } catch {
      // Ignore
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        showBorder && styles.bordered,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPressPost?.(post)}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handlePressAuthor}>
          <Avatar
            uri={post.user.profile_photo}
            name={post.user.name}
            size={42}
            isVerified={post.user.is_verified}
          />
        </Pressable>

        <View style={styles.headerMeta}>
          <View style={styles.authorRow}>
            <Pressable onPress={handlePressAuthor}>
              <Text style={styles.authorName} numberOfLines={1}>
                {post.user.name}
              </Text>
            </Pressable>
            <Pressable onPress={handlePressAuthor}>
              <Text style={styles.authorUsername} numberOfLines={1}>
                {post.user.username}
              </Text>
            </Pressable>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.timestamp}>{formatTimestamp(post.created_at)}</Text>
          </View>

          {post.city && (
            <View style={styles.cityPill}>
              <MapPin size={9} color={COLORS.primaryDark} />
              <Text style={styles.cityText}>{post.city}</Text>
            </View>
          )}
        </View>

        <Pressable style={styles.moreBtn} hitSlop={8} onPress={handleShare}>
          <MoreHorizontal size={18} color={COLORS.textMuted} />
        </Pressable>
      </View>

      {/* Content Text */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Topics */}
      {post.topics && post.topics.length > 0 && (
        <View style={styles.topicsRow}>
          {post.topics.map((topic) => (
            <Pressable
              key={topic}
              onPress={() => router.push('/(tabs)/explore')}
              hitSlop={4}
            >
              <Text style={styles.topicTag}>#{topic}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Media Collage */}
      <MediaCollage media={post.media} onPressMedia={() => onPressPost?.(post)} />

      {/* Action Toolbar */}
      <View style={styles.toolbar}>
        {/* Comment */}
        <Pressable
          style={styles.actionBtn}
          onPress={() =>
            onPressComment ? onPressComment(post) : onPressPost ? onPressPost(post) : null
          }
          hitSlop={6}
        >
          <MessageCircle size={18} color={COLORS.textSecondary} />
          <Text style={styles.actionCount}>{post.comments_count}</Text>
        </Pressable>

        {/* Repost */}
        <Pressable
          style={styles.actionBtn}
          onPress={() => toggleRepost(post.id)}
          hitSlop={6}
        >
          <Repeat2
            size={18}
            color={post.is_reposted ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.actionCount, post.is_reposted && styles.activePrimaryCount]}>
            {post.reposts_count}
          </Text>
        </Pressable>

        {/* Like */}
        <Pressable
          style={styles.actionBtn}
          onPress={() => toggleLike(post.id)}
          hitSlop={6}
        >
          <Heart
            size={18}
            color={post.is_liked ? COLORS.like : COLORS.textSecondary}
            fill={post.is_liked ? COLORS.like : 'transparent'}
          />
          <Text style={[styles.actionCount, post.is_liked && styles.activeLikeCount]}>
            {post.likes_count}
          </Text>
        </Pressable>

        {/* Bookmark */}
        <Pressable
          style={styles.actionBtn}
          onPress={() => toggleBookmark(post.id)}
          hitSlop={6}
        >
          <Bookmark
            size={18}
            color={post.is_bookmarked ? COLORS.primary : COLORS.textSecondary}
            fill={post.is_bookmarked ? COLORS.primary : 'transparent'}
          />
        </Pressable>

        {/* Share */}
        <Pressable style={styles.actionBtn} onPress={handleShare} hitSlop={6}>
          <Share2 size={18} color={COLORS.textSecondary} />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  bordered: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardPressed: {
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  headerMeta: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  authorName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginRight: 4,
    maxWidth: 120,
  },
  authorUsername: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginRight: 4,
    maxWidth: 90,
  },
  dotSeparator: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginRight: 4,
  },
  timestamp: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
    gap: 3,
  },
  cityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  moreBtn: {
    padding: 4,
  },
  content: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  topicTag: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    gap: 5,
  },
  actionCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeLikeCount: {
    color: COLORS.like,
    fontWeight: '700',
  },
  activePrimaryCount: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
