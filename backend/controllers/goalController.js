const Goal = require('../models/Goal');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const listMyGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(goals);
});

const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create({ ...req.body, user: req.user._id });
  res.status(201).json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const goal = await Goal.findOneAndUpdate({ _id: id, user: req.user._id }, { $set: req.body }, { new: true });
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.json(goal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const goal = await Goal.findOneAndDelete({ _id: id, user: req.user._id });
  if (!goal) throw new ApiError(404, 'Goal not found');
  res.json({ deleted: true });
});

module.exports = { listMyGoals, createGoal, updateGoal, deleteGoal };
