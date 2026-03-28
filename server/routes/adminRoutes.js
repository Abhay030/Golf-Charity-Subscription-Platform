const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getUsers, updateUser, getUserScores,
  configureDraw, simulateDraw, publishDraw,
  createCharity, updateCharity, deleteCharity,
  getWinners, verifyWinner, markPaid,
  getAnalytics,
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/users/:id/scores', getUserScores);

// Draw management
router.post('/draws/configure', configureDraw);
router.post('/draws/simulate', simulateDraw);
router.post('/draws/publish', publishDraw);

// Charity management
router.post('/charities', createCharity);
router.put('/charities/:id', updateCharity);
router.delete('/charities/:id', deleteCharity);

// Winners management
router.get('/winners', getWinners);
router.put('/winners/:id/verify', verifyWinner);
router.put('/winners/:id/pay', markPaid);

// Analytics
router.get('/analytics', getAnalytics);

module.exports = router;
