import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Comment, NotificationItem, TrendTopic } from '../types';
import {
  CURRENT_USER,
  MOCK_USERS,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TRENDS,
} from '../data/fliqData';
import { secureStorage } from '../services/storage/secureStorage';

interface AppContextType {
  currentUser: User;
  users: Record<string, User>;
  posts: Post[];
  comments: Record<string, Comment[]>;
  notifications: NotificationItem[];
  trends: TrendTopic[];
  savedPosts: Post[];
  unreadCount: number;
  toggleLike: (postId: string) => void;
  toggleRepost: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  createPost: (data: {
    content: string;
    city?: string;
    topics?: string[];
    media?: Array<{ file_path: string; file_type: 'image' | 'video' }>;
  }) => Post;
  addComment: (postId: string, content: string, parentId?: string | null) => Comment;
  toggleFollow: (username: string) => void;
  updateProfile: (updated: Partial<User>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  getPostById: (id: string) => Post | undefined;
  getUserByUsername: (username: string) => User | undefined;
  searchPostsAndUsers: (query: string) => { posts: Post[]; users: User[]; topics: TrendTopic[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<Record<string, User>>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [comments, setComments] = useState<Record<string, Comment[]>>(INITIAL_COMMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [trends] = useState<TrendTopic[]>(INITIAL_TRENDS);

  // Restore stored profile edits on startup
  useEffect(() => {
    const restoreStorage = async () => {
      try {
        const storedUser = await secureStorage.getItem('auth_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setCurrentUser((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // Fallback
      }
    };
    restoreStorage();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextLiked = !post.is_liked;
          const nextCount = nextLiked ? post.likes_count + 1 : Math.max(0, post.likes_count - 1);
          return {
            ...post,
            is_liked: nextLiked,
            likes_count: nextCount,
          };
        }
        return post;
      })
    );
  };

  const toggleRepost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextReposted = !post.is_reposted;
          const nextCount = nextReposted
            ? post.reposts_count + 1
            : Math.max(0, post.reposts_count - 1);
          return {
            ...post,
            is_reposted: nextReposted,
            reposts_count: nextCount,
          };
        }
        return post;
      })
    );
  };

  const toggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const nextBookmarked = !post.is_bookmarked;
          const nextCount = nextBookmarked
            ? post.bookmarks_count + 1
            : Math.max(0, post.bookmarks_count - 1);
          return {
            ...post,
            is_bookmarked: nextBookmarked,
            bookmarks_count: nextCount,
          };
        }
        return post;
      })
    );
  };

  const createPost = (data: {
    content: string;
    city?: string;
    topics?: string[];
    media?: Array<{ file_path: string; file_type: 'image' | 'video' }>;
  }): Post => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      uuid: `post-${Date.now()}`,
      content: data.content,
      city: data.city || 'Pakistan',
      topics: data.topics || ['Pakistan'],
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      bookmarks_count: 0,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: false,
      media: (data.media || []).map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        file_path: m.file_path,
        file_type: m.file_type,
        status: 'completed',
      })),
      user: currentUser,
      created_at: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setCurrentUser((prev) => ({ ...prev, posts_count: prev.posts_count + 1 }));
    return newPost;
  };

  const addComment = (postId: string, content: string, parentId?: string | null): Comment => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      post_id: postId,
      parent_id: parentId || null,
      content,
      user: currentUser,
      created_at: new Date().toISOString(),
      likes_count: 0,
      is_liked: false,
    };

    setComments((prev) => {
      const existing = prev[postId] || [];
      return {
        ...prev,
        [postId]: [...existing, newComment],
      };
    });

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments_count: post.comments_count + 1 } : post
      )
    );

    return newComment;
  };

  const toggleFollow = (username: string) => {
    setUsers((prev) => {
      const target = prev[username];
      if (!target) return prev;
      const nextFollow = !target.is_following;
      const nextFollowers = nextFollow
        ? target.followers_count + 1
        : Math.max(0, target.followers_count - 1);

      return {
        ...prev,
        [username]: {
          ...target,
          is_following: nextFollow,
          followers_count: nextFollowers,
        },
      };
    });

    setCurrentUser((prev) => {
      const target = users[username];
      const currentlyFollowing = target?.is_following ?? false;
      const nextFollowingCount = currentlyFollowing
        ? Math.max(0, prev.following_count - 1)
        : prev.following_count + 1;
      return {
        ...prev,
        following_count: nextFollowingCount,
      };
    });
  };

  const updateProfile = (updated: Partial<User>) => {
    setCurrentUser((prev) => {
      const next = { ...prev, ...updated };
      secureStorage.setItem('auth_user', JSON.stringify(next));
      return next;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getPostById = (id: string) => {
    return posts.find((p) => p.id === id || p.uuid === id);
  };

  const getUserByUsername = (username: string) => {
    const normalized = username.startsWith('@') ? username : `@${username}`;
    if (currentUser.username === normalized) return currentUser;
    return users[normalized];
  };

  const searchPostsAndUsers = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { posts: [], users: [], topics: [] };
    }

    const matchedPosts = posts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        p.topics?.some((t) => t.toLowerCase().includes(q)) ||
        p.user.name.toLowerCase().includes(q) ||
        p.user.username.toLowerCase().includes(q)
    );

    const matchedUsers = Object.values(users).filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.bio?.toLowerCase().includes(q)
    );

    const matchedTopics = trends.filter(
      (t) => t.topic.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );

    return { posts: matchedPosts, users: matchedUsers, topics: matchedTopics };
  };

  const savedPosts = posts.filter((p) => p.is_bookmarked);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        posts,
        comments,
        notifications,
        trends,
        savedPosts,
        unreadCount,
        toggleLike,
        toggleRepost,
        toggleBookmark,
        createPost,
        addComment,
        toggleFollow,
        updateProfile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getPostById,
        getUserByUsername,
        searchPostsAndUsers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
