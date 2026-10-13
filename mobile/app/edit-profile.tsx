import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Check } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';
import { Avatar } from '../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../src/constants/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { currentUser, updateProfile } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(currentUser.profile_photo || null);
  const [coverUri, setCoverUri] = useState<string | null>(currentUser.profile_cover || null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const pickAvatar = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets[0]) {
        setAvatarUri(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Unable to pick avatar image');
    }
  };

  const pickCover = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      if (!res.canceled && res.assets[0]) {
        setCoverUri(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'Unable to pick cover image');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Display name cannot be empty.');
      return;
    }

    const normalizedUsername = username.trim().startsWith('@')
      ? username.trim()
      : `@${username.trim()}`;

    updateProfile({
      name: name.trim(),
      username: normalizedUsername,
      bio: bio.trim(),
      city: city.trim(),
      website: website.trim(),
      profile_photo: avatarUri,
      profile_cover: coverUri,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.back();
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cover Photo Editor */}
        <View style={styles.coverWrap}>
          {coverUri ? (
            <Image source={{ uri: coverUri }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverFallback} />
          )}
          <Pressable style={styles.coverEditBadge} onPress={pickCover}>
            <Camera size={18} color="#FFFFFF" />
            <Text style={styles.coverEditText}>Change Cover</Text>
          </Pressable>
        </View>

        {/* Avatar Editor */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarWrap}>
            <Avatar uri={avatarUri} name={name} size={84} isVerified />
            <Pressable style={styles.avatarCameraBadge} onPress={pickAvatar}>
              <Camera size={14} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="@username"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.bioLabelRow}>
              <Text style={styles.inputLabel}>Bio</Text>
              <Text style={styles.charCounter}>{bio.length}/160</Text>
            </View>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Share what you do or write about..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              maxLength={160}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City & Country</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Lahore, Pakistan"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website</Text>
            <TextInput
              style={styles.input}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://fliq.pk"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            {savedSuccess ? (
              <View style={styles.savedRow}>
                <Check size={18} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Profile Updated!</Text>
              </View>
            ) : (
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
            )}
          </Pressable>
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
  coverWrap: {
    height: 140,
    backgroundColor: COLORS.primaryDark,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primaryDark,
  },
  coverEditBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  coverEditText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  avatarRow: {
    paddingHorizontal: SPACING.lg,
    marginTop: -42,
    marginBottom: SPACING.md,
  },
  avatarWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    elevation: 4,
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  bioLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCounter: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
