const express = require('express');
const cors = require('cors');

const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const goalRoutes = require('./routes/goalRoutes');
const biometricRoutes = require('./routes/biometricRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const communityRoutes = require('./routes/communityRoutes');
const gamificationRoutes = require('./routes/gamificationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(express.json({ limit: '1mb' }));

// CRA will proxy /favicon.ico to the backend if the frontend public/ folder lacks it.
// Returning 204 avoids noisy proxy errors in development.
app.get('/favicon.ico', (req, res) => res.status(204).end());

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/biometrics', biometricRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
