const Recommendation = require('../models/Recommendation');
const HealthProfile = require('../models/HealthProfile');
const BiometricData = require('../models/BiometricData');
const { asyncHandler } = require('../utils/asyncHandler');
const { generateRecommendations } = require('../services/aiService');

const generateMyRecommendations = asyncHandler(async (req, res) => {
  const profile = await HealthProfile.findOne({ user: req.user._id });

  const latestBiometric = await BiometricData.findOne({ user: req.user._id }).sort({ recordedAt: -1 });

  const recs = await generateRecommendations({ profile, latestBiometrics: latestBiometric });

  const created = [];
  for (const kind of ['workout', 'meal', 'mindfulness']) {
    const payload = recs[kind];
    const doc = await Recommendation.create({
      user: req.user._id,
      kind,
      title: payload.title,
      content: payload,
      generatedBy: 'placeholder',
      basedOn: {
        profileUpdatedAt: profile?.updatedAt,
        latestBiometricAt: latestBiometric?.recordedAt,
      },
    });
    created.push(doc);
  }

  res.status(201).json({ created });
});

const getLatestMyRecommendations = asyncHandler(async (req, res) => {
  const { kind } = req.query;
  const q = { user: req.user._id };
  if (kind) q.kind = kind;

  const docs = await Recommendation.find(q).sort({ createdAt: -1 }).limit(20);
  res.json(docs);
});

module.exports = { generateMyRecommendations, getLatestMyRecommendations };
