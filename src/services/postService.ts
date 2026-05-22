import api from '../api/axios';

export const postService = {
  getPosts: async (params: any = {}) => {
    const response = await api.get('/posts', { params });
    console.log('GET POSTS RESPONSE:', response.data);
    // Handle Laravel API response structure: { status, message, data: [...] }
    const posts = response.data?.data || response.data || [];
    return Array.isArray(posts) ? posts : [];
  },

  getPost: async (id: string) => {
    const response = await api.get(`/posts/show/${id}`);
    console.log('GET POST RESPONSE:', response.data);
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data;
  },

  createPost: async (postData: any, onUploadProgress?: (progress: number) => void) => {
    const response = await api.post('/posts/store', postData, {
      onUploadProgress: (progressEvent: any) => {
        if (onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(progress);
        }
      },
    });
    console.log('CREATE POST RESPONSE:', response.data);
    // Handle Laravel API response structure: { status, message, data: {...} }
    return response.data?.data || response.data;
  },

  updatePost: async (id: string, postData: any) => {
    const response = await api.put(`/posts/update/${id}`, postData);
    console.log('UPDATE POST RESPONSE:', response.data);
    return response.data?.data || response.data;
  },

  deletePost: async (id: string) => {
    const response = await api.delete(`/posts/delete/${id}`);
    console.log('DELETE POST RESPONSE:', response.data);
    return response.data;
  },

  toggleLike: async (uuid: string) => {
    const response = await api.post(`/posts/${uuid}/like`);
    console.log('TOGGLE LIKE RESPONSE:', response.data);
    return response.data?.data || response.data;
  },

  getComments: async (postId: string) => {
    const response = await api.get(`/posts/${postId}/comments`);
    console.log('GET COMMENTS RESPONSE:', response.data);
    return response.data?.data || response.data;
  },

  createComment: async (postId: string, commentData: any) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    console.log('CREATE COMMENT RESPONSE:', response.data);
    return response.data?.data || response.data;
  },
};
