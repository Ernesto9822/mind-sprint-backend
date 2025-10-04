// routes/auth.js
const express = require('express');
const router = express.Router();

// Middleware de autenticación básico
const authenticateToken = async (req, res, next) => {
  try {
    // Por ahora es básico, luego integraremos Firebase Admin
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Aquí luego verificaremos con Firebase Admin
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;
    
    req.user = { uid: 'temp-user-id' }; // Temporal
    next();
    
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Endpoint para verificar token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Token is valid',
    user: req.user 
  });
});

module.exports = router;