// authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        userType: 'user'  // Assign default type
      });
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});



exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User does not exist. Please register', register: true });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token including userType
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.SECRET_KEY,
      { expiresIn: '15d' }
    );

  

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id.toString(),
      userType: user.userType // Include userType in the response
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.register = async (req, res) => {
  const { firstName, lastName, userName,email, password, userType } = req.body;

  if (!firstName || !lastName || !email || !password || !userType ||!userName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 8);

    // Create a new user with userType
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashPassword,
      userType
    });

    // Generate a JWT token including userType
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.SECRET_KEY,
      { expiresIn: '15d' }
    );

    

    res.status(201).json({
      message: 'Registration successful',
      token,
      userId: user._id.toString(),
      userName,
      userType 
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
