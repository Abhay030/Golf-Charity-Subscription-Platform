const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, 'https://golf-charity-subscription-platform.vercel.app'] 
    : 'http://localhost:5173',
  credentials: true,
}));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/charities', require('./routes/charityRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/draws', require('./routes/drawRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/verification', require('./routes/verificationRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Use API routes for api paths, otherwise return index.html
  app.get('*', (req, res) => {
    // Only send the index.html for non-api routes
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API route not found' });
    }
  });
} else {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
