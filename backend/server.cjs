const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'GROQ_API_KEY', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please make sure all required environment variables are set:');
  console.error('- MONGO_URI: MongoDB connection string');
  console.error('- GROQ_API_KEY: Groq API key for AI features');
  console.error('- JWT_SECRET: Secret key for JWT tokens');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.cjs');
const journalRoutes = require('./routes/Journal.cjs');

// Route mounting
app.use('/api/auth', authRoutes);         // Signup, Login
app.use('/api/journal', journalRoutes);   // Create, fetch, edit, delete journal

// DB Connection
console.log('🔗 Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log('📊 Database:', process.env.MONGO_URI.split('/').pop().split('?')[0]);
}).catch((err) => {
  console.error('❌ MongoDB Connection Failed:', err.message);
  console.error('Please check your MONGO_URI environment variable');
  process.exit(1);
});

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Keys configured: ${process.env.GROQ_API_KEY ? '✅' : '❌'} GROQ_API_KEY`);
  console.log(`🔐 JWT Secret configured: ${process.env.JWT_SECRET ? '✅' : '❌'} JWT_SECRET`);
});
