const User = require('../models/User');
const Score = require('../models/Score');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const WinnerVerification = require('../models/WinnerVerification');
const { generateRandomDraw, generateAlgorithmicDraw, matchNumbers, calculatePrizeDistribution } = require('../utils/drawEngine');

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { search, role, subscriptionStatus } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;
    if (subscriptionStatus) query.subscriptionStatus = subscriptionStatus;

    const users = await User.find(query)
      .populate('selectedCharity', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, subscriptionStatus, subscriptionPlan } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, subscriptionStatus, subscriptionPlan },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user scores (admin)
// @route   GET /api/admin/users/:id/scores
exports.getUserScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.params.id }).sort({ date: -1 });
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== DRAW MANAGEMENT ====================

// @desc    Configure a draw
// @route   POST /api/admin/draws/configure
exports.configureDraw = async (req, res) => {
  try {
    const { month, drawType } = req.body;

    if (!month) {
      return res.status(400).json({ success: false, message: 'Please provide month (e.g. 2026-03)' });
    }

    // Calculate prize pool based on active subscribers
    const activeSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });
    const monthlyRate = 20; // £20/month base
    const poolPercentage = 0.5; // 50% of subs go to prize pool
    const totalPool = activeSubscribers * monthlyRate * poolPercentage;

    // Check for previous jackpot rollover
    const previousDraw = await Draw.findOne({
      month: { $lt: month },
      status: 'published',
    }).sort({ month: -1 });

    const jackpotRollover = previousDraw?.jackpotRollover || 0;
    const distribution = calculatePrizeDistribution(totalPool, jackpotRollover);

    let draw = await Draw.findOne({ month });

    if (draw) {
      draw.drawType = drawType || draw.drawType;
      draw.prizePool = {
        total: totalPool + jackpotRollover,
        fiveMatch: distribution.fiveMatch,
        fourMatch: distribution.fourMatch,
        threeMatch: distribution.threeMatch,
      };
      draw.totalParticipants = activeSubscribers;
      await draw.save();
    } else {
      draw = await Draw.create({
        month,
        drawType: drawType || 'random',
        prizePool: {
          total: totalPool + jackpotRollover,
          fiveMatch: distribution.fiveMatch,
          fourMatch: distribution.fourMatch,
          threeMatch: distribution.threeMatch,
        },
        totalParticipants: activeSubscribers,
      });
    }

    res.json({ success: true, draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Run draw simulation
// @route   POST /api/admin/draws/simulate
exports.simulateDraw = async (req, res) => {
  try {
    const { month } = req.body;
    const draw = await Draw.findOne({ month });

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not configured for this month' });
    }

    // Generate winning numbers
    let winningNumbers;
    if (draw.drawType === 'algorithmic') {
      winningNumbers = await generateAlgorithmicDraw();
    } else {
      winningNumbers = generateRandomDraw();
    }

    // Get all active subscribers with their draw numbers
    const subscribers = await User.find({
      subscriptionStatus: 'active',
      drawNumbers: { $exists: true, $ne: [] },
    });

    // Match each subscriber's numbers
    const results = [];
    subscribers.forEach(user => {
      const { matchCount, matchedNumbers } = matchNumbers(user.drawNumbers, winningNumbers);
      if (matchCount >= 3) {
        results.push({
          user: user._id,
          matchCount,
          matchedNumbers,
          prize: 0, // Will be calculated after counting winners per tier
        });
      }
    });

    // Calculate prizes per tier
    const fiveMatchWinners = results.filter(r => r.matchCount === 5);
    const fourMatchWinners = results.filter(r => r.matchCount === 4);
    const threeMatchWinners = results.filter(r => r.matchCount === 3);

    // Split prize equally among winners in each tier
    if (fiveMatchWinners.length > 0) {
      const prizeEach = draw.prizePool.fiveMatch / fiveMatchWinners.length;
      fiveMatchWinners.forEach(w => w.prize = Math.round(prizeEach * 100) / 100);
    }
    if (fourMatchWinners.length > 0) {
      const prizeEach = draw.prizePool.fourMatch / fourMatchWinners.length;
      fourMatchWinners.forEach(w => w.prize = Math.round(prizeEach * 100) / 100);
    }
    if (threeMatchWinners.length > 0) {
      const prizeEach = draw.prizePool.threeMatch / threeMatchWinners.length;
      threeMatchWinners.forEach(w => w.prize = Math.round(prizeEach * 100) / 100);
    }

    // Jackpot rollover if no 5-match winner
    const newJackpotRollover = fiveMatchWinners.length === 0 ? draw.prizePool.fiveMatch : 0;

    draw.winningNumbers = winningNumbers;
    draw.results = results;
    draw.jackpotRollover = newJackpotRollover;
    draw.status = 'simulated';
    draw.executedAt = new Date();
    await draw.save();

    res.json({
      success: true,
      draw,
      summary: {
        winningNumbers,
        totalWinners: results.length,
        fiveMatch: fiveMatchWinners.length,
        fourMatch: fourMatchWinners.length,
        threeMatch: threeMatchWinners.length,
        jackpotRollover: newJackpotRollover,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Publish draw results
// @route   POST /api/admin/draws/publish
exports.publishDraw = async (req, res) => {
  try {
    const { month } = req.body;
    const draw = await Draw.findOne({ month });

    if (!draw) {
      return res.status(404).json({ success: false, message: 'Draw not found' });
    }

    if (draw.status !== 'simulated') {
      return res.status(400).json({ success: false, message: 'Draw must be simulated before publishing' });
    }

    draw.status = 'published';
    draw.publishedAt = new Date();
    await draw.save();

    // Create WinnerVerification records for all winners
    for (const result of draw.results) {
      await WinnerVerification.create({
        user: result.user,
        draw: draw._id,
        matchCount: result.matchCount,
        prizeAmount: result.prize,
      });
    }

    res.json({ success: true, message: 'Draw results published', draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== CHARITY MANAGEMENT ====================

// @desc    Create charity
// @route   POST /api/admin/charities
exports.createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update charity
// @route   PUT /api/admin/charities/:id
exports.updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    res.json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete charity
// @route   DELETE /api/admin/charities/:id
exports.deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndDelete(req.params.id);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    res.json({ success: true, message: 'Charity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== WINNERS MANAGEMENT ====================

// @desc    Get all winners
// @route   GET /api/admin/winners
exports.getWinners = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const winners = await WinnerVerification.find(query)
      .populate('user', 'name email')
      .populate('draw', 'month winningNumbers')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: winners.length, winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify winner (approve/reject)
// @route   PUT /api/admin/winners/:id/verify
exports.verifyWinner = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const winner = await WinnerVerification.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    ).populate('user', 'name email');

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner verification not found' });
    }

    res.json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark winner as paid
// @route   PUT /api/admin/winners/:id/pay
exports.markPaid = async (req, res) => {
  try {
    const winner = await WinnerVerification.findById(req.params.id);

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winner not found' });
    }

    if (winner.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Winner must be approved before marking as paid' });
    }

    winner.paymentStatus = 'paid';
    await winner.save();

    res.json({ success: true, winner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==================== ANALYTICS ====================

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await User.countDocuments({ subscriptionStatus: 'active' });
    const totalCharities = await Charity.countDocuments();

    // Total prize pool (all published draws)
    const publishedDraws = await Draw.find({ status: 'published' });
    const totalPrizePool = publishedDraws.reduce((sum, d) => sum + d.prizePool.total, 0);
    const totalDraws = publishedDraws.length;

    // Charity contributions
    const charityStats = await Charity.aggregate([
      { $group: { _id: null, totalContributions: { $sum: '$totalContributions' } } }
    ]);

    // Winners stats
    const totalWinners = await WinnerVerification.countDocuments();
    const pendingPayouts = await WinnerVerification.countDocuments({
      status: 'approved',
      paymentStatus: 'pending',
    });

    // Recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role subscriptionStatus createdAt');

    res.json({
      success: true,
      analytics: {
        totalUsers,
        activeSubscribers,
        totalCharities,
        totalPrizePool,
        totalDraws,
        totalCharityContributions: charityStats[0]?.totalContributions || 0,
        totalWinners,
        pendingPayouts,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
