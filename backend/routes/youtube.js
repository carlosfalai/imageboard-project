const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const router = express.Router();

// YouTube RSS feed URL format
const YOUTUBE_RSS_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id=';

/**
 * Fetch YouTube RSS feed for a specific channel
 * @param {string} channelId - YouTube channel ID
 * @returns {Promise<Array>} - Array of video objects
 */
const fetchYouTubeRSS = async (channelId) => {
  try {
    const response = await axios.get(`${YOUTUBE_RSS_URL}${channelId}`);
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);
    
    // Extract video information from the feed
    const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
    
    return entries.map(entry => {
      // Extract video ID from the link
      const videoId = entry['yt:videoId'];
      
      return {
        id: entry.id,
        videoId,
        title: entry.title,
        description: entry.content ? entry.content._ : '',
        publishedAt: entry.published,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        channelId
      };
    });
  } catch (error) {
    console.error(`Error fetching YouTube RSS feed for channel ${channelId}:`, error);
    throw error;
  }
};

/**
 * Get latest videos from a YouTube channel
 */
router.get('/feed/:channelId', async (req, res) => {
  try {
    const { channelId } = req.params;
    const videos = await fetchYouTubeRSS(channelId);
    res.json({ success: true, videos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Create a new thread from a YouTube video
 */
router.post('/create-thread', async (req, res) => {
  try {
    const { video, communityId } = req.body;
    
    // In a real implementation, this would create a new thread in the database
    // For now, we'll just return a success response
    
    res.json({ 
      success: true, 
      message: 'Thread created successfully',
      thread: {
        id: `thread-${Date.now()}`,
        communityId,
        title: video.title,
        content: video.description,
        youtubeVideoId: video.videoId,
        createdAt: new Date().toISOString(),
        isAnonymous: true,
        upvotes: 0,
        downvotes: 0,
        reactions: {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Webhook endpoint for YouTube notifications
 * This would be used with YouTube's PubSubHubbub to get real-time notifications
 */
router.post('/webhook', async (req, res) => {
  try {
    // Verify the webhook request
    // In a real implementation, this would validate the request from YouTube
    
    // Process the notification
    // For now, we'll just return a success response
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing YouTube webhook:', error);
    res.status(500).send('Error');
  }
});

module.exports = router;
