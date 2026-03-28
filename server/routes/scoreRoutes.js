const express = require('express');
const router = express.Router();
const { getScores, addScore, updateScore, deleteScore } = require('../controllers/scoreController');
const { protect } = require('../middleware/auth');
const { subscriptionCheck } = require('../middleware/subscription');

router.route('/')
  .get(protect, subscriptionCheck, getScores)
  .post(protect, subscriptionCheck, addScore);

router.route('/:id')
  .put(protect, subscriptionCheck, updateScore)
  .delete(protect, subscriptionCheck, deleteScore);

module.exports = router;
