import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Repeat2, UserPlus, Bell } from 'lucide-react-native';
import { NotificationItem } from '../../src/types';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      type: 'like',
      actor: {
        id: 2,
        name: 'Ayesha Khan',
        username: '@ayeshawrites',
        is_verified: true,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      },
      text: 'liked your post: "Fliq is being shaped as a calmer public square for Pakistan..."',
      created_at: new Date(Date.now() - 5 * 60000).toISOString(),
      read: false,
    },
    {
      id: 'n-2',
      type: 'comment',
      actor: {
        id: 101,
        name: 'Ali Raza',
        username: '@aliraza',
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      },
      text: 'replied: "Much needed initiative for the Pakistani tech ecosystem! 🚀"',
      created_at: new Date(Date.now() - 40 * 60000).toISOString(),
      read: false,
    },
    {
      id: 'n-3',
      type: 'repost',
      actor: {
        id: 3,
        name: 'Hassan Ali',
        username: '@hassanbuilds',
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      },
      text: 'reposted your thoughts on founder spaces in Karachi.',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: 'n-4',
      type: 'follow',
      actor: {
        id: 105,
        name: 'Zara Noor',
        username: '@zaracreates',
        is_verified: true,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      },
      text: 'started following you.',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
  ]);

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart size={16} color={COLORS.like} fill={COLORS.like} />;
      case 'comment':
        return <MessageCircle size={16} color={COLORS.primary} />;
      case 'repost':
        return <Repeat2 size={16} color={COLORS.primary} />;
      case 'follow':
      default:
        return <UserPlus size={16} color={COLORS.primaryDark} />;
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Bell size={20} color={COLORS.textPrimary} />
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Pressable onPress={markAllRead}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </Pressable>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationItem, !item.read && styles.unreadItem]}>
            <View style={styles.iconContainer}>{getIcon(item.type)}</View>
            <Avatar name={item.actor.name} size={36} isVerified={item.actor.is_verified} />
            <View style={styles.contentCol}>
              <Text style={styles.actorName}>{item.actor.name}</Text>
              <Text style={styles.notificationText}>{item.text}</Text>
            </View>
          </View>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  markReadText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.primary,
  },
  listContent: {
    paddingBottom: SPACING.xxxl,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  unreadItem: {
    backgroundColor: COLORS.primarySurface,
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
  },
  contentCol: {
    flex: 1,
  },
  actorName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notificationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
});
