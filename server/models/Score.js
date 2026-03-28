const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseName: {
    type: String,
    required: [true, 'Please provide the course name'],
    trim: true,
  },
  stablefordPoints: {
    type: Number,
    required: [true, 'Please provide Stableford points'],
    min: [1, 'Score must be at least 1'],
    max: [45, 'Score cannot exceed 45'],
  },
  // Keep legacy 'value' as virtual alias
  value: {
    type: Number,
  },
  datePlayed: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient querying by user
scoreSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);
