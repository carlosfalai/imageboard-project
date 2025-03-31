const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user database (in a real implementation, this would use MongoDB)
const users = [];

/**
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email || user.username === username);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists with that email or username' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      dateJoined: new Date().toISOString(),
      communities: [],
      settings: {
        defaultAnonymous: true
      }
    };
    
    // Save user (in a real implementation, this would save to MongoDB)
    users.push(newUser);
    
    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      'your_jwt_secret', // In a real implementation, this would be an environment variable
      { expiresIn: '1d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        dateJoined: newUser.dateJoined,
        communities: newUser.communities,
        settings: newUser.settings
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Login user
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      'your_jwt_secret', // In a real implementation, this would be an environment variable
      { expiresIn: '1d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        dateJoined: user.dateJoined,
        communities: user.communities,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get current user profile
 */
router.get('/profile', (req, res) => {
  try {
    // In a real implementation, this would verify the JWT token
    // and return the user profile
    
    // For now, we'll just return a mock user
    res.json({
      success: true,
      user: {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        dateJoined: new Date().toISOString(),
        communities: [
          {
            communityId: 'community-1',
            isAnonymous: true
          },
          {
            communityId: 'community-2',
            isAnonymous: false
          }
        ],
        settings: {
          defaultAnonymous: true
        }
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update user anonymity settings for a community
 */
router.put('/community-settings', (req, res) => {
  try {
    const { communityId, isAnonymous } = req.body;
    
    // In a real implementation, this would update the user's settings in the database
    
    res.json({
      success: true,
      message: 'Community settings updated successfully',
      settings: {
        communityId,
        isAnonymous
      }
    });
  } catch (error) {
    console.error('Error updating community settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Logout user
 */
router.get('/logout', (req, res) => {
  // In a real implementation, this might invalidate the token
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
