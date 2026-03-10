const express = require('express');
const { body } = require('express-validator');

const { authRequired } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { listPosts, createPost, getPost, addComment, removePost } = require('../controllers/communityController');

const router = express.Router();

router.get('/posts', listPosts);
router.post('/posts', authRequired, body('title').isString().isLength({ min: 2 }), body('body').isString().isLength({ min: 1 }), validateRequest, createPost);
router.get('/posts/:id', getPost);
router.delete('/posts/:id', authRequired, removePost);

router.post('/posts/:id/comments', authRequired, body('body').isString().isLength({ min: 1 }), validateRequest, addComment);

module.exports = router;
