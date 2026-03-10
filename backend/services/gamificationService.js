const Gamification = require('../models/Gamification');

const toDateOnly = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const ensureDailyGamification = async () => {
  const today = toDateOnly(new Date());

  const users = await Gamification.find({});
  for (const g of users) {
    if (!g.lastActiveDate) continue;

    const last = toDateOnly(new Date(g.lastActiveDate));
    const diffDays = Math.floor((today - last) / (24 * 60 * 60 * 1000));

    // If user inactive for 2+ days, reset streak
    if (diffDays >= 2 && g.streakDays !== 0) {
      g.streakDays = 0;
      await g.save();
    }
  }
};

module.exports = { ensureDailyGamification };
