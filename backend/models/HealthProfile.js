const mongoose = require('mongoose');

const healthProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
    heightCm: Number,
    weightKg: Number,
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    medicalConditions: [{ type: String }],
    dietaryPreference: {
      type: String,
      enum: ['none', 'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo', 'halal', 'kosher', 'gluten_free'],
      default: 'none',
    },
    wellnessGoals: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthProfile', healthProfileSchema);
