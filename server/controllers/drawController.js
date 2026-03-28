const Draw = require('../models/Draw');
const User = require('../models/User');

// @desc    Get current month draw info
// @route   GET /api/draws/current
exports.getCurrentDraw = async (req, res) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // "2026-03"
    let draw = await Draw.findOne({ month: currentMonth });

    if (!draw) {
      return res.json({ success: true, draw: null, message: 'No draw configured for this month yet' });
    }

    // If not published, don't reveal winning numbers to regular users
    if (draw.status !== 'published' && req.user.role !== 'admin') {
      draw = {
        _id: draw._id,
        month: draw.month,
        status: draw.status,
        prizePool: draw.prizePool,
        totalParticipants: draw.totalParticipants,
      };
    }

    res.json({ success: true, draw });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get draw history
// @route   GET /api/draws/history
exports.getDrawHistory = async (req, res) => {
  try {
    const draws = await Draw.find({ status: 'published' })
      .sort({ month: -1 })
      .limit(12)
      .select('-results');

    res.json({ success: true, draws });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's draw results
// @route   GET /api/draws/my-results
exports.getMyResults = async (req, res) => {
  try {
    const draws = await Draw.find({
      status: 'published',
      'results.user': req.user._id,
    }).sort({ month: -1 });

    const myResults = draws.map(draw => {
      const myResult = draw.results.find(
        r => r.user.toString() === req.user._id.toString()
      );
      return {
        month: draw.month,
        winningNumbers: draw.winningNumbers,
        matchCount: myResult?.matchCount || 0,
        matchedNumbers: myResult?.matchedNumbers || [],
        prize: myResult?.prize || 0,
      };
    });

    res.json({ success: true, results: myResults });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
