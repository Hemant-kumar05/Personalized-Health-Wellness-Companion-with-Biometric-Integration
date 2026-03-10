const User = require('../models/User');
const Expert = require('../models/Expert');
const CommunityPost = require('../models/CommunityPost');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 }).limit(200);
  res.json(users);
});

const platformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const experts = await Expert.countDocuments({ active: true });
  const posts = await CommunityPost.countDocuments({ status: 'active' });
  res.json({ totalUsers, activeExperts: experts, activePosts: posts });
});

const removeCommunityPost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');
  post.status = 'removed';
  await post.save();
  res.json({ removed: true });
});

module.exports = { listUsers, platformStats, removeCommunityPost };
