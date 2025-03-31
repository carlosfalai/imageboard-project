const axios = require('axios');
const xml2js = require('xml2js');
const mongoose = require('mongoose');
const cron = require('node-cron');

// YouTube channel IDs for each community
const YOUTUBE_CHANNELS = {
  infowars: 'UCvsye7V9psc-APX6wV1twLg', // InfoWars
  thenx: 'UCqjwF8rxRsotnojGl4gM0Zw', // THENX - Chris Heria
  samshamoun: 'UC9JU55HpvRvCSb1TO2w_eDA', // Sam Shamoun
  tate: 'UCnYMOamNKLGVlJgRUbamveA', // Tristan Tate (example)
  freshandfit: 'UC5sqmi33b7l9kIYa0yASOmQ', // Fresh & Fit
  siddhanath: 'UC9XY5gIZNsWqZzXArUXKcSg' // Siddhanath Yoga Parampara (example)
};

// Thread model (assuming MongoDB is used)
const ThreadSchema = new mongoose.Schema({
  title: String,
  content: String,
  videoId: { type: String, unique: true },
  videoUrl: String,
  thumbnailUrl: String,
  communityId: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

const Thread = mongoose.model('Thread', ThreadSchema);

// Function to fetch YouTube RSS feed for a channel
async function fetchYouTubeRSS(channelId) {
  try {
    const response = await axios.get(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);
    return result.feed.entry || [];
  } catch (error) {
    console.error(`Error fetching YouTube RSS for channel ${channelId}:`, error);
    return [];
  }
}

// Function to create a thread from a YouTube video
async function createThreadFromVideo(video, communityId) {
  try {
    // Extract video information
    const videoId = video['yt:videoId'];
    const title = video.title;
    const content = video.content ? video.content._ : video.summary || '';
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbnailUrl = video['media:group'] && video['media:group']['media:thumbnail'] ? 
                         video['media:group']['media:thumbnail'].$.url : 
                         `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const publishedAt = new Date(video.published);

    // Check if thread already exists for this video
    const existingThread = await Thread.findOne({ videoId });
    if (existingThread) {
      console.log(`Thread already exists for video ${videoId}`);
      return null;
    }

    // Create new thread
    const thread = new Thread({
      title,
      content,
      videoId,
      videoUrl,
      thumbnailUrl,
      communityId,
      publishedAt
    });

    await thread.save();
    console.log(`Created new thread for video ${videoId} in community ${communityId}`);
    return thread;
  } catch (error) {
    console.error('Error creating thread from video:', error);
    return null;
  }
}

// Function to check for new videos and create threads
async function checkForNewVideos() {
  for (const [communityId, channelId] of Object.entries(YOUTUBE_CHANNELS)) {
    console.log(`Checking for new videos in ${communityId} community...`);
    
    const videos = await fetchYouTubeRSS(channelId);
    
    // Process only the 5 most recent videos to avoid creating too many threads at once
    const recentVideos = videos.slice(0, 5);
    
    for (const video of recentVideos) {
      await createThreadFromVideo(video, communityId);
    }
  }
}

// Schedule the check to run every hour
function scheduleYouTubeChecks() {
  cron.schedule('0 * * * *', () => {
    console.log('Running scheduled check for new YouTube videos...');
    checkForNewVideos();
  });
}

// Initial check when the server starts
async function initializeYouTubeIntegration() {
  console.log('Initializing YouTube integration...');
  await checkForNewVideos();
  scheduleYouTubeChecks();
}

module.exports = {
  initializeYouTubeIntegration,
  checkForNewVideos,
  fetchYouTubeRSS
};
