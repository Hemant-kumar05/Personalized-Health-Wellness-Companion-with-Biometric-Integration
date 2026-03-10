const express = require('express');
const { body } = require('express-validator');

const { register, login, me } = require('../controllers/authController');
const { validateRequest } = require('../middleware/validateRequest');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  body('fullName').isString().isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin', 'expert']),
  validateRequest,
  register
);

router.post('/login', body('email').isEmail(), body('password').isString().isLength({ min: 1 }), validateRequest, login);

router.get('/me', authRequired, me);

module.exports = router;
