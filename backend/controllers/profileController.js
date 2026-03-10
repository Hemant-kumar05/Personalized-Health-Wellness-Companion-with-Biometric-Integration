const HealthProfile = require('../models/HealthProfile');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await HealthProfile.findOne({ user: req.user._id });
  if (!profile) throw new ApiError(404, 'Profile not found');
  res.json(profile);
});

const upsertMyProfile = asyncHandler(async (req, res) => {
  const updates = req.body;

  const profile = await HealthProfile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true }
  );

  // If fullName is present, update User record too.
  if (typeof updates.fullName === 'string' && updates.fullName.trim()) {
    await User.findByIdAndUpdate(req.user._id, { $set: { fullName: updates.fullName.trim() } });
  }

  res.json(profile);
});

const updateReminderSettings = asyncHandler(async (req, res) => {
  const settings = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { reminderSettings: settings } },
    { new: true, select: '-passwordHash' }
  );
  res.json(user.reminderSettings);
});

const getReminderSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('reminderSettings');
  res.json(user.reminderSettings || {});
});

module.exports = { getMyProfile, upsertMyProfile, updateReminderSettings, getReminderSettings };
