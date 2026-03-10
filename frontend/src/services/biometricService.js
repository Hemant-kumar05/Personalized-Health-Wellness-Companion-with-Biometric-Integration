import API from './apiClient';

const biometricService = {
  // Log biometric data
  logBiometricData: (data) => {
    return API.post('/biometrics', data);
  },

  // Get biometric data by type
  getBiometricData: (type, options = {}) => {
    const params = new URLSearchParams();
    
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.limit) params.append('limit', options.limit);
    if (options.page) params.append('page', options.page);
    if (options.sort) params.append('sort', options.sort);

    return API.get(`/biometrics/${type}?${params.toString()}`);
  },

  // Get biometric summary
  getBiometricSummary: () => {
    return API.get('/biometrics/summary');
  },

  // Get biometric trends
  getBiometricTrends: (type, period = 'month') => {
    return API.get(`/biometrics/trends/${type}?period=${period}`);
  },

  // Update biometric data
  updateBiometricData: (id, data) => {
    return API.put(`/biometrics/${id}`, data);
  },

  // Delete biometric data
  deleteBiometricData: (id) => {
    return API.delete(`/biometrics/${id}`);
  },
};

export default biometricService;