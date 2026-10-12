import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, Palette, LogOut, Check } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || 'Shahrukh Ahmed');
  const [bio, setBio] = useState(user?.bio || 'Building a calmer public square for Pakistan.');
  const [city, setCity] = useState(user?.city || 'Pakistan');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = () => {
    updateUser({ name, bio, city });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogout = async () => {
    Alert.alert('Log out', 'Are you sure you want to log out of Fliq?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <Avatar uri={user?.profile_photo} name={name} size={54} isVerified />
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userHandle}>{user?.username || '@shahrukh'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'shahrukh@fliq.pk'}</Text>
          </View>
        </View>

        {/* Profile Details Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Edit Profile Information</Text>
          <View style={styles.cardGroup}>
            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Share a short bio..."
                placeholderTextColor={COLORS.textMuted}
                multiline
              />
            </View>

            <View style={styles.inputItem}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.textInput}
                value={city}
                onChangeText={setCity}
                placeholder="City (e.g. Lahore, Karachi)"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <Pressable style={styles.saveBtn} onPress={handleSaveProfile}>
              {savedSuccess ? (
                <View style={styles.savedRow}>
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.saveBtnText}>Changes Saved</Text>
                </View>
              ) : (
                <Text style={styles.saveBtnText}>Save Profile</Text>
              )}
            </Pressable>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.cardGroup}>
            <View style={styles.switchRow}>
              <View style={styles.switchMeta}>
                <Bell size={18} color={COLORS.textSecondary} />
                <View>
                  <Text style={styles.switchLabel}>Push Notifications</Text>
                  <Text style={styles.switchSub}>Alerts for likes and replies</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchMeta}>
                <Shield size={18} color={COLORS.textSecondary} />
                <View>
                  <Text style={styles.switchLabel}>Private Account</Text>
                  <Text style={styles.switchSub}>Only approved followers see posts</Text>
                </View>
              </View>
              <Switch
                value={privateAccount}
                onValueChange={setPrivateAccount}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <Pressable
              style={styles.navRow}
              onPress={() => router.push('/settings/display')}
            >
              <View style={styles.switchMeta}>
                <Palette size={18} color={COLORS.primary} />
                <View>
                  <Text style={styles.switchLabel}>Display & Appearance</Text>
                  <Text style={styles.switchSub}>Light, Dark, and System modes</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color={COLORS.like} />
          <Text style={styles.logoutBtnText}>Log Out of Fliq</Text>
        </Pressable>

        <Text style={styles.versionText}>Fliq Mobile v1.0.0 (Native Expo)</Text>
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userHandle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  userEmail: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    paddingHorizontal: 4,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  inputItem: {
    gap: 4,
  },
  inputLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  bioInput: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  navRow: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginTop: 4,
  },
  switchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  switchLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  switchSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.likeSurface,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: SPACING.md,
  },
  logoutBtnText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.like,
  },
  versionText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xxl,
  },
});
