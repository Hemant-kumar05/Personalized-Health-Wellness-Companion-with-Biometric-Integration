require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { connectDB } = require('../config/db');
const User = require('../models/User');
const HealthProfile = require('../models/HealthProfile');
const Expert = require('../models/Expert');
const Goal = require('../models/Goal');
const BiometricData = require('../models/BiometricData');
const Gamification = require('../models/Gamification');
const CommunityPost = require('../models/CommunityPost');

const seed = async () => {
  await connectDB();

  const adminEmail = 'admin@example.com';
  const expertEmail = 'expert@example.com';
  const userEmail = 'user@example.com';

  const upsertUser = async ({ fullName, email, role, password }) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return User.findOneAndUpdate(
      { email },
      { $set: { fullName, email, role, passwordHash } },
      { upsert: true, new: true }
    );
  };

  const admin = await upsertUser({ fullName: 'Admin', email: adminEmail, role: 'admin', password: 'Password123!' });
  const expertUser = await upsertUser({ fullName: 'Dr. Expert', email: expertEmail, role: 'expert', password: 'Password123!' });
  const user = await upsertUser({ fullName: 'Sample User', email: userEmail, role: 'user', password: 'Password123!' });

  await HealthProfile.findOneAndUpdate(
    { user: user._id },
    {
      $set: {
        user: user._id,
        age: 28,
        gender: 'other',
        heightCm: 175,
        weightKg: 72,
        activityLevel: 'moderate',
        medicalConditions: ['none'],
        dietaryPreference: 'none',
        wellnessGoals: ['lose fat', 'increase stamina'],
      },
    },
    { upsert: true, new: true }
  );

  await Gamification.findOneAndUpdate(
    { user: user._id },
    { $setOnInsert: { user: user._id, streakDays: 0, points: 0, badges: [] } },
    { upsert: true, new: true }
  );

  const expert = await Expert.findOneAndUpdate(
    { user: expertUser._id },
    {
      $set: {
        user: expertUser._id,
        title: 'Certified Nutritionist',
        bio: 'Helping you build sustainable nutrition habits.',
        specialties: ['nutrition', 'weight loss', 'meal planning'],
        ratePerHour: 50,
        active: true,
      },
    },
    { upsert: true, new: true }
  );

  // Goals
  await Goal.deleteMany({ user: user._id });
  await Goal.create({ user: user._id, type: 'steps', target: 8000, unit: 'steps', active: true });
  await Goal.create({ user: user._id, type: 'sleep', target: 8, unit: 'hours', active: true });

  // Biometrics
  await BiometricData.deleteMany({ user: user._id });
  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  await BiometricData.create({ user: user._id, type: 'steps_count', value: 6200, unit: 'steps', recordedAt: daysAgo(1), source: 'manual' });
  await BiometricData.create({ user: user._id, type: 'steps_count', value: 8100, unit: 'steps', recordedAt: daysAgo(0), source: 'manual' });
  await BiometricData.create({ user: user._id, type: 'heart_rate', value: 72, unit: 'bpm', recordedAt: daysAgo(0), source: 'manual' });
  await BiometricData.create({ user: user._id, type: 'sleep_hours', value: 7.5, unit: 'hours', recordedAt: daysAgo(0), source: 'manual' });
  await BiometricData.create({ user: user._id, type: 'blood_pressure', systolic: 120, diastolic: 80, unit: 'mmHg', recordedAt: daysAgo(0), source: 'manual' });

  // Community post
  await CommunityPost.deleteMany({ author: user._id });
  await CommunityPost.create({ author: user._id, title: 'Starting my wellness journey', body: 'Any tips for building a consistent routine?', tags: ['habits', 'motivation'] });

  console.log('✅ Seed complete');
  console.log('Logins:');
  console.log(`- Admin:  ${adminEmail} / Password123!`);
  console.log(`- Expert: ${expertEmail} / Password123!`);
  console.log(`- User:   ${userEmail} / Password123!`);
  console.log(`Expert id: ${expert._id}`);

  await mongoose.connection.close();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
