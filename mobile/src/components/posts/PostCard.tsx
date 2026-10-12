import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  MapPin,
} from 'lucide-react-native';
import { Post } from '../../types';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { Avatar } from '../ui/Avatar';
import { MediaCollage } from './MediaCollage';
import { postService } from '../../services/api/postService';

interface PostCardProps {
  post: Post;
  onPressPost?: (post: Post) => void;
  onPressComment?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPressPost, onPressComment }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isReposted, setIsReposted] = useState(post.is_reposted);
  const [repostsCount, setRepostsCount] = useState(post.reposts_count);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);

  const handleLike = async () => {
    // Optimistic UI update
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setIsLiked(nextLiked);
    setLikesCount(nextCount);

    try {
      await postService.toggleLike(post.id);
    } catch {
      // Revert if failed
      setIsLiked(!nextLiked);
      setLikesCount(likesCount);
    }
  };

  const handleRepost = async () => {
    const nextReposted = !isReposted;
    const nextCount = nextReposted ? repostsCount + 1 : Math.max(0, repostsCount - 1);
    setIsReposted(nextReposted);
    setRepostsCount(nextCount);

    await postService.toggleRepost(post.id);
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    await postService.toggleBookmark(post.id);
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
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPressPost?.(post)}
    >
      <View style={styles.header}>
        <Avatar
          uri={post.user.profile_photo}
          name={post.user.name}
          size={42}
          isVerified={post.user.is_verified}
        />
        <View style={styles.headerMeta}>
          <View style={styles.authorRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.user.name}
            </Text>
            <Text style={styles.authorUsername} numberOfLines={1}>
              {post.user.username}
            </Text>
            <Text style={styles.dotSeparator}>·</Text>
            <Text style={styles.timestamp}>{formatTimestamp(post.created_at)}</Text>
          </View>

          {post.city && (
            <View style={styles.cityPill}>
              <MapPin size={10} color={COLORS.primaryDark} />
              <Text style={styles.cityText}>{post.city}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content Text */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Topics */}
      {post.topics && post.topics.length > 0 && (
        <View style={styles.topicsRow}>
          {post.topics.map((topic) => (
            <Text key={topic} style={styles.topicTag}>
              #{topic}
            </Text>
          ))}
        </View>
      )}

      {/* Media Collage */}
      <MediaCollage media={post.media} />

      {/* Action Toolbar */}
      <View style={styles.toolbar}>
        {/* Comment */}
        <Pressable
          style={styles.actionBtn}
          onPress={() => onPressComment ? onPressComment(post) : onPressPost?.(post)}
        >
          <MessageCircle size={18} color={COLORS.textSecondary} />
          <Text style={styles.actionCount}>{post.comments_count}</Text>
        </Pressable>

        {/* Repost */}
        <Pressable style={styles.actionBtn} onPress={handleRepost}>
          <Repeat2
            size={18}
            color={isReposted ? COLORS.primary : COLORS.textSecondary}
          />
          <Text style={[styles.actionCount, isReposted && styles.activePrimaryCount]}>
            {repostsCount}
          </Text>
        </Pressable>

        {/* Like */}
        <Pressable style={styles.actionBtn} onPress={handleLike}>
          <Heart
            size={18}
            color={isLiked ? COLORS.like : COLORS.textSecondary}
            fill={isLiked ? COLORS.like : 'transparent'}
          />
          <Text style={[styles.actionCount, isLiked && styles.activeLikeCount]}>
            {likesCount}
          </Text>
        </Pressable>

        {/* Bookmark */}
        <Pressable style={styles.actionBtn} onPress={handleBookmark}>
          <Bookmark
            size={18}
            color={isBookmarked ? COLORS.primary : COLORS.textSecondary}
            fill={isBookmarked ? COLORS.primary : 'transparent'}
          />
        </Pressable>

        {/* Share */}
        <Pressable style={styles.actionBtn} onPress={handleShare}>
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
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
    gap: 3,
  },
  cityText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  content: {
    fontSize: FONT_SIZE.md,
    lineHeight: 21,
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
