const express = require('express');
const { body } = require('express-validator');

const { authRequired } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const {
  getMyProfile,
  upsertMyProfile,
  updateReminderSettings,
  getReminderSettings,
} = require('../controllers/profileController');

const router = express.Router();

router.get('/me', authRequired, getMyProfile);

router.put(
  '/me',
  authRequired,
  body('age').optional().isInt({ min: 0, max: 130 }),
  body('heightCm').optional().isFloat({ min: 0 }),
  body('weightKg').optional().isFloat({ min: 0 }),
  validateRequest,
  upsertMyProfile
);

router.get('/me/reminders', authRequired, getReminderSettings);
router.put('/me/reminders', authRequired, validateRequest, updateReminderSettings);

module.exports = router;
