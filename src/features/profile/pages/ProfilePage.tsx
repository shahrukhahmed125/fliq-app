import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Link as LinkIcon,
  MapPin,
  MoreHorizontal,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { profileHighlights } from '../../../data/fliqData';
import PostCard from '../../feed/components/PostCard';
import { ROUTES } from '../../../lib/constants';
import { useAuth } from '../../../context/useAuth';
import { getInitials } from '../../../lib/helpers';
import { postService } from '../../../services/postService';
import { useNavigation } from '../../../navigation/NavigationContext';

export default function ProfilePage() {
  const { navigate } = useNavigation();
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postService.getPosts({
        user_id: user?.id,
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('PROFILE POSTS ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const tabs = ['Posts', 'Replies', 'Media', 'Likes'];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Topbar */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-2.5 bg-white/95 backdrop-blur-xs border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          title="Back to home"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            {user?.name || 'Fliq Studio'}
          </h1>
          <span className="text-xs text-gray-500 font-normal">
            {posts.length || 42} posts
          </span>
        </div>
      </div>

      {/* Cover Banner */}
      <div className="relative h-44 bg-linear-to-r from-emerald-800 via-teal-700 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md font-medium">
          🇵🇰 Pakistan
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-5 pb-4">
        {/* Avatar and Action Buttons Row */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center shadow-md overflow-hidden">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials(user?.name || 'Fliq Studio')}</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
              title="More options"
            >
              <MoreHorizontal size={18} />
            </button>
            <button
              type="button"
              onClick={() => navigate(ROUTES.SETTINGS_ACCOUNT)}
              className="px-4 py-1.5 rounded-full bg-gray-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Edit profile
            </button>
          </div>
        </div>

        {/* Identity */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h2 className="text-xl font-bold text-gray-900">
              {user?.name || 'Fliq Studio'}
            </h2>
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
          </div>
          <p className="text-sm text-gray-500 mb-3">{user?.username || '@fliq'}</p>

          <p className="text-sm text-gray-800 leading-relaxed mb-3 max-w-xl">
            {user?.bio ||
              'Building a calmer public square for Pakistan. Product notes, community updates, creator tools, and design thinking for the next generation of social media.'}
          </p>

          {/* Metadata chips */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              <span>Pakistan</span>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon size={14} className="text-gray-400" />
              <a href="https://fliq.pk" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">
                fliq.pk
              </a>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays size={14} className="text-gray-400" />
              <span>
                Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'May 2024'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 text-sm">
            {profileHighlights.map(([value, label]) => (
              <div key={label} className="flex items-baseline gap-1">
                <span className="font-bold text-gray-950">{value}</span>
                <span className="text-gray-500 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab, idx) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`flex-1 py-3 text-sm font-semibold text-center transition-all relative ${
              activeTab === idx
                ? 'text-gray-950 font-bold'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/50'
            }`}
          >
            {tab}
            {activeTab === idx && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-emerald-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50/70 border-b border-gray-100">
        <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-2xs">
          <h3 className="text-xs font-bold text-gray-900 mb-1">Creator-first updates</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Early notes on product direction, moderation, and community spaces for creators across Lahore, Karachi, and Islamabad.
          </p>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-gray-100 shadow-2xs">
          <h3 className="text-xs font-bold text-gray-900 mb-1">Pakistan live trends</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Real-time conversations tracking cricket developments, tech startups, civic voices, and cultural moments.
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={24} className="animate-spin text-emerald-600" />
            <span className="text-xs">Loading posts...</span>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id || post.uuid} post={post} />
          ))
        ) : (
          <div className="py-16 text-center text-gray-400 text-sm">
            No posts found under this tab
          </div>
        )}
      </div>
    </div>
  );
}
