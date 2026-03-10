const express = require('express');
const { body } = require('express-validator');

const { authRequired } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { listMyGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');

const router = express.Router();

router.get('/', authRequired, listMyGoals);

router.post(
  '/',
  authRequired,
  body('type').isIn(['weight', 'steps', 'sleep', 'calories', 'workouts', 'hydration', 'custom']),
  body('target').isNumeric(),
  body('unit').optional().isString(),
  validateRequest,
  createGoal
);

router.put('/:id', authRequired, validateRequest, updateGoal);
router.delete('/:id', authRequired, deleteGoal);

module.exports = router;
