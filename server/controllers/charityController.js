const Charity = require('../models/Charity');

// @desc    Get all charities
// @route   GET /api/charities
exports.getCharities = async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (featured === 'true') {
      query.featured = true;
    }

    const charities = await Charity.find(query).sort({ featured: -1, name: 1 });
    res.json({ success: true, count: charities.length, charities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single charity
// @route   GET /api/charities/:id
exports.getCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }
    res.json({ success: true, charity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured charities (for homepage)
// @route   GET /api/charities/featured
exports.getFeaturedCharities = async (req, res) => {
  try {
    const charities = await Charity.find({ featured: true }).limit(6);
    res.json({ success: true, charities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
