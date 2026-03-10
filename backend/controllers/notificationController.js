const Notification = require('../models/Notification');
const User = require('../models/User');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const listMyNotifications = asyncHandler(async (req, res) => {
  const rows = await Notification.find({ user: req.user._id }).sort({ scheduledAt: -1 }).limit(200);
  res.json(rows);
});

const scheduleNotification = asyncHandler(async (req, res) => {
  const { type, message, scheduledAt, channel } = req.body;
  const doc = await Notification.create({
    user: req.user._id,
    type,
    message,
    channel: channel || 'in_app',
    scheduledAt: new Date(scheduledAt),
  });
  res.status(201).json(doc);
});

const setMyReminderSettings = asyncHandler(async (req, res) => {
  const settings = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { reminderSettings: settings } },
    { new: true, select: '-passwordHash' }
  );
  res.json(user.reminderSettings);
});

const generateTodayReminders = asyncHandler(async (req, res) => {
  // Simple helper: create scheduled notifications for today based on stored settings.
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const base = new Date();
  const dateStr = base.toISOString().slice(0, 10);
  const settings = user.reminderSettings || {};

  const createAt = async (type, time, msg) => {
    if (!time) return null;
    const scheduled = new Date(`${dateStr}T${time}:00.000Z`);
    if (Number.isNaN(scheduled.getTime())) return null;
    return Notification.create({ user: user._id, type, message: msg, scheduledAt: scheduled, channel: 'in_app' });
  };

  const created = [];

  if (settings.water?.enabled) created.push(await createAt('water', settings.water.time || '09:00', 'Time to drink water'));
  if (settings.workout?.enabled) created.push(await createAt('workout', settings.workout.time || '18:00', 'Time for your workout'));
  if (settings.sleep?.enabled) created.push(await createAt('sleep', settings.sleep.time || '22:00', 'Prepare for sleep'));
  if (settings.meal?.enabled) created.push(await createAt('meal', settings.meal.time || '12:00', 'Meal reminder'));

  res.status(201).json({ created: created.filter(Boolean) });
});

module.exports = { listMyNotifications, scheduleNotification, setMyReminderSettings, generateTodayReminders };
