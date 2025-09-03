// index.js - FIXED VERSION FOR RAILWAY
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createSchoolsTable } = require('./config/database');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

// IMPORTANT: Railway assigns port dynamically - don't hardcode it
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', schoolRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'School Management API is running',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to School Management API',
    endpoints: {
      health: '/health',
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools'
    }
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔧 Setting up database...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Port:', PORT);
    
    // Create database table
    await createSchoolsTable();
    console.log('✅ Database setup complete');
    
    // CRITICAL: Bind to 0.0.0.0 for Railway to work properly
    app.listen(PORT, '0.0.0.0', () => {
      console.log('🚀 Server is running successfully!');
      console.log(`📍 Server running on port: ${PORT}`);
      console.log(`📍 Health check: /health`);
      console.log(`📚 Add School API: POST /api/addSchool`);
      console.log(`📋 List Schools API: GET /api/listSchools`);
      console.log('===============================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});