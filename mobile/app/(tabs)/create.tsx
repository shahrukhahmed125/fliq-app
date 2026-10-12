import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image as ImageIcon, X, MapPin, Hash, Sparkles } from 'lucide-react-native';
import { Avatar } from '../../src/components/ui/Avatar';
import { useAuth } from '../../src/context/AuthContext';
import { postService } from '../../src/services/api/postService';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function CreatePostScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Pakistan']);
  const [city, setCity] = useState('Lahore');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const availableCities = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta'];
  const suggestedTopics = ['Cricket', 'Tech', 'Culture', 'Startups', 'Design'];

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission required',
          'Fliq requires media library access to attach photos to your posts.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        const uris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...uris]);
      }
    } catch {
      Alert.alert('Error', 'Unable to open media picker');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics((prev) => prev.filter((t) => t !== topic));
    } else {
      setSelectedTopics((prev) => [...prev, topic]);
    }
  };

  const handlePublish = async () => {
    if (!content.trim() && selectedImages.length === 0) {
      Alert.alert('Empty post', 'Please enter some text or select an image.');
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(40);

      await postService.createPost({
        content: content.trim(),
        city,
        topics: selectedTopics,
        media: selectedImages.map((uri) => ({
          file_path: uri,
          file_type: 'image',
        })),
      });

      setUploadProgress(100);
      setContent('');
      setSelectedImages([]);

      // Route back to home feed
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Publish Error', 'Unable to publish post. Please retry.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>

        <Text style={styles.headerTitle}>New Thought</Text>

        <Pressable
          style={[
            styles.publishBtn,
            (!content.trim() && selectedImages.length === 0) && styles.publishBtnDisabled,
          ]}
          onPress={handlePublish}
          disabled={isSubmitting || (!content.trim() && selectedImages.length === 0)}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.publishBtnText}>Publish</Text>
          )}
        </Pressable>
      </View>

      {/* Upload progress indicator */}
      {isSubmitting && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User identification */}
        <View style={styles.userRow}>
          <Avatar
            uri={user?.profile_photo}
            name={user?.name || 'Shahrukh Ahmed'}
            size={40}
            isVerified
          />
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{user?.name || 'Shahrukh Ahmed'}</Text>
            {/* City selector pill */}
            <View style={styles.citySelectorRow}>
              <MapPin size={11} color={COLORS.primary} />
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.citiesChipRow}>
                  {availableCities.map((c) => (
                    <Pressable
                      key={c}
                      style={[styles.cityChip, city === c && styles.cityChipActive]}
                      onPress={() => setCity(c)}
                    >
                      <Text style={[styles.cityChipText, city === c && styles.cityChipTextActive]}>
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="What's happening? Share a thought for Pakistan..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          autoFocus
          value={content}
          onChangeText={setContent}
        />

        {/* Selected Media Previews */}
        {selectedImages.length > 0 && (
          <ScrollView horizontal style={styles.mediaScroll} showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri, idx) => (
              <View key={idx} style={styles.previewImageTile}>
                <Image source={{ uri }} style={styles.previewImage} />
                <Pressable
                  style={styles.removeTileBtn}
                  onPress={() => removeImage(idx)}
                >
                  <X size={14} color="#FFFFFF" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Suggested Topic Tags */}
        <View style={styles.topicsSection}>
          <Text style={styles.topicsHeader}>Topics & Communities</Text>
          <View style={styles.topicsWrap}>
            {suggestedTopics.map((topic) => {
              const active = selectedTopics.includes(topic);
              return (
                <Pressable
                  key={topic}
                  style={[styles.topicChip, active && styles.topicChipActive]}
                  onPress={() => toggleTopic(topic)}
                >
                  <Hash size={12} color={active ? '#FFFFFF' : COLORS.primary} />
                  <Text style={[styles.topicChipText, active && styles.topicChipTextActive]}>
                    {topic}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Media Bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.mediaActionBtn} onPress={pickImage}>
          <ImageIcon size={22} color={COLORS.primary} />
          <Text style={styles.mediaActionText}>Add Photos</Text>
        </Pressable>
        <Text style={styles.counterText}>{content.length} chars</Text>
      </View>
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
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: SPACING.xs,
  },
  cancelText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  publishBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    minWidth: 70,
    alignItems: 'center',
  },
  publishBtnDisabled: {
    opacity: 0.45,
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  progressContainer: {
    height: 3,
    backgroundColor: COLORS.primarySurface,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.sm + 1,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  citySelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  citiesChipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  cityChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSubtle,
  },
  cityChipActive: {
    backgroundColor: COLORS.primarySurface,
  },
  cityChipText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  cityChipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  textInput: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textPrimary,
    lineHeight: 26,
    minHeight: 130,
    textAlignVertical: 'top',
  },
  mediaScroll: {
    marginVertical: SPACING.md,
  },
  previewImageTile: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginRight: SPACING.sm,
    position: 'relative',
    backgroundColor: COLORS.surfaceSubtle,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeTileBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: RADIUS.full,
    padding: 3,
  },
  topicsSection: {
    marginTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.md,
  },
  topicsHeader: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  topicsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  topicChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  topicChipText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  topicChipTextActive: {
    color: '#FFFFFF',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  mediaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  mediaActionText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  counterText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
});
