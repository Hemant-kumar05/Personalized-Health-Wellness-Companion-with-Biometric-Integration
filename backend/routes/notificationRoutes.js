const express = require('express');
const { body } = require('express-validator');

const { authRequired } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const {
  listMyNotifications,
  scheduleNotification,
  setMyReminderSettings,
  generateTodayReminders,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/me', authRequired, listMyNotifications);

router.post(
  '/schedule',
  authRequired,
  body('type').isIn(['water', 'workout', 'sleep', 'meal', 'system']),
  body('message').isString().isLength({ min: 1 }),
  body('scheduledAt').isISO8601(),
  body('channel').optional().isIn(['in_app', 'email']),
  validateRequest,
  scheduleNotification
);

router.put('/me/settings', authRequired, validateRequest, setMyReminderSettings);
router.post('/me/generate-today', authRequired, generateTodayReminders);

module.exports = router;
