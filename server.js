require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (sin error si falla)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindsprint')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️ MongoDB connection warning:', err.message));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MindSprint Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ ENDPOINTS BÁSICOS TEMPORALES (sin rutas externas)
app.post('/api/users/register', (req, res) => {
  console.log('📝 User registration:', req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: req.body
  });
});

app.get('/api/mood', (req, res) => {
  res.json({
    success: true,
    entries: [],
    message: 'Mood endpoint working'
  });
});

app.get('/api/homework', (req, res) => {
  res.json({
    success: true,
    homework: [],
    message: 'Homework endpoint working'
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Health check: http://0.0.0.0:${PORT}/api/health`);
});