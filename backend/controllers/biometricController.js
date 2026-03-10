const BiometricData = require('../models/BiometricData');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const TYPES = [
  'heart_rate',
  'blood_pressure',
  'blood_sugar',
  'oxygen_level',
  'sleep_hours',
  'steps_count',
  'calories_burned',
  'weight',
];

const addBiometric = asyncHandler(async (req, res) => {
  const payload = { ...req.body, user: req.user._id };

  if (payload.type === 'blood_pressure') {
    if (typeof payload.systolic !== 'number' || typeof payload.diastolic !== 'number') {
      throw new ApiError(400, 'blood_pressure requires systolic and diastolic');
    }
    payload.value = undefined;
  } else {
    if (typeof payload.value !== 'number') throw new ApiError(400, 'value must be a number');
  }

  const record = await BiometricData.create(payload);
  res.status(201).json({ biometricData: record });
});

const listBiometrics = asyncHandler(async (req, res) => {
  const { type, range, from, to, startDate, endDate, limit, page, sort } = req.query;
  const q = { user: req.user._id };
  if (type) q.type = type;

  const now = new Date();
  let start;
  let end;

  const fromLike = from || startDate;
  const toLike = to || endDate;

  if (fromLike || toLike) {
    if (fromLike) start = new Date(fromLike);
    if (toLike) end = new Date(toLike);
  } else if (range) {
    const r = String(range);
    end = now;
    if (r === 'day') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (r === 'week') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (r === 'month') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  if (start || end) {
    q.recordedAt = {};
    if (start) q.recordedAt.$gte = start;
    if (end) q.recordedAt.$lte = end;
  }

  const limitNum = Math.min(Number(limit || 500), 2000);
  const pageNum = Math.max(1, Number(page || 1));
  const skipNum = (pageNum - 1) * limitNum;

  let sortDir = -1;
  const sortStr = String(sort || '').toLowerCase();
  if (sortStr === 'asc' || sortStr === 'oldest') sortDir = 1;

  const rows = await BiometricData.find(q)
    .sort({ recordedAt: sortDir })
    .skip(skipNum)
    .limit(limitNum);

  res.json({ biometricData: rows });
});

const latestBiometricsByType = asyncHandler(async (req, res) => {
  const latest = {};
  for (const t of TYPES) {
    const doc = await BiometricData.findOne({ user: req.user._id, type: t }).sort({ recordedAt: -1 });
    if (doc) latest[t] = doc;
  }

  res.json(latest);
});

const getSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const latest = {};
  for (const t of TYPES) {
    const doc = await BiometricData.findOne({ user: userId, type: t }).sort({ recordedAt: -1 });
    if (doc) latest[t] = doc;
  }

  // Alias for frontend naming
  if (latest.sleep_hours && !latest.sleep_duration) {
    latest.sleep_duration = latest.sleep_hours;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const now = new Date();

  const totalEntries = await BiometricData.countDocuments({ user: userId, recordedAt: { $gte: startOfDay, $lte: now } });
  const types = await BiometricData.distinct('type', { user: userId, recordedAt: { $gte: startOfDay, $lte: now } });

  res.json({
    latest,
    today: {
      totalEntries,
      types,
    },
  });
});

const getTrends = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { type } = req.params;
  const period = String(req.query.period || 'month');

  const now = new Date();
  let start = null;
  if (period === 'day') start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (period === 'week') start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (period === 'month') start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (!start) start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const rows = await BiometricData.find({ user: userId, type, recordedAt: { $gte: start, $lte: now } })
    .sort({ recordedAt: 1 })
    .limit(2000);

  res.json({
    type,
    period,
    points: rows.map((r) => ({
      recordedAt: r.recordedAt,
      value: r.value,
      unit: r.unit,
      systolic: r.systolic,
      diastolic: r.diastolic,
    })),
  });
});

const updateBiometric = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const update = { ...req.body };
  delete update.user;

  const nextType = update.type;
  const effectiveType = nextType;

  if (effectiveType === 'blood_pressure') {
    if (update.systolic != null && typeof update.systolic !== 'number') throw new ApiError(400, 'systolic must be a number');
    if (update.diastolic != null && typeof update.diastolic !== 'number') throw new ApiError(400, 'diastolic must be a number');
    if (update.value !== undefined) update.value = undefined;
  } else {
    if (update.value != null && typeof update.value !== 'number') throw new ApiError(400, 'value must be a number');
  }

  const doc = await BiometricData.findOneAndUpdate({ _id: id, user: userId }, update, { new: true });
  if (!doc) throw new ApiError(404, 'Biometric entry not found');
  res.json({ biometricData: doc });
});

const deleteBiometric = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const doc = await BiometricData.findOneAndDelete({ _id: id, user: userId });
  if (!doc) throw new ApiError(404, 'Biometric entry not found');
  res.json({ success: true });
});

module.exports = { addBiometric, listBiometrics, latestBiometricsByType, getSummary, getTrends, updateBiometric, deleteBiometric };
