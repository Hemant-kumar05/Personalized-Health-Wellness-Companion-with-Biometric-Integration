const { ApiError } = require('../utils/apiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err instanceof ApiError ? err.statusCode : 500;

  const payload = {
    message: err.message || 'Server Error',
  };

  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;

  if (process.env.NODE_ENV !== 'production') {
    // Log full error in dev
    console.error(err);
  }

  res.status(status).json(payload);
};

module.exports = { errorHandler };
