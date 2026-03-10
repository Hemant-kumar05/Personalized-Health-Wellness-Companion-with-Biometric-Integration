import API from './apiClient';

const recommendationService = {
  generate: () => API.post('/recommendations/generate'),
  latest: (kind) => API.get('/recommendations/latest', { params: kind ? { kind } : {} }),
  getLatest: (kind) => API.get('/recommendations/latest', { params: kind ? { kind } : {} }),
};

export default recommendationService;
