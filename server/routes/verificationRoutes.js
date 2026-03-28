const express = require('express');
const router = express.Router();
const { uploadProof, getMyVerifications } = require('../controllers/verificationController');
const { protect } = require('../middleware/auth');
const { subscriptionCheck } = require('../middleware/subscription');

router.post('/upload', protect, subscriptionCheck, uploadProof);
router.get('/my', protect, getMyVerifications);

module.exports = router;
