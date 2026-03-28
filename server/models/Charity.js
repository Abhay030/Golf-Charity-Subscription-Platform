const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide charity name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'General',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  website: {
    type: String,
    default: '',
  },
  events: [{
    title: String,
    date: Date,
    description: String,
  }],
  totalContributions: {
    type: Number,
    default: 0,
  },
  subscriberCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Charity', charitySchema);
