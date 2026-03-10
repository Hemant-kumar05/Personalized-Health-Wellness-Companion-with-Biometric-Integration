const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    streakDays: { type: Number, default: 0 },
    lastActiveDate: Date,
    points: { type: Number, default: 0 },
    badges: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gamification', gamificationSchema);
