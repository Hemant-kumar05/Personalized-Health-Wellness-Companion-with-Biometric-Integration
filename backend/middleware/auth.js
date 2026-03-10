const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');
const User = require('../models/User');

const authRequired = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new ApiError(401, 'Authentication required'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select('-passwordHash');
    if (!user) return next(new ApiError(401, 'Invalid token'));

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid token'));
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication required'));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden'));
  }
  next();
};

module.exports = { authRequired, requireRole };
