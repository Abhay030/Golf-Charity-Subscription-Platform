const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateCharity } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/charity', protect, updateCharity);

module.exports = router;
