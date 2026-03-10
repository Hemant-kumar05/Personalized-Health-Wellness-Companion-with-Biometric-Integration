const Expert = require('../models/Expert');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const listExperts = asyncHandler(async (req, res) => {
  const experts = await Expert.find({ active: true }).populate('user', 'fullName email role');
  res.json(experts);
});

const getExpert = asyncHandler(async (req, res) => {
  const expert = await Expert.findById(req.params.id).populate('user', 'fullName email role');
  if (!expert) throw new ApiError(404, 'Expert not found');
  res.json(expert);
});

const upsertMyExpertProfile = asyncHandler(async (req, res) => {
  if (req.user.role !== 'expert') throw new ApiError(403, 'Expert role required');

  const expert = await Expert.findOneAndUpdate(
    { user: req.user._id },
    { $set: { ...req.body, user: req.user._id } },
    { new: true, upsert: true }
  );

  res.json(expert);
});

const setExpertActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  const expert = await Expert.findByIdAndUpdate(id, { $set: { active: Boolean(active) } }, { new: true });
  if (!expert) throw new ApiError(404, 'Expert not found');
  res.json(expert);
});

const makeUserExpert = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findByIdAndUpdate(userId, { $set: { role: 'expert' } }, { new: true });
  if (!user) throw new ApiError(404, 'User not found');
  const expert = await Expert.findOneAndUpdate({ user: user._id }, { $setOnInsert: { user: user._id } }, { new: true, upsert: true });
  res.json({ user: { id: user._id, role: user.role }, expert });
});

module.exports = { listExperts, getExpert, upsertMyExpertProfile, setExpertActive, makeUserExpert };
