import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post, Comment } from '../../src/types';
import { postService } from '../../src/services/api/postService';
import { PostCard } from '../../src/components/posts/PostCard';
import { CommentList } from '../../src/components/posts/CommentList';
import { COLORS, SPACING, FONT_SIZE } from '../../src/constants/theme';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [postData, commentData] = await Promise.all([
          postService.getPostById(id),
          postService.getComments(id),
        ]);
        setPost(postData);
        setComments(commentData);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
    if (post) {
      setPost({ ...post, comments_count: post.comments_count + 1 });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Post not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <PostCard post={post} />

        <View style={styles.commentsWrap}>
          <CommentList
            postId={post.id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  notFoundText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
  },
  commentsWrap: {
    paddingHorizontal: SPACING.lg,
  },
});
