const express = require('express');
const { body } = require('express-validator');

const { authRequired, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { createBooking, listMyBookings, listExpertBookings, updateBookingStatus } = require('../controllers/bookingController');

const router = express.Router();

router.get('/me', authRequired, listMyBookings);
router.get('/expert', authRequired, requireRole('expert'), listExpertBookings);

router.post(
  '/',
  authRequired,
  body('expertId').isString(),
  body('scheduledAt').isISO8601(),
  body('durationMinutes').optional().isInt({ min: 15, max: 240 }),
  validateRequest,
  createBooking
);

router.put('/:id/status', authRequired, body('status').isIn(['requested', 'confirmed', 'completed', 'cancelled']), validateRequest, updateBookingStatus);

module.exports = router;
