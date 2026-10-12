import React, { useState } from 'react';
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  Bookmark,
  Settings,
  User,
  LogOut,
  TrendingUp,
  Users,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { ROUTES } from '../lib/constants';
import { trends, creators } from '../data/fliqData';
import { getInitials } from '../lib/helpers';
import { useNavigation } from './NavigationContext';

import SignInPage from '../features/auth/pages/SignInPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import FeedPage from '../features/feed/pages/FeedPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import AccountSettingsPage from '../features/settings/pages/AccountSettingsPage';
import DisplaySettingsPage from '../features/settings/pages/DisplaySettingsPage';

export default function AppNavigator() {
  const { currentRoute, navigate } = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // If in Auth flows
  if (currentRoute === ROUTES.SIGN_IN) {
    return <SignInPage />;
  }
  if (currentRoute === ROUTES.SIGN_UP) {
    return <SignUpPage />;
  }
  if (currentRoute === ROUTES.FORGOT_PASSWORD) {
    return <ForgotPasswordPage />;
  }

  const navItems = [
    { icon: Home, label: 'Home', route: ROUTES.HOME },
    { icon: Compass, label: 'Explore', route: ROUTES.HOME },
    { icon: Bell, label: 'Notifications', route: ROUTES.HOME },
    { icon: MessageSquare, label: 'Messages', route: ROUTES.HOME },
    { icon: Bookmark, label: 'Bookmarks', route: ROUTES.HOME },
    { icon: User, label: 'Profile', route: ROUTES.PROFILE },
    { icon: Settings, label: 'Settings', route: ROUTES.SETTINGS_ACCOUNT },
  ];

  const toggleFollow = (creatorHandle: string) => {
    setFollowedCreators((prev) => ({
      ...prev,
      [creatorHandle]: !prev[creatorHandle],
    }));
  };

  const renderActiveScreen = () => {
    switch (currentRoute) {
      case ROUTES.PROFILE:
        return <ProfilePage />;
      case ROUTES.SETTINGS_ACCOUNT:
        return <AccountSettingsPage />;
      case ROUTES.SETTINGS_DISPLAY:
        return <DisplaySettingsPage />;
      case ROUTES.HOME:
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <aside className="hidden sm:flex flex-col justify-between w-20 xl:w-64 h-screen sticky top-0 px-3 py-4 border-r border-gray-200/80 bg-white z-10 shrink-0">
          <div>
            {/* Logo */}
            <div
              onClick={() => navigate(ROUTES.HOME)}
              className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-2xl hover:bg-gray-100 transition-colors mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-600/20">
                F
              </div>
              <span className="hidden xl:inline text-2xl font-black tracking-tight text-gray-950">
                Fliq
              </span>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all text-left ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-950'
                    }`}
                  >
                    <Icon
                      size={22}
                      className={isActive ? 'text-emerald-600' : 'text-gray-500'}
                    />
                    <span className="hidden xl:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User mini profile & Logout */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-gray-100 transition-colors">
              <button
                type="button"
                onClick={() => navigate(ROUTES.PROFILE)}
                className="flex items-center gap-3 min-w-0 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {getInitials(user?.name || 'Fliq User')}
                </div>
                <div className="hidden xl:block min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {user?.name || 'Fliq User'}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {user?.username || '@fliq'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate(ROUTES.SIGN_IN);
                }}
                className="hidden xl:flex p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Center Main Area */}
        <main className="flex-1 min-w-0 max-w-2xl min-h-screen border-r border-gray-200/80 bg-white">
          {renderActiveScreen()}
        </main>

        {/* Right Rail (Desktop Only) */}
        <aside className="hidden lg:block w-80 xl:w-96 p-4 sticky top-0 h-screen overflow-y-auto space-y-4 shrink-0">
          {/* Search bar */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Fliq Pakistan..."
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-full bg-gray-100 focus:bg-white border border-transparent focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-gray-900 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Pakistan Trends widget */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} className="text-emerald-600" />
                Trends for Pakistan
              </h3>
            </div>
            <div className="space-y-3">
              {trends.map(([topic, postCount]) => (
                <div
                  key={topic}
                  onClick={() => navigate(ROUTES.HOME)}
                  className="group cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      #{topic}
                    </p>
                    <p className="text-[11px] text-gray-400">{postCount}</p>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Creators to Follow */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-emerald-600" />
                Featured Creators
              </h3>
            </div>
            <div className="space-y-3">
              {creators.map(([name, handle, category]) => {
                const isFollowed = followedCreators[handle];
                return (
                  <div key={handle} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{name}</p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {handle} · {category}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollow(handle)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold transition-all shrink-0 ${
                        isFollowed
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isFollowed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mission Note */}
          <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
            <span className="font-bold">Fliq Pakistan:</span> Built as a calmer, creator-first social experience designed for thoughtful dialogue and real community connections.
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 flex items-center justify-around py-2.5 px-2">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.route)}
              className={`p-2 rounded-xl flex flex-col items-center gap-0.5 ${
                isActive ? 'text-emerald-600 font-bold' : 'text-gray-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => navigate(ROUTES.PROFILE)}
          className={`p-2 rounded-xl flex flex-col items-center gap-0.5 ${
            currentRoute === ROUTES.PROFILE ? 'text-emerald-600 font-bold' : 'text-gray-500'
          }`}
        >
          <User size={20} />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
