const Score = require('../models/Score');
const User = require('../models/User');

/**
 * Generate draw numbers using random selection
 * @returns {number[]} Array of 5 unique numbers between 1-45
 */
const generateRandomDraw = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Generate draw numbers weighted by score frequency
 * Numbers that appear more/least frequently in user scores get higher weight
 * @returns {number[]} Array of 5 unique numbers between 1-45
 */
const generateAlgorithmicDraw = async () => {
  // Get all scores from active subscribers
  const activeUsers = await User.find({ subscriptionStatus: 'active' }).select('_id');
  const userIds = activeUsers.map(u => u._id);

  const scores = await Score.find({ user: { $in: userIds } });

  // Count frequency of each score value
  const frequency = {};
  for (let i = 1; i <= 45; i++) frequency[i] = 1; // base weight of 1

  scores.forEach(s => {
    frequency[s.value] = (frequency[s.value] || 0) + 1;
  });

  // Create weighted pool — less frequent numbers get higher weight
  const maxFreq = Math.max(...Object.values(frequency));
  const weightedPool = [];

  for (let num = 1; num <= 45; num++) {
    const weight = maxFreq - frequency[num] + 1; // Inverse weighting
    for (let i = 0; i < weight; i++) {
      weightedPool.push(num);
    }
  }

  // Pick 5 unique numbers from weighted pool
  const numbers = new Set();
  while (numbers.size < 5) {
    const idx = Math.floor(Math.random() * weightedPool.length);
    numbers.add(weightedPool[idx]);
  }

  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Match user's score numbers against winning numbers
 * @param {number[]} userNumbers - User's 5 score values
 * @param {number[]} winningNumbers - The 5 winning numbers
 * @returns {{ matchCount: number, matchedNumbers: number[] }}
 */
const matchNumbers = (userNumbers, winningNumbers) => {
  const matched = userNumbers.filter(n => winningNumbers.includes(n));
  return {
    matchCount: matched.length,
    matchedNumbers: matched,
  };
};

/**
 * Calculate prize pool distribution
 * 5-match: 40%, 4-match: 35%, 3-match: 25%
 * @param {number} totalPool 
 * @param {number} jackpotRollover - Previous rollover amount
 * @returns {{ fiveMatch: number, fourMatch: number, threeMatch: number }}
 */
const calculatePrizeDistribution = (totalPool, jackpotRollover = 0) => {
  return {
    fiveMatch: (totalPool * 0.40) + jackpotRollover,
    fourMatch: totalPool * 0.35,
    threeMatch: totalPool * 0.25,
  };
};

module.exports = {
  generateRandomDraw,
  generateAlgorithmicDraw,
  matchNumbers,
  calculatePrizeDistribution,
};
