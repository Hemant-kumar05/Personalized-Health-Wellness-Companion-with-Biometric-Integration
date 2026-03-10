import API from './apiClient';

const communityService = {
  listPosts: () => API.get('/community/posts'),
  getPost: (id) => API.get(`/community/posts/${id}`),
  createPost: (data) => API.post('/community/posts', data),
  deletePost: (id) => API.delete(`/community/posts/${id}`),
  addComment: (id, body) => API.post(`/community/posts/${id}/comments`, { body }),
};

export default communityService;
