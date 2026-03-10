const cron = require('node-cron');

const { processDueNotifications } = require('./notificationService');
const { ensureDailyGamification } = require('./gamificationService');

let started = false;

const startSchedulers = () => {
  if (started) return;
  started = true;

  const enabled = (process.env.CRON_ENABLED || 'true').toLowerCase() === 'true';
  if (!enabled) {
    console.log('⏸️  Cron disabled (CRON_ENABLED=false)');
    return;
  }

  // Every minute: send due notifications
  cron.schedule('* * * * *', async () => {
    await processDueNotifications();
  });

  // Every day at 00:10 UTC: streak/points upkeep
  cron.schedule('10 0 * * *', async () => {
    await ensureDailyGamification();
  });

  console.log('⏱️  Schedulers started');
};

module.exports = { startSchedulers };
