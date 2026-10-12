import api from '../api/axios';
import { posts as initialSeedPosts } from '../data/fliqData';

// Initial local state seeded from fliqData
const getInitialStoredPosts = () => {
  try {
    const saved = localStorage.getItem('fliq_posts');
    if (saved) return JSON.parse(saved);
  } catch {}

  return initialSeedPosts.map((p, idx) => ({
    id: `post-${idx + 1}`,
    uuid: `post-${idx + 1}`,
    name: p.name,
    handle: p.handle,
    city: p.city,
    time: p.time,
    content: p.text,
    likes_count: typeof p.likes === 'number' ? p.likes : 240,
    is_liked: false,
    reposts_count: p.reposts || 12,
    comments_count: p.replies || 4,
    created_at: new Date(Date.now() - (idx + 1) * 600000).toISOString(),
    media: [],
    topics: ['Pakistan', 'Community'],
    user: {
      id: idx + 1,
      name: p.name,
      username: p.handle,
      profile_photo: null,
    },
  }));
};

let localPosts = getInitialStoredPosts();
const saveLocalPosts = () => {
  try {
    localStorage.setItem('fliq_posts', JSON.stringify(localPosts));
  } catch {}
};

const localComments: Record<string, any[]> = {
  'post-1': [
    {
      id: 'c-1',
      content: 'Much needed initiative for the Pakistani tech ecosystem! 🚀',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: { name: 'Ali Raza', username: '@aliraza' },
    },
    {
      id: 'c-2',
      content: 'Love the calmer feed concept. No spam, just real discussions.',
      created_at: new Date(Date.now() - 1800000).toISOString(),
      user: { name: 'Sara Qureshi', username: '@saraq' },
    },
  ],
};

export const postService = {
  getPosts: async (params: any = {}) => {
    try {
      const response: any = await api.get('/posts', { params });
      const posts = response.data?.data || response.data || [];
      if (Array.isArray(posts) && posts.length > 0) return posts;
    } catch {
      // Fallback to local memory / stored posts
    }
    
    if (params.user_id) {
      return localPosts.filter((p: any) => p.user?.id === params.user_id || p.handle === '@fliq');
    }
    return [...localPosts];
  },

  getPost: async (id: string) => {
    try {
      const response: any = await api.get(`/posts/show/${id}`);
      return response.data?.data || response.data;
    } catch {
      return localPosts.find((p: any) => p.id === id || p.uuid === id) || localPosts[0];
    }
  },

  createPost: async (postData: any, onUploadProgress?: (progress: number) => void) => {
    try {
      if (onUploadProgress) {
        onUploadProgress(50);
        setTimeout(() => onUploadProgress(100), 100);
      }
      const response: any = await api.post('/posts/store', postData);
      const newPost = response.data?.data || response.data;
      if (newPost) return newPost;
    } catch {
      // Create locally
    }

    // Extract text content from FormData or object
    let content = '';
    let topics: string[] = [];
    if (postData instanceof FormData) {
      content = (postData.get('content') as string) || '';
      const topicsList = postData.getAll('topics[]');
      topics = topicsList.map(String);
    } else if (typeof postData === 'object') {
      content = postData.content || '';
      topics = postData.topics || [];
    }

    const newPost = {
      id: `post-${Date.now()}`,
      uuid: `post-${Date.now()}`,
      name: 'Fliq User',
      handle: '@fliquser',
      city: 'Pakistan',
      time: 'just now',
      content,
      likes_count: 0,
      is_liked: false,
      reposts_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      media: [],
      topics,
      user: {
        id: 999,
        name: 'Fliq User',
        username: '@fliquser',
        profile_photo: null,
      },
    };

    localPosts = [newPost, ...localPosts];
    saveLocalPosts();
    return newPost;
  },

  updatePost: async (id: string, postData: any) => {
    try {
      const response: any = await api.put(`/posts/update/${id}`, postData);
      return response.data?.data || response.data;
    } catch {
      localPosts = localPosts.map((p: any) =>
        p.id === id ? { ...p, ...postData } : p
      );
      saveLocalPosts();
      return postData;
    }
  },

  deletePost: async (id: string) => {
    try {
      const response: any = await api.delete(`/posts/delete/${id}`);
      return response.data;
    } catch {
      localPosts = localPosts.filter((p: any) => p.id !== id && p.uuid !== id);
      saveLocalPosts();
      return { success: true };
    }
  },

  toggleLike: async (uuid: string) => {
    try {
      const response: any = await api.post(`/posts/${uuid}/like`);
      return response.data?.data || response.data;
    } catch {
      let result = { is_liked: false, likes_count: 0 };
      localPosts = localPosts.map((p: any) => {
        if (p.id === uuid || p.uuid === uuid) {
          const nextLiked = !p.is_liked;
          const nextCount = nextLiked ? (p.likes_count || 0) + 1 : Math.max(0, (p.likes_count || 1) - 1);
          result = { is_liked: nextLiked, likes_count: nextCount };
          return { ...p, is_liked: nextLiked, likes_count: nextCount };
        }
        return p;
      });
      saveLocalPosts();
      return result;
    }
  },

  getComments: async (postId: string) => {
    try {
      const response: any = await api.get(`/posts/${postId}/comments`);
      return response.data?.data || response.data;
    } catch {
      return localComments[postId] || [];
    }
  },

  createComment: async (postId: string, commentData: any) => {
    try {
      const response: any = await api.post(`/posts/${postId}/comments`, commentData);
      return response.data?.data || response.data;
    } catch {
      const newComment = {
        id: `c-${Date.now()}`,
        content: commentData.content || '',
        created_at: new Date().toISOString(),
        user: { name: 'You', username: '@you' },
        parent_id: commentData.parent_id || null,
      };

      if (!localComments[postId]) {
        localComments[postId] = [];
      }
      localComments[postId].push(newComment);

      // Increment comments_count in post
      localPosts = localPosts.map((p: any) =>
        p.id === postId || p.uuid === postId
          ? { ...p, comments_count: (p.comments_count || 0) + 1 }
          : p
      );
      saveLocalPosts();

      return newComment;
    }
  },
};
