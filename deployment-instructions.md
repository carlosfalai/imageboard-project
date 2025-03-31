# Deployment Instructions

## Local Development Setup

1. Clone the repository
```
git clone <repository-url>
cd imageboard-project
```

2. Install backend dependencies
```
npm install
```

3. Install frontend dependencies
```
cd frontend
npm install
cd ..
```

4. Create a .env file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

5. Run the development server
```
npm run dev
```

## Production Deployment

### Backend Deployment

1. Set up a MongoDB Atlas database
2. Deploy the backend to a hosting service like Heroku, AWS, or DigitalOcean
3. Set the following environment variables on your hosting service:
   - PORT
   - NODE_ENV=production
   - JWT_SECRET
   - MONGO_URI

### Frontend Deployment

1. Build the React application
```
npm run build
```

2. Deploy the build folder to a static hosting service like Netlify, Vercel, or AWS S3
3. Configure the frontend to use the production backend API URL

## Docker Deployment (Alternative)

1. Create a Dockerfile in the root directory
2. Build the Docker image
```
docker build -t imageboard-project .
```

3. Run the Docker container
```
docker run -p 5000:5000 imageboard-project
```

## Updating the Deployment

1. Pull the latest changes from the repository
2. Install any new dependencies
3. Build the frontend
4. Deploy the updated build to your hosting service
