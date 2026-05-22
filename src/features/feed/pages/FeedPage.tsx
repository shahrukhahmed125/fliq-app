import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Sparkles, Loader2, ArrowUp } from 'lucide-react-native';
import Composer from '../components/Composer';
import PostCard from '../components/PostCard';
import { postService } from '../../../services/postService';

function FeedPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [showNewPostsPill, setShowNewPostsPill] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastPostIds = useRef(new Set<string>());
  const tabs = ['For You', 'Trending'];

  const handlePostSuccess = (newPost: any) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
      lastPostIds.current.add(newPost.id);
    }
  };

  const fetchPosts = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const newPosts = await postService.getPosts();
      console.log('FEED POSTS FETCHED:', newPosts);
      
      if (isPolling && newPosts.length > 0) {
        const currentPostIds = new Set(newPosts.map((p: any) => p.id));
        const newPostIds = [...currentPostIds].filter(id => !lastPostIds.current.has(id));
        
        if (newPostIds.length > 0) {
          setNewPostsCount(newPostIds.length);
          setShowNewPostsPill(true);
        }
      } else {
        setPosts(newPosts);
        lastPostIds.current = new Set(newPosts.map((p: any) => p.id));
        setNewPostsCount(0);
        setShowNewPostsPill(false);
      }
    } catch (error) {
      console.error('FEED POSTS ERROR:', error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleNewPostsClick = () => {
    setIsRefreshing(true);
    setShowNewPostsPill(false);
    fetchPosts()
      .then(() => {
        // Scroll to top
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchPosts(true);
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, []);

  const renderPost = ({ item }: { item: any }) => (
    <PostCard post={item} />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Sparkles size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListHeaderComponent={<Composer onPostSuccess={handlePostSuccess} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleNewPostsClick}
            colors={['#10B981']}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <Loader2 size={32} color="#10B981" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No posts yet</Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
      />

      {/* New Posts Pill */}
      {showNewPostsPill && (
        <TouchableOpacity
          style={styles.newPostsPill}
          onPress={handleNewPostsClick}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <View style={styles.pillContent}>
              <Loader2 size={16} color="#fff" />
              <Text style={styles.pillText}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.pillContent}>
              <ArrowUp size={16} color="#fff" />
              <Text style={styles.pillText}>
                {newPostsCount} new post{newPostsCount !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
  },
  iconButton: {
    padding: 8,
  },
  tabs: {
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
  listContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  newPostsPill: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#10B981',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FeedPage;
