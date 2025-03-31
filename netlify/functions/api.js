const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database (in a real implementation, this would use a database)
const users = [];

// Auth routes
app.post('/api/auth/register', async (req, res) => {
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
    
    // Save user
    users.push(newUser);
    
    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
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

app.post('/api/auth/login', async (req, res) => {
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
      process.env.JWT_SECRET || 'your_jwt_secret',
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

app.get('/api/auth/profile', (req, res) => {
  // In a real implementation, this would verify the JWT token
  res.json({
    success: true,
    user: {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      dateJoined: new Date().toISOString(),
      communities: [
        {
          communityId: 'infowars',
          isAnonymous: true
        },
        {
          communityId: 'thenx',
          isAnonymous: false
        }
      ],
      settings: {
        defaultAnonymous: true
      }
    }
  });
});

// YouTube routes
app.get('/api/youtube/feed/:channelId', (req, res) => {
  const { channelId } = req.params;
  
  // Mock data for demonstration
  const videos = [
    {
      id: 'video1',
      videoId: 'dQw4w9WgXcQ',
      title: 'Sample Video 1',
      description: 'This is a sample video description',
      publishedAt: new Date().toISOString(),
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      channelId
    },
    {
      id: 'video2',
      videoId: 'ZTFTngOG2bg',
      title: 'Sample Video 2',
      description: 'Another sample video description',
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      thumbnailUrl: 'https://img.youtube.com/vi/ZTFTngOG2bg/mqdefault.jpg',
      channelId
    }
  ];
  
  res.json({ success: true, videos });
});

// Communities routes
app.get('/api/communities', (req, res) => {
  const communities = [
    { id: 'infowars', name: 'InfoWars - Alex Jones', thumbnail: '/placeholder-infowars.jpg' },
    { id: 'thenx', name: 'THENX - Chris Heria', thumbnail: '/placeholder-thenx.jpg' },
    { id: 'samshamoun', name: 'Sam Shamoun', thumbnail: '/placeholder-samshamoun.jpg' },
    { id: 'tate', name: 'Tristan & Andrew Tate', thumbnail: '/placeholder-tate.jpg' },
    { id: 'freshandfit', name: 'Fresh & Fit', thumbnail: '/placeholder-freshandfit.jpg' },
    { id: 'siddhanath', name: 'Siddhanath Yoga Parampara', thumbnail: '/placeholder-siddhanath.jpg' }
  ];
  
  res.json({ success: true, communities });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Export the serverless function
module.exports.handler = serverless(app);
