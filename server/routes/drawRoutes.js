const express = require('express');
const router = express.Router();
const { getCurrentDraw, getDrawHistory, getMyResults } = require('../controllers/drawController');
const { protect } = require('../middleware/auth');
const { subscriptionCheck } = require('../middleware/subscription');

router.get('/current', protect, subscriptionCheck, getCurrentDraw);
router.get('/history', protect, subscriptionCheck, getDrawHistory);
router.get('/my-results', protect, subscriptionCheck, getMyResults);

module.exports = router;
