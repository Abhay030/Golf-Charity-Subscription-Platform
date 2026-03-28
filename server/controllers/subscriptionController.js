const User = require('../models/User');

// @desc    Get subscription status
// @route   GET /api/subscription/status
exports.getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      subscription: {
        status: user.subscriptionStatus,
        plan: user.subscriptionPlan,
        startDate: user.subscriptionStart,
        endDate: user.subscriptionEnd,
        daysRemaining: user.subscriptionEnd
          ? Math.max(0, Math.ceil((new Date(user.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24)))
          : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Subscribe (simulated payment)
// @route   POST /api/subscription/subscribe
exports.subscribe = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan. Choose monthly or yearly.' });
    }

    const now = new Date();
    const endDate = new Date(now);

    if (plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionStatus: 'active',
        subscriptionPlan: plan,
        subscriptionStart: now,
        subscriptionEnd: endDate,
        role: 'subscriber',
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Successfully subscribed to ${plan} plan`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionStatus: 'cancelled',
        subscriptionPlan: 'none',
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

