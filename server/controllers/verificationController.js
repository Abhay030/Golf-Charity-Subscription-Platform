const WinnerVerification = require('../models/WinnerVerification');

// @desc    Upload proof of winning
// @route   POST /api/verification/upload
exports.uploadProof = async (req, res) => {
  try {
    const { drawId, proofImage } = req.body;

    const verification = await WinnerVerification.findOne({
      user: req.user._id,
      draw: drawId,
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: 'No winner record found for this draw',
      });
    }

    verification.proofImage = proofImage;
    verification.status = 'pending';
    await verification.save();

    res.json({ success: true, verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's verifications
// @route   GET /api/verification/my
exports.getMyVerifications = async (req, res) => {
  try {
    const verifications = await WinnerVerification.find({ user: req.user._id })
      .populate('draw', 'month winningNumbers')
      .sort({ createdAt: -1 });

    res.json({ success: true, verifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
