const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('selectedCharity');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).populate('selectedCharity');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update charity selection and percentage
// @route   PUT /api/users/charity
exports.updateCharity = async (req, res) => {
  try {
    const { selectedCharity, charityPercentage } = req.body;

    if (charityPercentage && charityPercentage < 10) {
      return res.status(400).json({
        success: false,
        message: 'Minimum charity contribution is 10%',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { selectedCharity, charityPercentage },
      { new: true, runValidators: true }
    ).populate('selectedCharity');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
