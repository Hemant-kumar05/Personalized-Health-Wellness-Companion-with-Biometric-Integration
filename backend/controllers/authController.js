const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const HealthProfile = require('../models/HealthProfile');
const Gamification = require('../models/Gamification');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ role: user.role }, secret, { subject: String(user._id), expiresIn });
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    role: role || 'user',
  });

  await HealthProfile.create({ user: user._id });
  await Gamification.create({ user: user._id, streakDays: 0, points: 0, badges: [] });

  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new ApiError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

module.exports = { register, login, me };
