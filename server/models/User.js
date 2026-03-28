const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['visitor', 'subscriber', 'admin'],
    default: 'visitor',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'lapsed', 'cancelled'],
    default: 'inactive',
  },
  subscriptionPlan: {
    type: String,
    enum: ['monthly', 'yearly', 'none'],
    default: 'none',
  },
  subscriptionStart: {
    type: Date,
  },
  subscriptionEnd: {
    type: Date,
  },
  selectedCharity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Charity',
  },
  charityPercentage: {
    type: Number,
    min: 10,
    max: 100,
    default: 10,
  },
  avatar: {
    type: String,
    default: '',
  },
  drawNumbers: {
    type: [Number],
    default: [],
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
