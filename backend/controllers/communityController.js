const CommunityPost = require('../models/CommunityPost');
const Comment = require('../models/Comment');
const { ApiError } = require('../utils/apiError');
const { asyncHandler } = require('../utils/asyncHandler');

const listPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find({ status: 'active' })
    .populate('author', 'fullName role')
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.create({
    author: req.user._id,
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags || [],
  });
  res.status(201).json(post);
});

const getPost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id).populate('author', 'fullName role');
  if (!post || post.status !== 'active') throw new ApiError(404, 'Post not found');

  const comments = await Comment.find({ post: post._id, status: 'active' })
    .populate('author', 'fullName role')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ post, comments });
});

const addComment = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post || post.status !== 'active') throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({ post: post._id, author: req.user._id, body: req.body.body });
  res.status(201).json(comment);
});

const removePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const isOwner = String(post.author) === String(req.user._id);
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');

  post.status = 'removed';
  await post.save();

  res.json({ removed: true });
});

module.exports = { listPosts, createPost, getPost, addComment, removePost };
