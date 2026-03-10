const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['weight', 'steps', 'sleep', 'calories', 'workouts', 'hydration', 'custom'],
      required: true,
    },
    target: { type: Number, required: true },
    unit: { type: String, default: '' },
    startDate: { type: Date, default: () => new Date() },
    endDate: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, type: 1, active: 1 });

module.exports = mongoose.model('Goal', goalSchema);
