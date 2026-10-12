import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Send, X, CornerDownRight } from 'lucide-react-native';
import { Comment } from '../../types';
import { Avatar } from '../ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../constants/theme';
import { postService } from '../../services/api/postService';

interface CommentListProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: (comment: Comment) => void;
}

export const CommentList: React.FC<CommentListProps> = ({ postId, comments, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newComment = await postService.createComment(postId, text.trim(), replyTo?.id);
      setText('');
      setReplyTo(null);
      onCommentAdded(newComment);
    } catch {
      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Discussion ({comments.length})</Text>

      {/* Existing Comments */}
      {comments.length === 0 ? (
        <Text style={styles.emptyText}>No replies yet. Start the conversation!</Text>
      ) : (
        comments.map((comment) => (
          <View key={comment.id} style={styles.commentItem}>
            <Avatar uri={comment.user.profile_photo} name={comment.user.name} size={32} />
            <View style={styles.commentBody}>
              <View style={styles.commentMeta}>
                <Text style={styles.commentAuthor}>{comment.user.name}</Text>
                <Text style={styles.commentUsername}>{comment.user.username}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>

              <Pressable
                style={styles.replyBtn}
                onPress={() => setReplyTo(comment)}
              >
                <CornerDownRight size={12} color={COLORS.primary} />
                <Text style={styles.replyBtnText}>Reply</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      {/* Reply-to Bar */}
      {replyTo && (
        <View style={styles.replyBar}>
          <Text style={styles.replyBarText}>
            Replying to <Text style={styles.replyBarTarget}>{replyTo.user.name}</Text>
          </Text>
          <Pressable onPress={() => setReplyTo(null)} hitSlop={8}>
            <X size={14} color={COLORS.textSecondary} />
          </Pressable>
        </View>
      )}

      {/* Input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={replyTo ? 'Write a reply...' : 'Add a calm comment...'}
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={setText}
          multiline
        />
        <Pressable
          style={[styles.sendBtn, (!text.trim() || isSubmitting) && styles.sendBtnDisabled]}
          onPress={handleSubmit}
          disabled={!text.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Send size={16} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  commentBody: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.sm + 2,
    borderRadius: RADIUS.md,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  commentUsername: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  commentContent: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  replyBtnText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
  },
  replyBarText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  replyBarTarget: {
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
    maxHeight: 90,
  },
  sendBtn: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
