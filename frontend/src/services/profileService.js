import API from './apiClient';

const profileService = {
  getMyProfile: () => API.get('/profile/me'),
  updateMyProfile: (data) => API.put('/profile/me', data),
  getReminderSettings: () => API.get('/profile/me/reminders'),
  updateReminderSettings: (settings) => API.put('/profile/me/reminders', settings),
};

export default profileService;
