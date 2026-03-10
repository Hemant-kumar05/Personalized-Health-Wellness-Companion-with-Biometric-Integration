const express = require('express');
const { body, query } = require('express-validator');

const { authRequired } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const {
  addBiometric,
  listBiometrics,
  latestBiometricsByType,
  getSummary,
  getTrends,
  updateBiometric,
  deleteBiometric,
} = require('../controllers/biometricController');

const router = express.Router();

router.post(
  '/',
  authRequired,
  body('type').isIn([
    'heart_rate',
    'blood_pressure',
    'blood_sugar',
    'oxygen_level',
    'sleep_hours',
    'steps_count',
    'calories_burned',
    'weight',
  ]),
  body('recordedAt').optional().isISO8601(),
  validateRequest,
  addBiometric
);

router.get(
  '/',
  authRequired,
  query('range').optional().isIn(['day', 'week', 'month']),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest,
  listBiometrics
);

router.get('/summary', authRequired, getSummary);

router.get(
  '/trends/:type',
  authRequired,
  validateRequest,
  getTrends
);

router.get('/latest', authRequired, latestBiometricsByType);

// Alias route for frontend: /api/biometrics/:type
router.get(
  '/:type(heart_rate|blood_pressure|blood_sugar|oxygen_level|sleep_hours|steps_count|calories_burned|weight)',
  authRequired,
  query('range').optional().isIn(['day', 'week', 'month']),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest,
  (req, res, next) => {
    req.query.type = req.params.type;
    return listBiometrics(req, res, next);
  }
);

router.put('/:id([0-9a-fA-F]{24})', authRequired, validateRequest, updateBiometric);
router.delete('/:id([0-9a-fA-F]{24})', authRequired, validateRequest, deleteBiometric);

module.exports = router;
