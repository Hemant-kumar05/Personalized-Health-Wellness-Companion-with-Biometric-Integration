const express = require('express');

const { authRequired } = require('../middleware/auth');
const { getMyGamification, markActiveToday } = require('../controllers/gamificationController');

const router = express.Router();

router.get('/me', authRequired, getMyGamification);
router.post('/me/active', authRequired, markActiveToday);

module.exports = router;
