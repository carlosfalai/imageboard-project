# Multi-Imageboard Website Architecture

## Overview
This document outlines the architecture for a multi-imageboard website with a Google Images-like interface, integrating multiple communities with anonymous posting, membership options, and YouTube RSS integration.

## Frontend Architecture

### Landing Page (Google Images-like Interface)
- Grid layout of community thumbnails
- Minimal visuals with focus on content
- Quick navigation between communities
- Search functionality across all imageboards

### Community Pages
Each community (InfoWars, THENX, Sam Shamoun, Tate brothers, Fresh and Fit, Siddhanath Yoga) will have:
- Thread listing in grid format (similar to Google Images)
- Thread categories specific to each community
- YouTube video integration
- Anonymous posting interface
- Image upload functionality
- Reaction system (upvote/downvote, emojis)

### User Interface Components
- Header with navigation and community selector
- Thread creation form
- Image upload component
- Comment/reply system
- User authentication modal
- Profile settings page
- Anonymous/identified toggle per community

### Special Features for Siddhanath Yoga Parampara
- Photoboard feature (members post, everyone views)
- Google Translate widget in header
- Chatbot trained on Gurunath's YouTube transcripts
- Check-in feature for members attending events

## Backend Architecture

### Database Schema

#### User Model
```
User {
  _id: ObjectId,
  username: String,
  email: String,
  password: String (hashed),
  dateJoined: Date,
  communities: [
    {
      communityId: ObjectId,
      isAnonymous: Boolean
    }
  ],
  settings: Object
}
```

#### Community Model
```
Community {
  _id: ObjectId,
  name: String,
  description: String,
  youtubeChannelId: String,
  categories: [String],
  createdAt: Date
}
```

#### Thread Model
```
Thread {
  _id: ObjectId,
  communityId: ObjectId,
  title: String,
  content: String,
  images: [String] (URLs),
  youtubeVideoId: String,
  category: String,
  createdAt: Date,
  userId: ObjectId (null if anonymous),
  isAnonymous: Boolean,
  upvotes: Number,
  downvotes: Number,
  reactions: Object
}
```

#### Comment Model
```
Comment {
  _id: ObjectId,
  threadId: ObjectId,
  content: String,
  images: [String] (URLs),
  createdAt: Date,
  userId: ObjectId (null if anonymous),
  isAnonymous: Boolean,
  upvotes: Number,
  downvotes: Number,
  reactions: Object,
  parentCommentId: ObjectId (null if top-level comment)
}
```

#### Photo Model (for Siddhanath Photoboard)
```
Photo {
  _id: ObjectId,
  albumId: ObjectId,
  title: String,
  description: String,
  imageUrl: String,
  createdAt: Date,
  userId: ObjectId,
  likes: Number,
  comments: [
    {
      userId: ObjectId,
      content: String,
      createdAt: Date
    }
  ]
}
```

#### Album Model (for Siddhanath Photoboard)
```
Album {
  _id: ObjectId,
  title: String,
  description: String,
  createdAt: Date,
  userId: ObjectId,
  photos: [ObjectId]
}
```

### API Endpoints

#### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/logout - Logout user
- GET /api/auth/profile - Get user profile

#### Communities
- GET /api/communities - Get all communities
- GET /api/communities/:id - Get specific community
- GET /api/communities/:id/threads - Get threads for community

#### Threads
- GET /api/threads/:id - Get specific thread with comments
- POST /api/threads - Create new thread
- PUT /api/threads/:id - Update thread
- DELETE /api/threads/:id - Delete thread
- POST /api/threads/:id/vote - Upvote/downvote thread
- POST /api/threads/:id/react - Add reaction to thread

#### Comments
- POST /api/comments - Create new comment
- PUT /api/comments/:id - Update comment
- DELETE /api/comments/:id - Delete comment
- POST /api/comments/:id/vote - Upvote/downvote comment
- POST /api/comments/:id/react - Add reaction to comment

#### YouTube RSS Integration
- GET /api/youtube/feed/:channelId - Get latest videos from channel
- POST /api/youtube/webhook - Webhook for new video notifications

#### Siddhanath Special Features
- GET /api/siddhanath/photos - Get photoboard photos
- POST /api/siddhanath/photos - Upload new photo
- GET /api/siddhanath/albums - Get photo albums
- POST /api/siddhanath/albums - Create new album
- POST /api/siddhanath/checkin - Check in to event
- POST /api/siddhanath/chatbot - Query chatbot

## Technology Stack

### Frontend
- React.js for UI components
- React Router for navigation
- Axios for API requests
- CSS Grid for Google Images-like layout
- LocalStorage for user preferences

### Backend
- Node.js with Express for API server
- MongoDB with Mongoose for database
- JWT for authentication
- YouTube Data API for RSS integration
- Google Translate API for translation widget
- WebSockets for real-time features

### Deployment
- Docker for containerization
- Nginx for reverse proxy
- MongoDB Atlas for database hosting
- AWS S3 for image storage

## Data Flow

1. User visits landing page
2. Frontend loads all communities from API
3. User selects a community
4. Frontend loads threads for selected community
5. User can view threads, create new threads, or comment
6. YouTube RSS service periodically checks for new videos
7. When new video is found, a new thread is automatically created
8. Anonymous posts are stored without user ID
9. Identified posts are stored with user ID but displayed according to user preference

## Security Considerations

- All passwords hashed using bcrypt
- JWT tokens for authentication with short expiry
- CORS configured for API security
- Rate limiting for API endpoints
- Input validation for all user inputs
- XSS protection for user-generated content
- Anonymous posting without tracking information
