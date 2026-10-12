import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Loader2, ArrowUp, RefreshCw } from 'lucide-react';
import Composer from '../components/Composer';
import PostCard from '../components/PostCard';
import { postService } from '../../../services/postService';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const [showNewPostsPill, setShowNewPostsPill] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastPostIds = useRef<Set<string>>(new Set());
  const tabs = ['For You', 'Trending'];
  const feedTopRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);
      const newPosts = await postService.getPosts();

      if (isPolling && newPosts.length > 0) {
        const currentPostIds = new Set<string>(newPosts.map((p: any) => String(p.id || p.uuid)));
        const newPostIds = [...currentPostIds].filter((id) => !lastPostIds.current.has(id));

        if (newPostIds.length > 0) {
          setNewPostsCount(newPostIds.length);
          setShowNewPostsPill(true);
        }
      } else {
        setPosts(newPosts);
        lastPostIds.current = new Set(newPosts.map((p: any) => String(p.id || p.uuid)));
        setNewPostsCount(0);
        setShowNewPostsPill(false);
      }
    } catch (error) {
      console.error('FEED POSTS ERROR:', error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handlePostSuccess = (newPost: any) => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
      lastPostIds.current.add(newPost.id || newPost.uuid);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setShowNewPostsPill(false);
    await fetchPosts(false);
    setIsRefreshing(false);
    feedTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Polling simulation every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchPosts(true);
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  // Filter posts based on active tab
  const displayedPosts = activeTab === 1
    ? [...posts].sort((a, b) => (b.likes_count || b.likes || 0) - (a.likes_count || a.likes || 0))
    : posts;

  return (
    <div className="min-h-screen bg-white pb-16 relative">
      <div ref={feedTopRef} />

      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Home</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className={`p-2 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all ${
                isRefreshing ? 'animate-spin text-emerald-600' : ''
              }`}
              title="Refresh feed"
            >
              <RefreshCw size={17} />
            </button>
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              title="Highlights"
            >
              <Sparkles size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-3 text-sm font-semibold text-center transition-all relative ${
                activeTab === index
                  ? 'text-gray-950 font-bold'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'
              }`}
            >
              {tab}
              {activeTab === index && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <Composer onPostSuccess={handlePostSuccess} />

      {/* New Posts Floating Pill */}
      {showNewPostsPill && (
        <div className="sticky top-28 z-30 flex justify-center py-2 pointer-events-none">
          <button
            type="button"
            onClick={handleRefresh}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all animate-bounce"
          >
            <ArrowUp size={14} />
            <span>
              {newPostsCount} new {newPostsCount === 1 ? 'post' : 'posts'}
            </span>
          </button>
        </div>
      )}

      {/* Posts List */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
            <Loader2 size={28} className="animate-spin text-emerald-600" />
            <span className="text-sm">Loading posts...</span>
          </div>
        ) : displayedPosts.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-base font-medium text-gray-600">No posts in feed yet</p>
            <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          displayedPosts.map((post) => (
            <PostCard key={post.id || post.uuid} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
