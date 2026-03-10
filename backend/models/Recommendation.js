const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    kind: { type: String, enum: ['workout', 'meal', 'mindfulness'], required: true },
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    generatedBy: { type: String, default: 'placeholder' },
    basedOn: {
      profileUpdatedAt: Date,
      latestBiometricAt: Date,
    },
  },
  { timestamps: true }
);

recommendationSchema.index({ user: 1, kind: 1, createdAt: -1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
