import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, Users, X } from 'lucide-react-native';
import { INITIAL_TRENDS, MOCK_USERS } from '../../src/data/fliqData';
import { Avatar } from '../../src/components/ui/Avatar';
import { COLORS, SPACING, RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [followedState, setFollowedState] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string) => {
    setFollowedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['All', 'Cricket', 'Tech', 'Culture', 'Lahore', 'Karachi'];
  const [selectedCat, setSelectedCat] = useState('All');

  const filteredTrends = INITIAL_TRENDS.filter((t) =>
    t.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const featuredCreators = Object.values(MOCK_USERS);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Fliq Pakistan..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color={COLORS.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Category Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          <View style={styles.chipsRow}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[styles.chip, selectedCat === cat && styles.chipActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Live Pakistan Trends */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <TrendingUp size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Trends in Pakistan</Text>
          </View>

          <View style={styles.cardGroup}>
            {filteredTrends.map((trend) => (
              <Pressable key={trend.id} style={styles.trendRow}>
                <View>
                  <Text style={styles.trendCategory}>{trend.category}</Text>
                  <Text style={styles.trendTopic}>#{trend.topic}</Text>
                  <Text style={styles.trendCount}>{trend.postsCount}</Text>
                </View>
                <View style={styles.viewBadge}>
                  <Text style={styles.viewBadgeText}>Explore</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured Pakistani Creators */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Users size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Featured Creators</Text>
          </View>

          <View style={styles.cardGroup}>
            {featuredCreators.map((creator) => {
              const isFollowing = !!followedState[creator.id];
              return (
                <View key={creator.id} style={styles.creatorRow}>
                  <Avatar name={creator.name} size={42} isVerified />
                  <View style={styles.creatorMeta}>
                    <Text style={styles.creatorName}>{creator.name}</Text>
                    <Text style={styles.creatorUsername}>{creator.username}</Text>
                    <Text style={styles.creatorBio} numberOfLines={2}>
                      {creator.bio}
                    </Text>
                  </View>
                  <Pressable
                    style={[styles.followBtn, isFollowing && styles.followBtnActive]}
                    onPress={() => toggleFollow(String(creator.id))}
                  >
                    <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
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
  header: {
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
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
  },
  content: {
    paddingBottom: SPACING.xxxl,
  },
  chipsScroll: {
    marginVertical: SPACING.md,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.md + 2,
    paddingVertical: SPACING.xs + 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm + 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    overflow: 'hidden',
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  trendCategory: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  trendTopic: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  trendCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  viewBadge: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  viewBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: SPACING.md,
  },
  creatorMeta: {
    flex: 1,
  },
  creatorName: {
    fontSize: FONT_SIZE.sm + 1,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  creatorUsername: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  creatorBio: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  followBtnActive: {
    backgroundColor: COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  followBtnText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  followBtnTextActive: {
    color: COLORS.textPrimary,
  },
});
