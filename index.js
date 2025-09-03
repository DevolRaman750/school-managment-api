const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createSchoolsTable } = require('./config/database');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
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
    timestamp: new Date().toISOString()
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

// Handle 404 routes - FIXED VERSION
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
    // Create database table
    await createSchoolsTable();
    console.log('✅ Database setup complete');
    
    app.listen(PORT, () => {
      console.log('🚀 Server is running successfully!');
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 Add School API: POST http://localhost:${PORT}/api/addSchool`);
      console.log(`📋 List Schools API: GET http://localhost:${PORT}/api/listSchools`);
      console.log('===============================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();