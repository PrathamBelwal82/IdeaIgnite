const express = require('express');
const { login,register } = require('../controllers/authController');

const router = express.Router();
const passport = require('passport');

router.post('/register', register);
router.post('/login', login);

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token after successful Google authentication
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, userType: req.user.userType },
      process.env.SECRET_KEY,
      { expiresIn: '15d' }
    );

    // Send the token and user details
    res.redirect(`/auth/google/success?token=${token}&userId=${req.user._id}&userType=${req.user.userType}`);
  }
);
module.exports = router;
