const express = require('express');
const cors = require('cors');

// Create a test app without database connection
function createTestApp() {
  const app = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Routes
  const authRoutes = require('../routes/auth.cjs');
  const journalRoutes = require('../routes/Journal.cjs');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/journal', journalRoutes);
  
  return app;
}

module.exports = { createTestApp };
