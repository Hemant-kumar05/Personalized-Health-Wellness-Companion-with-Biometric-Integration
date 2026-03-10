const mongoose = require('mongoose');

const reminderSettingsSchema = new mongoose.Schema(
  {
    water: { enabled: { type: Boolean, default: false }, time: String },
    workout: { enabled: { type: Boolean, default: false }, time: String },
    sleep: { enabled: { type: Boolean, default: false }, time: String },
    meal: { enabled: { type: Boolean, default: false }, time: String },
    timezone: { type: String, default: 'UTC' },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'expert'], default: 'user' },
    reminderSettings: { type: reminderSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
