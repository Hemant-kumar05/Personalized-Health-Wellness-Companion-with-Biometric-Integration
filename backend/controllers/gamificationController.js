const Gamification = require('../models/Gamification');
const Progress = require('../models/Progress');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const toDateOnly = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const getMyGamification = asyncHandler(async (req, res) => {
  const g = await Gamification.findOne({ user: req.user._id });
  if (!g) throw new ApiError(404, 'Gamification not found');
  res.json(g);
});

const markActiveToday = asyncHandler(async (req, res) => {
  const today = toDateOnly(new Date());
  const g = await Gamification.findOne({ user: req.user._id });
  if (!g) throw new ApiError(404, 'Gamification not found');

  const last = g.lastActiveDate ? toDateOnly(new Date(g.lastActiveDate)) : null;
  const diffDays = last ? Math.floor((today - last) / (24 * 60 * 60 * 1000)) : null;

  if (!last) {
    g.streakDays = 1;
  } else if (diffDays === 1) {
    g.streakDays += 1;
  } else if (diffDays === 0) {
    // already active today
  } else {
    g.streakDays = 1;
  }

  g.lastActiveDate = today;
  g.points += 5;

  if (g.streakDays === 7 && !g.badges.includes('7_day_streak')) g.badges.push('7_day_streak');
  if (g.streakDays === 30 && !g.badges.includes('30_day_streak')) g.badges.push('30_day_streak');

  await g.save();

  // Also upsert a Progress row if provided
  if (req.body.progress) {
    await Progress.findOneAndUpdate(
      { user: req.user._id, date: today },
      { $set: { user: req.user._id, date: today, ...req.body.progress } },
      { upsert: true, new: true }
    );
  }

  res.json(g);
});

module.exports = { getMyGamification, markActiveToday };
