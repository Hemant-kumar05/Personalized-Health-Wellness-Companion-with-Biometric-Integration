const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    title: { type: String, default: 'Health Expert' },
    bio: { type: String, default: '' },
    specialties: [{ type: String }],
    ratePerHour: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expert', expertSchema);
