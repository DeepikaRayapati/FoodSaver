const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const uploadRoutes = require('./routes/upload');
const { initializeSocket } = require('./utils/socket');

const app = express();
const server = http.createServer(app);

// ================= SECURITY =================
app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : '*',
  credentials: true
}));

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ================= BODY PARSER =================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================= STATIC FILES =================
app.use('/uploads', express.static('uploads'));

// ================= DATABASE =================
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// ================= ROUTES =================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoutes);

// ================= PRODUCTION FRONTEND =================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
  });
}

// ================= DEV ROUTES =================
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  app.get("/", (req, res) => {
    res.send("Backend is running successfully 🚀");
  });
}

// ================= SOCKET =================
initializeSocket(server);

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5005;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
