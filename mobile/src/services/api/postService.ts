import { apiClient } from './client';
import { Post, Comment } from '../../types';
import { INITIAL_POSTS } from '../../data/fliqData';

// Local working copy of posts for state mutations
let activePosts: Post[] = [...INITIAL_POSTS];
const localComments: Record<string, Comment[]> = {
  'post-1': [
    {
      id: 'c-1',
      post_id: 'post-1',
      content: 'Much needed initiative for the Pakistani tech ecosystem! 🚀',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: {
        id: 101,
        name: 'Ali Raza',
        username: '@aliraza',
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      },
    },
    {
      id: 'c-2',
      post_id: 'post-1',
      content: 'Love the calmer feed concept. No outrage, just thoughtful product notes.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      user: {
        id: 102,
        name: 'Sara Qureshi',
        username: '@saraq',
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
      },
    },
  ],
};

export const postService = {
  getPosts: async (params?: { user_id?: string | number; topic?: string }): Promise<Post[]> => {
    try {
      const res = await apiClient.get('/posts', { params });
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to active posts
    }

    let filtered = [...activePosts];
    if (params?.user_id) {
      filtered = filtered.filter((p) => String(p.user.id) === String(params.user_id));
    }
    if (params?.topic) {
      filtered = filtered.filter((p) => p.topics?.some((t) => t.toLowerCase() === params.topic?.toLowerCase()));
    }
    return filtered;
  },

  getPostById: async (id: string): Promise<Post | null> => {
    try {
      const res = await apiClient.get(`/posts/show/${id}`);
      const data = res.data?.data || res.data;
      if (data) return data;
    } catch {
      // Fallback
    }
    return activePosts.find((p) => p.id === id || p.uuid === id) || null;
  },

  createPost: async (postData: {
    content: string;
    city?: string;
    topics?: string[];
    media?: Array<{ file_path: string; file_type: 'image' | 'video' }>;
  }): Promise<Post> => {
    try {
      const res = await apiClient.post('/posts/store', postData);
      const created = res.data?.data || res.data;
      if (created) {
        activePosts = [created, ...activePosts];
        return created;
      }
    } catch {
      // Fallback
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      uuid: `post-${Date.now()}`,
      content: postData.content,
      city: postData.city || 'Pakistan',
      topics: postData.topics || ['Pakistan'],
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      bookmarks_count: 0,
      is_liked: false,
      is_reposted: false,
      is_bookmarked: false,
      media: (postData.media || []).map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        file_path: m.file_path,
        file_type: m.file_type,
        status: 'completed',
      })),
      user: {
        id: '1',
        name: 'Shahrukh Ahmed',
        username: '@shahrukh',
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        is_verified: true,
      },
      created_at: new Date().toISOString(),
    };

    activePosts = [newPost, ...activePosts];
    return newPost;
  },

  toggleLike: async (postId: string): Promise<{ is_liked: boolean; likes_count: number }> => {
    try {
      const res = await apiClient.post(`/posts/${postId}/like`);
      const data = res.data?.data || res.data;
      if (data && typeof data.is_liked === 'boolean') {
        return data;
      }
    } catch {
      // Fallback
    }

    let result = { is_liked: false, likes_count: 0 };
    activePosts = activePosts.map((p) => {
      if (p.id === postId || p.uuid === postId) {
        const nextLiked = !p.is_liked;
        const nextCount = nextLiked ? p.likes_count + 1 : Math.max(0, p.likes_count - 1);
        result = { is_liked: nextLiked, likes_count: nextCount };
        return { ...p, is_liked: nextLiked, likes_count: nextCount };
      }
      return p;
    });
    return result;
  },

  toggleRepost: async (postId: string): Promise<{ is_reposted: boolean; reposts_count: number }> => {
    let result = { is_reposted: false, reposts_count: 0 };
    activePosts = activePosts.map((p) => {
      if (p.id === postId || p.uuid === postId) {
        const next = !p.is_reposted;
        const nextCount = next ? p.reposts_count + 1 : Math.max(0, p.reposts_count - 1);
        result = { is_reposted: next, reposts_count: nextCount };
        return { ...p, is_reposted: next, reposts_count: nextCount };
      }
      return p;
    });
    return result;
  },

  toggleBookmark: async (postId: string): Promise<boolean> => {
    let bookmarked = false;
    activePosts = activePosts.map((p) => {
      if (p.id === postId || p.uuid === postId) {
        bookmarked = !p.is_bookmarked;
        return { ...p, is_bookmarked: bookmarked };
      }
      return p;
    });
    return bookmarked;
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    try {
      const res = await apiClient.get(`/posts/${postId}/comments`);
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback
    }
    return localComments[postId] || [];
  },

  createComment: async (postId: string, content: string, parentId?: string | null): Promise<Comment> => {
    try {
      const res = await apiClient.post(`/posts/${postId}/comments`, {
        content,
        parent_id: parentId,
      });
      const data = res.data?.data || res.data;
      if (data) return data;
    } catch {
      // Fallback
    }

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      post_id: postId,
      parent_id: parentId || null,
      content,
      user: {
        id: '1',
        name: 'Shahrukh Ahmed',
        username: '@shahrukh',
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        is_verified: true,
      },
      created_at: new Date().toISOString(),
    };

    if (!localComments[postId]) {
      localComments[postId] = [];
    }
    localComments[postId].push(newComment);

    activePosts = activePosts.map((p) =>
      p.id === postId || p.uuid === postId ? { ...p, comments_count: p.comments_count + 1 } : p
    );

    return newComment;
  },
};
