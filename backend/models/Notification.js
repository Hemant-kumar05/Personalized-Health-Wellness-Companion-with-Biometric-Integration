const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['water', 'workout', 'sleep', 'meal', 'system'], required: true },
    channel: { type: String, enum: ['in_app', 'email'], default: 'in_app' },
    message: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'sent', 'failed'], default: 'scheduled' },
    scheduledAt: { type: Date, required: true },
    sentAt: Date,
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, scheduledAt: -1 });
notificationSchema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
