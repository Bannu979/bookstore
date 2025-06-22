const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const connectDB = require('./config/db');

// Load environment variables from .env file in the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

// Check for required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is required!');
  console.log('📝 Please create a .env file in the backend directory with the following content:');
  console.log('MONGO_URI=mongodb://localhost:27017/bookstore');
  console.log('PORT=5000');
  console.log('NODE_ENV=development');
  console.log('CORS_ORIGIN=http://localhost:3000');
  process.exit(1);
}

connectDB();

const app = express();

const whitelist =
  process.env.NODE_ENV === 'production'
    ? [
        'https://bookstore-1fuj.vercel.app',
        'https://bookstore-1fuj-6mho7xza4-bprabhas979-gmailcoms-projects.vercel.app',
      ]
    : ['http://localhost:3000', 'http://localhost:3001'];

console.log('CORS whitelist:', whitelist);

// CORS configuration - MUST BE FIRST, before any other middleware
app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting - much more lenient for development
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10000, // much higher limit for development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
});
app.use(limiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Welcome route for the root URL
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Book Store API! 🎉',
    version: '1.0.0',
    documentation: 'Visit /api for endpoint details.',
    healthCheck: '/health'
  });
});

// Routes
app.use('/api/books', bookRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Book Store API',
    version: '1.0.0',
    endpoints: {
      'GET /api/books': 'Get all books',
      'POST /api/books': 'Create a new book',
      'PUT /api/books/:id': 'Update a book',
      'DELETE /api/books/:id': 'Delete a book'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not valid'
    });
  }
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Book Store API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});