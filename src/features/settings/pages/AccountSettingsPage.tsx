import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Shield,
  Bell,
  Lock,
  User,
  Globe,
  Palette,
  LogOut,
  Check,
} from 'lucide-react';
import { ROUTES } from '../../../lib/constants';
import { useAuth } from '../../../context/useAuth';
import { authService } from '../../../services/authService';
import { storageService } from '../../../services/storageService';
import { getInitials } from '../../../lib/helpers';
import { useNavigation } from '../../../navigation/NavigationContext';

export default function AccountSettingsPage() {
  const { navigate } = useNavigation();
  const { user, logout, login } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || 'Shahrukh Ahmed');
  const [bioInput, setBioInput] = useState(user?.bio || 'Building a calmer public square for Pakistan.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      await storageService.clear();
      logout();
      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      console.error('Logout error:', error);
      await storageService.clear();
      logout();
      navigate(ROUTES.SIGN_IN);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: nameInput.trim() || user?.name,
      bio: bioInput.trim() || user?.bio,
    };
    login(updated, 'active-token');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setEditingProfile(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-3 bg-white/95 backdrop-blur-xs border-b border-gray-100">
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors"
          title="Back to home"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Account Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* User Info Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-14 h-14 rounded-full bg-emerald-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
            {user?.profile_photo ? (
              <img
                src={user.profile_photo}
                alt={user?.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{getInitials(user?.name || 'Fliq Studio')}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">
              {user?.name || 'Shahrukh Ahmed'}
            </h2>
            <p className="text-xs text-gray-500 truncate">
              {user?.username || '@shahrukh'} · {user?.email || 'shahrukh@fliq.pk'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditingProfile(!editingProfile)}
            className="text-xs px-3 py-1.5 rounded-full font-semibold border border-gray-200 hover:bg-white bg-transparent text-gray-800 transition-colors"
          >
            {editingProfile ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Profile Edit Form */}
        {editingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3"
          >
            <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Edit Public Profile
            </h3>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={2}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                {savedSuccess ? (
                  <>
                    <Check size={14} /> Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}

        {/* Section: Account */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Account & Identity
          </span>
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => setEditingProfile(true)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-100/70 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Edit Profile</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-100/70 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Language</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">English (PK)</span>
            </button>
          </div>
        </div>

        {/* Section: Appearance */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Appearance & Experience
          </span>
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <button
              type="button"
              onClick={() => navigate(ROUTES.SETTINGS_DISPLAY)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-gray-100/70 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Palette size={18} className="text-emerald-600" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Display Theme</div>
                  <div className="text-xs text-gray-400">Light, Dark, and System appearance</div>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Section: Security */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Security
          </span>
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Password</span>
              </div>
              <span className="text-xs text-gray-400">Updated 1 month ago</span>
            </div>
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-800">Two-Factor Authentication</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Section: Preferences */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Preferences
          </span>
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Push Notifications</div>
                  <div className="text-xs text-gray-400">Receive alerts for mentions & replies</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-gray-500" />
                <div>
                  <div className="text-sm font-medium text-gray-800">Private Account</div>
                  <div className="text-xs text-gray-400">Only approved followers can view posts</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={privateAccount}
                onChange={(e) => setPrivateAccount(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-50 hover:bg-red-100/80 text-red-600 font-semibold text-sm transition-colors border border-red-100"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>

        <p className="text-center text-xs text-gray-400">
          Fliq Pakistan Web v1.0.0 · A calmer public square
        </p>
      </div>
    </div>
  );
}
