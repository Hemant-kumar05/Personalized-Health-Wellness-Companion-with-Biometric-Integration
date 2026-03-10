import API from './apiClient';

const authService = {
  // Register user
  register: (userData) => {
    return API.post('/auth/register', userData);
  },

  // Login user
  login: (email, password) => {
    return API.post('/auth/login', { email, password });
  },

  // Get current user
  getCurrentUser: () => {
    return API.get('/auth/me');
  },

  // Update password
  updatePassword: (currentPassword, newPassword) => {
    return API.put('/auth/password', { currentPassword, newPassword });
  },

  // Logout user
  logout: () => {
    return API.post('/auth/logout');
  },
};

export default authService;