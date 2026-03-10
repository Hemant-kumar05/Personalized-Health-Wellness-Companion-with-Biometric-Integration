const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    workoutsCompleted: { type: Number, default: 0 },
    steps: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    hydrationMl: { type: Number, default: 0 },
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, date: -1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
