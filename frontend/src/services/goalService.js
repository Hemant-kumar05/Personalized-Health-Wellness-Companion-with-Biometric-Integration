import API from './apiClient';

const goalService = {
  listMyGoals: () => API.get('/goals'),
  createGoal: (data) => API.post('/goals', data),
  updateGoal: (id, data) => API.put(`/goals/${id}`, data),
  deleteGoal: (id) => API.delete(`/goals/${id}`),
};

export default goalService;
