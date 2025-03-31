const express = require('express');
const router = express.Router();
const youtubeDataService = require('../services/youtubeDataService');

// Route to get all community data with their videos
router.get('/communities', async (req, res) => {
  try {
    const communities = await youtubeDataService.fetchAllCommunityData();
    res.json({ success: true, communities });
  } catch (error) {
    console.error('Error fetching community data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get a specific community's data with videos
router.get('/community/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const channelId = youtubeDataService.YOUTUBE_CHANNELS[communityId];
    
    if (!channelId) {
      return res.status(404).json({ 
        success: false, 
        error: `Community ${communityId} not found` 
      });
    }
    
    const channelData = await youtubeDataService.fetchYouTubeChannelData(channelId);
    const videos = await youtubeDataService.fetchYouTubeVideos(channelId, 20);
    
    res.json({ 
      success: true, 
      community: {
        id: communityId,
        name: channelData.channelName,
        description: channelData.channelDescription,
        thumbnail: channelData.channelThumbnail,
        channelUrl: channelData.channelUrl,
        videos
      }
    });
  } catch (error) {
    console.error('Error fetching community data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get videos for a specific community
router.get('/videos/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const { limit = 10 } = req.query;
    
    const channelId = youtubeDataService.YOUTUBE_CHANNELS[communityId];
    
    if (!channelId) {
      return res.status(404).json({ 
        success: false, 
        error: `Community ${communityId} not found` 
      });
    }
    
    const videos = await youtubeDataService.fetchYouTubeVideos(channelId, parseInt(limit, 10));
    
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
