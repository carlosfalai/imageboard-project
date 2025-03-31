# Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account
- Access tokens for both services

## Steps to Deploy

### 1. Push the Project to GitHub

First, create a new GitHub repository and push the project code:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/imageboard-project.git

# Push to GitHub
git push -u origin main
```

### 2. Connect Netlify to GitHub

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select the imageboard-project repository
6. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
7. Click "Deploy site"

### 3. Configure Environment Variables

In the Netlify dashboard for your site:

1. Go to Site settings > Build & deploy > Environment
2. Add the following environment variables:
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `NODE_ENV`: Set to "production"

### 4. Set Up Continuous Deployment

Netlify automatically sets up continuous deployment. Any changes pushed to your GitHub repository will trigger a new build and deployment.

### 5. Custom Domain (Optional)

1. In the Netlify dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Netlify build logs for errors
2. Verify that all environment variables are correctly set
3. Ensure the serverless functions are properly configured
4. Check that the redirects in netlify.toml are correctly routing API requests

## Updating the Site

To update the site after making changes:

1. Make your changes locally
2. Commit the changes to git
3. Push to GitHub
4. Netlify will automatically rebuild and deploy the site

## Monitoring

After deployment, monitor your site's performance and functionality using Netlify's analytics and logging tools.
