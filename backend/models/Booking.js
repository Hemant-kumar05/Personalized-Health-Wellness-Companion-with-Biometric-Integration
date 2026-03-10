const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    status: { type: String, enum: ['requested', 'confirmed', 'completed', 'cancelled'], default: 'requested' },
    notes: String,
  },
  { timestamps: true }
);

bookingSchema.index({ expert: 1, scheduledAt: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
