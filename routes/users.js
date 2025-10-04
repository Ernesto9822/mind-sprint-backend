// mind-sprint-backend/routes/users.js
const express = require('express');
const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { firebaseUid, email, name, role } = req.body;
    
    console.log('📝 Registering user in backend:', { email, name });
    
    // Respuesta temporal - luego guardaremos en MongoDB
    res.status(201).json({
      success: true,
      message: 'User registered in backend successfully',
      user: { firebaseUid, email, name, role }
    });
    
  } catch (error) {
    console.error('❌ User registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'client'
    }
  });
});

module.exports = router;