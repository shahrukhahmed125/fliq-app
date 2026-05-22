import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { ArrowLeft, CalendarDays, Link as LinkIcon, MapPin, MoreHorizontal, ShieldCheck, Loader2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { profileHighlights } from '../../../data/fliqData';
import PostCard from '../../feed/components/PostCard';
import { ROUTES } from '../../../lib/constants';
import { useAuth } from '../../../context/useAuth';
import { getInitials, getRandomCover } from '../../../lib/helpers';
import { postService } from '../../../services/postService';

function ProfilePage() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postService.getPosts({
        user_id: user?.id
      });
      console.log('PROFILE POSTS FETCHED:', fetchedPosts);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('PROFILE POSTS ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user]);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (user?.id) {
        fetchPosts();
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [user]);

  const renderPost = ({ item }: { item: any }) => (
    <PostCard post={item} />
  );

  return (
    <ScrollView style={styles.container}>
      {/* Topbar */}
      <View style={styles.topbar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => (navigation as any).navigate(ROUTES.HOME)}
        >
          <ArrowLeft size={20} color="#111" />
        </TouchableOpacity>
        <View>
          <Text style={styles.topbarTitle}>{user?.name || 'Fliq Studio'}</Text>
          <Text style={styles.topbarSubtitle}>42 posts</Text>
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={{ uri: user?.profile_cover ? user.profile_cover : getRandomCover() }}
          style={styles.coverImage}
        />
        <View style={styles.profileMain}>
          <View style={styles.avatarContainer}>
            {user?.profile_photo ? (
              <Image
                source={{ uri: user.profile_photo }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={[styles.avatarImage, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{getInitials(user?.name || 'Fliq Studio')}</Text>
              </View>
            )}
          </View>
          <View style={styles.profileActions}>
            <TouchableOpacity style={styles.actionButton}>
              <MoreHorizontal size={19} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.profileIdentity}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.name || 'Fliq Studio'}</Text>
              <View style={styles.verifiedBadge}>
                <ShieldCheck size={14} color="#10B981" />
              </View>
            </View>
            <Text style={styles.userHandle}>{user?.username || '@fliq'}</Text>
            <Text style={styles.userBio}>
              {user?.bio || 'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking for the next generation of social media.'}
            </Text>
            <View style={styles.userMeta}>
              <View style={styles.metaItem}>
                <MapPin size={15} color="#666" />
                <Text style={styles.metaText}>Pakistan</Text>
              </View>
              <View style={styles.metaItem}>
                <LinkIcon size={15} color="#666" />
                <Text style={styles.metaText}>fliq.pk</Text>
              </View>
              <View style={styles.metaItem}>
                <CalendarDays size={15} color="#666" />
                <Text style={styles.metaText}>
                  Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2026'}
                </Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              {profileHighlights.map(([value, label]) => (
                <View key={label} style={styles.stat}>
                  <Text style={styles.statValue}>{value}</Text>
                  <Text style={styles.statLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsBar}>
        {['Posts', 'Replies', 'Media', 'Likes'].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, index === 0 && styles.tabActive]}
          >
            <Text style={[styles.tabText, index === 0 && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Insights */}
      <View style={styles.insightGrid}>
        <View style={styles.insight}>
          <Text style={styles.insightTitle}>Creator-first updates</Text>
          <Text style={styles.insightDescription}>Early notes on product direction, moderation, and community spaces.</Text>
        </View>
        <View style={styles.insight}>
          <Text style={styles.insightTitle}>Pakistan live trends</Text>
          <Text style={styles.insightDescription}>Tracking conversations around cricket, cities, creators, and tech.</Text>
        </View>
      </View>

      {/* Posts */}
      <View style={styles.postsSection}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Loader2 size={32} color="#10B981" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  topbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  topbarSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  hero: {
    marginBottom: 12,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  profileMain: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarFallback: {
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  editButton: {
    backgroundColor: '#111',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileIdentity: {
    marginBottom: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
    marginRight: 8,
  },
  verifiedBadge: {
    padding: 4,
  },
  userHandle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  userMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  tabsBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#111',
  },
  insightGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  insight: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  postsSection: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ProfilePage;
