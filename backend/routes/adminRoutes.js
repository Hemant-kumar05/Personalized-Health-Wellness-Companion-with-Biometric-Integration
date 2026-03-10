const express = require('express');

const { authRequired, requireRole } = require('../middleware/auth');
const { listUsers, platformStats, removeCommunityPost } = require('../controllers/adminController');

const router = express.Router();

router.get('/users', authRequired, requireRole('admin'), listUsers);
router.get('/stats', authRequired, requireRole('admin'), platformStats);
router.delete('/community/posts/:id', authRequired, requireRole('admin'), removeCommunityPost);

module.exports = router;
