const mongoose = require('mongoose');

const biometricDataSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'heart_rate',
        'blood_pressure',
        'blood_sugar',
        'oxygen_level',
        'sleep_hours',
        'steps_count',
        'calories_burned',
        'weight',
      ],
      required: true,
    },
    // for simple numeric values
    value: { type: Number },
    // for blood pressure
    systolic: Number,
    diastolic: Number,
    unit: { type: String, default: '' },
    recordedAt: { type: Date, default: () => new Date() },
    source: { type: String, enum: ['manual', 'api'], default: 'manual' },
    notes: String,
  },
  { timestamps: true }
);

biometricDataSchema.index({ user: 1, type: 1, recordedAt: -1 });

module.exports = mongoose.model('BiometricData', biometricDataSchema);
