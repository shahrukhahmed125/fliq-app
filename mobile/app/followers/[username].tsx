import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, UserCheck, UserPlus } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function FollowersScreen() {
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const { users, toggleFollow } = useApp();
  const [search, setSearch] = useState('');

  const usersList = Object.values(users).filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {/* Search Header */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search followers..."
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={usersList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            style={styles.userItem}
            onPress={() => router.push(`/users/${item.username.replace('@', '')}`)}
          >
            <Avatar uri={item.profile_photo} name={item.name} size={44} isVerified={item.is_verified} />
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userHandle}>{item.username}</Text>
              {item.bio ? (
                <Text style={styles.userBio} numberOfLines={1}>
                  {item.bio}
                </Text>
              ) : null}
            </View>

            <Pressable
              style={[styles.followBtn, item.is_following && styles.followingBtn]}
              onPress={() => toggleFollow(item.username)}
            >
              {item.is_following ? (
                <UserCheck size={14} color={COLORS.textPrimary} />
              ) : (
                <UserPlus size={14} color="#FFFFFF" />
              )}
              <Text style={[styles.followBtnText, item.is_following && styles.followingBtnText]}>
                {item.is_following ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.sm + 1,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  userHandle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  userBio: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  followingBtn: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  followingBtnText: {
    color: COLORS.textPrimary,
  },
});
