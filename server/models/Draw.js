const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    unique: true, // e.g. "2026-03"
  },
  drawType: {
    type: String,
    enum: ['random', 'algorithmic'],
    default: 'random',
  },
  status: {
    type: String,
    enum: ['pending', 'simulated', 'published'],
    default: 'pending',
  },
  winningNumbers: {
    type: [Number],
    default: [],
  },
  results: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    matchCount: Number,
    matchedNumbers: [Number],
    prize: Number,
  }],
  prizePool: {
    total: { type: Number, default: 0 },
    fiveMatch: { type: Number, default: 0 },
    fourMatch: { type: Number, default: 0 },
    threeMatch: { type: Number, default: 0 },
  },
  jackpotRollover: {
    type: Number,
    default: 0,
  },
  totalParticipants: {
    type: Number,
    default: 0,
  },
  executedAt: Date,
  publishedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Draw', drawSchema);
