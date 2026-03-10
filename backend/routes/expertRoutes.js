const express = require('express');
const { body } = require('express-validator');

const { authRequired, requireRole } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const { listExperts, getExpert, upsertMyExpertProfile, setExpertActive, makeUserExpert } = require('../controllers/expertController');

const router = express.Router();

router.get('/', listExperts);
router.get('/:id', getExpert);

router.put('/me', authRequired, requireRole('expert'), validateRequest, upsertMyExpertProfile);

// Admin helpers
router.put('/:id/active', authRequired, requireRole('admin'), body('active').isBoolean(), validateRequest, setExpertActive);
router.post('/make-expert/:userId', authRequired, requireRole('admin'), makeUserExpert);

module.exports = router;
