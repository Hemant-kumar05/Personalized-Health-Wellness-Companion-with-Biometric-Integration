const express = require('express');

const { authRequired } = require('../middleware/auth');
const { generateMyRecommendations, getLatestMyRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

router.post('/generate', authRequired, generateMyRecommendations);
router.get('/latest', authRequired, getLatestMyRecommendations);

module.exports = router;
