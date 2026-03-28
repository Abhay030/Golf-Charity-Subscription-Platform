const express = require('express');
const router = express.Router();
const { getCharities, getCharity, getFeaturedCharities } = require('../controllers/charityController');

router.get('/', getCharities);
router.get('/featured', getFeaturedCharities);
router.get('/:id', getCharity);

module.exports = router;
