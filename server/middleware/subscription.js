const subscriptionCheck = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next(); // Admins bypass subscription check
  }

  if (req.user.subscriptionStatus !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Active subscription required to access this feature',
    });
  }

  // Check if subscription has expired
  if (req.user.subscriptionEnd && new Date(req.user.subscriptionEnd) < new Date()) {
    return res.status(403).json({
      success: false,
      message: 'Your subscription has expired. Please renew to continue.',
    });
  }

  next();
};

module.exports = { subscriptionCheck };
