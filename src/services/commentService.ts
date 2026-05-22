import api from '../api/axios';

export const commentService = {
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

  deleteComment: async (commentId: string) => {
    const response = await api.delete(`/comments/${commentId}`);
    console.log('DELETE COMMENT RESPONSE:', response.data);
    return response.data;
  },
};
