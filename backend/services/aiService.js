// Placeholder AI service.
// Swap this implementation with OpenAI / other providers later.

const buildWorkout = ({ profile }) => {
  const level = profile?.activityLevel || 'moderate';
  return {
    title: 'Personalized Workout Plan',
    plan: [
      { day: 'Mon', activity: level === 'sedentary' ? '20 min walk' : '30 min cardio + mobility' },
      { day: 'Wed', activity: 'Strength training (full body, 30 min)' },
      { day: 'Fri', activity: 'Interval cardio (20 min) + stretching' },
    ],
    tips: ['Warm up 5-10 minutes', 'Hydrate', 'Progress gradually'],
  };
};

const buildMeal = ({ profile }) => {
  const pref = profile?.dietaryPreference || 'none';
  return {
    title: 'Personalized Meal Suggestions',
    dietaryPreference: pref,
    suggestions: [
      { meal: 'Breakfast', idea: 'Oats + fruit + nuts' },
      { meal: 'Lunch', idea: 'Lean protein + veggies + whole grains' },
      { meal: 'Dinner', idea: 'Balanced plate + fiber-rich side' },
    ],
  };
};

const buildMindfulness = () => {
  return {
    title: 'Mindfulness / Stress Relief',
    exercises: [
      { name: 'Box breathing', minutes: 5 },
      { name: 'Body scan', minutes: 10 },
      { name: 'Gratitude journaling', minutes: 5 },
    ],
  };
};

const generateRecommendations = async ({ profile, latestBiometrics }) => {
  return {
    workout: buildWorkout({ profile, latestBiometrics }),
    meal: buildMeal({ profile, latestBiometrics }),
    mindfulness: buildMindfulness({ profile, latestBiometrics }),
  };
};

module.exports = { generateRecommendations };
