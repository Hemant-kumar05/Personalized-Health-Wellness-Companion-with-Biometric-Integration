const express = require('express');

const { authRequired } = require('../middleware/auth');
const { getSummary } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/summary', authRequired, getSummary);

module.exports = router;
