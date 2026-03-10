require('dotenv').config();

const app = require('./app');
const { connectDB, disconnectDB } = require('./config/db');
const { startSchedulers } = require('./services/schedulerService');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
  });

  startSchedulers();

  const shutdown = async (signal) => {
    try {
      console.log(`\n${signal} received. Shutting down...`);
      await disconnectDB();
      server.close(() => process.exit(0));
    } catch (err) {
      console.error('Shutdown error:', err);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
})();
