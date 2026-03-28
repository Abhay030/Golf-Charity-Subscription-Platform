const express = require('express');
const router = express.Router();
const { getStatus, subscribe, cancelSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/status', protect, getStatus);
router.post('/subscribe', protect, subscribe);
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
