const BiometricData = require('../models/BiometricData');
const Goal = require('../models/Goal');
const Progress = require('../models/Progress');
const Gamification = require('../models/Gamification');
const { asyncHandler } = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const latestBiometrics = await BiometricData.find({ user: userId })
    .sort({ recordedAt: -1 })
    .limit(25);

  const activeGoals = await Goal.find({ user: userId, active: true }).sort({ createdAt: -1 });

  const recentProgress = await Progress.find({ user: userId }).sort({ date: -1 }).limit(14);

  const gamification = await Gamification.findOne({ user: userId });

  // Very simple goal progress: compare latest steps/sleep/weight to targets when possible.
  const latestByType = {};
  for (const b of latestBiometrics) {
    if (!latestByType[b.type]) latestByType[b.type] = b;
  }

  const goalProgress = activeGoals.map((g) => {
    let current = null;
    if (g.type === 'steps') current = latestByType.steps_count?.value ?? null;
    if (g.type === 'sleep') current = latestByType.sleep_hours?.value ?? null;
    if (g.type === 'weight') current = latestByType.weight?.value ?? null;
    return {
      id: g._id,
      type: g.type,
      target: g.target,
      unit: g.unit,
      current,
      percent: current != null ? Math.max(0, Math.min(100, Math.round((current / g.target) * 100))) : null,
    };
  });

  res.json({
    latestBiometrics,
    activeGoals,
    goalProgress,
    recentProgress,
    streak: gamification?.streakDays || 0,
    points: gamification?.points || 0,
    badges: gamification?.badges || [],
  });
});

module.exports = { getSummary };
