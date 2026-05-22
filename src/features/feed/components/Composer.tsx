import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Image as ImageIcon, Video, Hash, X, Check, Loader2 } from 'lucide-react-native';
import { useAuth } from '../../../context/useAuth';
import { getInitials } from '../../../lib/helpers';
import { postService } from '../../../services/postService';

function Composer({ compact = false, onPostSuccess }: { compact?: boolean; onPostSuccess?: (post: any) => void }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const { user } = useAuth();

  const handlePost = async () => {
    if (!text.trim() && images.length === 0 && videos.length === 0) return;

    try {
      setIsLoading(true);
      setShowUploadProgress(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('content', text);
      images.forEach((image) => {
        formData.append('media[]', image);
      });
      videos.forEach((video) => {
        formData.append('media[]', video);
      });
      topics.forEach((topic) => {
        formData.append('topics[]', topic);
      });

      const response = await postService.createPost(formData, (progress) => {
        setUploadProgress(progress);
      });
      console.log('POST RESPONSE:', response);

      setShowSuccess(true);
      setShowUploadProgress(false);
      
      setTimeout(() => {
        setText('');
        setImages([]);
        setVideos([]);
        setTopics([]);
        setTopicInput('');
        setShowSuccess(false);
        setUploadProgress(0);
        
        if (onPostSuccess) {
          onPostSuccess(response.data);
        }
      }, 200);

    } catch (error) {
      console.log('POST ERROR:', error);
      setShowUploadProgress(false);
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTopicAdd = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics((prev) => [...prev, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
  };

  // Note: Image/video picker would need react-native-image-picker or similar library
  // For now, these are placeholder functions
  const handleImagePick = () => {
    Alert.alert('Image Picker', 'Image picker would be implemented with react-native-image-picker');
  };

  const handleVideoPick = () => {
    Alert.alert('Video Picker', 'Video picker would be implemented with react-native-image-picker');
  };

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {/* Avatar */}
      <View style={styles.avatar}>
        {user?.profile_photo ? (
          <Image
            source={{ uri: user.profile_photo }}
            style={styles.avatarImage}
          />
        ) : (
          <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
        )}
      </View>

      <View style={styles.body}>
        {/* Upload Progress */}
        {showUploadProgress && (
          <View style={styles.uploadProgress}>
            <View style={styles.uploadProgressInfo}>
              <Text style={styles.uploadProgressText}>Uploading...</Text>
              <Text style={styles.uploadProgressText}>{uploadProgress}%</Text>
            </View>
            <View style={styles.uploadProgressTrack}>
              <View 
                style={[styles.uploadProgressFill, { width: `${uploadProgress}%` }]}
              />
            </View>
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="What's in your mind today?"
          placeholderTextColor="#999"
          multiline
          numberOfLines={compact ? 2 : 3}
          value={text}
          onChangeText={setText}
          editable={!isLoading && !showSuccess}
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <ScrollView horizontal style={styles.mediaPreview}>
            {images.map((image, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                  disabled={isLoading || showSuccess}
                >
                  <X size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Topics */}
        {topics.length > 0 && (
          <View style={styles.topicsContainer}>
            {topics.map((topic) => (
              <View key={topic} style={styles.topicTag}>
                <Text style={styles.topicText}>#{topic}</Text>
                <TouchableOpacity
                  onPress={() => removeTopic(topic)}
                  disabled={isLoading || showSuccess}
                >
                  <X size={12} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Topic Input */}
        {showTopicInput && (
          <View style={styles.topicInputContainer}>
            <TextInput
              style={styles.topicInput}
              placeholder="Add a topic..."
              placeholderTextColor="#999"
              value={topicInput}
              onChangeText={setTopicInput}
              onSubmitEditing={handleTopicAdd}
            />
            <TouchableOpacity onPress={() => setShowTopicInput(false)}>
              <X size={16} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.tools}>
            <TouchableOpacity
              onPress={handleImagePick}
              disabled={isLoading || showSuccess}
              style={styles.toolButton}
            >
              <ImageIcon size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleVideoPick}
              disabled={isLoading || showSuccess}
              style={styles.toolButton}
            >
              <Video size={18} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTopicInput(!showTopicInput)}
              disabled={isLoading || showSuccess}
              style={styles.toolButton}
            >
              <Hash size={18} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.postButton, showSuccess && styles.postButtonSuccess]}
            onPress={handlePost}
            disabled={isLoading || showSuccess}
          >
            {showSuccess ? (
              <View style={styles.buttonContent}>
                <Check size={16} color="#fff" />
                <Text style={styles.buttonText}>Posted!</Text>
              </View>
            ) : isLoading ? (
              <View style={styles.buttonContent}>
                <Loader2 size={16} color="#fff" />
                <Text style={styles.buttonText}>Posting...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Post</Text>
            )}
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
  compact: {
    padding: 12,
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
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    flex: 1,
  },
  uploadProgress: {
    marginBottom: 12,
  },
  uploadProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  uploadProgressText: {
    fontSize: 12,
    color: '#666',
  },
  uploadProgressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#111',
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  mediaPreview: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mediaItem: {
    marginRight: 8,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  topicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  topicText: {
    color: '#10B981',
    fontSize: 14,
    marginRight: 4,
  },
  topicInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  topicInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tools: {
    flexDirection: 'row',
    gap: 16,
  },
  toolButton: {
    padding: 8,
  },
  postButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 5,
  },
  postButtonSuccess: {
    backgroundColor: '#059669',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Composer;
