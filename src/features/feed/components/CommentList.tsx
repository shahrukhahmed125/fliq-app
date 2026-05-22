import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { formatDate } from '../../../lib/helpers';
import { postService } from '../../../services/postService';

function CommentItem({ comment, onReply }: { comment: any; onReply: (comment: any) => void }) {
  return (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {comment?.user?.name?.slice(0, 1) || 'U'}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{comment?.user?.name || 'Unknown'}</Text>
          <Text style={styles.commentDate}>{formatDate(comment?.created_at)}</Text>
        </View>
        <Text style={styles.commentText}>{comment?.content}</Text>
        <TouchableOpacity onPress={() => onReply(comment)}>
          <Text style={styles.replyButton}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CommentList({
  postUuid,
  isOpen,
  onCommentCountChange,
  onReply,
}: {
  postUuid: string;
  isOpen: boolean;
  onCommentCountChange: (count: number) => void;
  onReply: (comment: any) => void;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await postService.getComments(postUuid);
      setComments(Array.isArray(data) ? data : []);
      onCommentCountChange(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postUuid]);

  if (!isOpen) return null;

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading comments...</Text>
      ) : comments.length === 0 ? (
        <Text style={styles.emptyText}>No comments yet</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <CommentItem comment={item} onReply={onReply} />
          )}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  list: {
    maxHeight: 300,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  commentAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginRight: 8,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  replyButton: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default CommentList;
