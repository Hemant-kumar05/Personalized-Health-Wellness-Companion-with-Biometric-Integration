const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ['active', 'removed'], default: 'active' },
  },
  { timestamps: true }
);

communityPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
