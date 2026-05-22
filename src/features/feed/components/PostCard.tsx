import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react-native';
import { formatDate, getMediaUrl } from '../../../lib/helpers';
import { postService } from '../../../services/postService';

function PostCard({ post }: { post: any }) {
  const [isLiked, setIsLiked] = useState(post?.is_liked || false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || post?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post?.comments_count || 0);

  const mediaCount = post?.media?.length || 0;

  const handleLike = async () => {
    if (isLiking) return;
    
    try {
      setIsLiking(true);
      const response = await postService.toggleLike(post.uuid || post.id);
      
      if (response) {
        setIsLiked(response.is_liked !== undefined ? response.is_liked : !isLiked);
        setLikesCount(response.likes_count !== undefined ? response.likes_count : (isLiked ? likesCount - 1 : likesCount + 1));
      }
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {post?.user?.name?.slice(0, 1) || 'U'}
        </Text>
      </View>

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.userName}>{post?.user?.name || 'Unknown User'}</Text>
          <Text style={styles.userMeta}>
            {post?.user?.username || 'user'} · {formatDate(post?.created_at) || 'Unknown Date'}
          </Text>
        </View>

        {/* Content */}
        <Text style={styles.postText}>{post?.content}</Text>

        {/* Media */}
        {post?.media?.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.media.map((m: any) => {
              if (m.status !== 'completed') {
                return (
                  <View key={m.id} style={styles.mediaLoading}>
                    <Text style={styles.mediaLoadingText}>Processing...</Text>
                  </View>
                );
              }

              return m.file_type === 'image' ? (
                <Image
                  key={m.id}
                  source={{ uri: getMediaUrl(m.file_path) }}
                  style={styles.mediaImage}
                  resizeMode="cover"
                />
              ) : null;
              // Video support can be added later with react-native-video
            })}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, showComments && styles.actionButtonActive]}
            onPress={handleCommentClick}
          >
            <MessageCircle size={18} color={showComments ? '#10B981' : '#666'} />
            <Text style={[styles.actionText, showComments && styles.actionTextActive]}>
              {commentsCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Repeat2 size={18} color="#666" />
            <Text style={styles.actionText}>{post?.reposts_count || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            disabled={isLiking}
          >
            <Heart
              size={18}
              color={isLiked ? '#EF4444' : '#666'}
              fill={isLiked ? '#EF4444' : 'none'}
            />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Send size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  userMeta: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  postText: {
    fontSize: 16,
    color: '#111',
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  mediaLoading: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  mediaLoadingText: {
    color: '#666',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonActive: {
    // Style for active state
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
  actionTextActive: {
    color: '#10B981',
  },
});

export default PostCard;
