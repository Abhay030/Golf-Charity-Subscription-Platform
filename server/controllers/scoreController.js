const Score = require('../models/Score');

// @desc    Get user scores (latest 5, reverse chronological)
// @route   GET /api/scores
exports.getScores = async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id })
      .sort({ datePlayed: -1 })
      .limit(5);

    res.json({ success: true, count: scores.length, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a score (rolling 5 — deletes oldest if already 5)
// @route   POST /api/scores
exports.addScore = async (req, res) => {
  try {
    const { courseName, stablefordPoints, datePlayed } = req.body;

    const points = Number(stablefordPoints);

    if (!courseName || !stablefordPoints) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course name and Stableford points',
      });
    }

    if (points < 1 || points > 45) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 1 and 45 (Stableford format)',
      });
    }

    // Check current count
    const currentScores = await Score.find({ user: req.user._id }).sort({ datePlayed: 1 });

    // If already 5 scores, remove the oldest
    if (currentScores.length >= 5) {
      await Score.findByIdAndDelete(currentScores[0]._id);
    }

    const score = await Score.create({
      user: req.user._id,
      courseName,
      stablefordPoints: points,
      value: points,
      datePlayed: datePlayed || Date.now(),
    });

    // Update user drawNumbers (latest 5 score values)
    const User = require('../models/User');
    const latestScores = await Score.find({ user: req.user._id }).sort({ datePlayed: -1 }).limit(5);
    await User.findByIdAndUpdate(req.user._id, {
      drawNumbers: latestScores.map(s => s.stablefordPoints),
    });

    res.status(201).json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a score
// @route   PUT /api/scores/:id
exports.updateScore = async (req, res) => {
  try {
    const { courseName, stablefordPoints, datePlayed } = req.body;

    let score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ success: false, message: 'Score not found' });
    }

    // Verify ownership
    if (score.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const points = stablefordPoints ? Number(stablefordPoints) : undefined;
    if (points && (points < 1 || points > 45)) {
      return res.status(400).json({
        success: false,
        message: 'Score must be between 1 and 45',
      });
    }

    const updateData = {};
    if (courseName) updateData.courseName = courseName;
    if (points) { updateData.stablefordPoints = points; updateData.value = points; }
    if (datePlayed) updateData.datePlayed = datePlayed;

    score = await Score.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update user drawNumbers
    const User = require('../models/User');
    const latestScores = await Score.find({ user: req.user._id }).sort({ datePlayed: -1 }).limit(5);
    await User.findByIdAndUpdate(req.user._id, {
      drawNumbers: latestScores.map(s => s.stablefordPoints),
    });

    res.json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a score
// @route   DELETE /api/scores/:id
exports.deleteScore = async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ success: false, message: 'Score not found' });
    }

    if (score.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Score.findByIdAndDelete(req.params.id);

    // Update user drawNumbers
    const User = require('../models/User');
    const latestScores = await Score.find({ user: req.user._id }).sort({ datePlayed: -1 }).limit(5);
    await User.findByIdAndUpdate(req.user._id, {
      drawNumbers: latestScores.map(s => s.stablefordPoints),
    });

    res.json({ success: true, message: 'Score deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
