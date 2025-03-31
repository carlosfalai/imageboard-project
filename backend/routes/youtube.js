const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtubeService');

// Route to manually trigger check for new videos (for testing)
router.get('/check-new-videos', async (req, res) => {
  try {
    await youtubeService.checkForNewVideos();
    res.json({ success: true, message: 'Check for new videos initiated' });
  } catch (error) {
    console.error('Error checking for new videos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get recent threads created from YouTube videos for a specific community
router.get('/threads/:communityId', async (req, res) => {
  try {
    const { communityId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    
    // This would be replaced with actual database query in production
    // For now, we'll fetch the RSS feed directly
    const channelId = youtubeService.YOUTUBE_CHANNELS[communityId];
    
    if (!channelId) {
      return res.status(404).json({ 
        success: false, 
        error: `Community ${communityId} not found` 
      });
    }
    
    const videos = await youtubeService.fetchYouTubeRSS(channelId);
    
    // Convert videos to thread format
    const threads = videos.slice(0, limit).map(video => ({
      title: video.title,
      videoId: video['yt:videoId'],
      videoUrl: `https://www.youtube.com/watch?v=${video['yt:videoId']}`,
      thumbnailUrl: video['media:group'] && video['media:group']['media:thumbnail'] ? 
                   video['media:group']['media:thumbnail'].$.url : 
                   `https://img.youtube.com/vi/${video['yt:videoId']}/maxresdefault.jpg`,
      publishedAt: new Date(video.published),
      communityId
    }));
    
    res.json({ success: true, threads });
  } catch (error) {
    console.error('Error getting threads:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route to get a specific thread by video ID
router.get('/thread/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    // This would be replaced with actual database query in production
    // For now, we'll return mock data
    const thread = {
      title: 'Example Video Title',
      videoId,
      videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      publishedAt: new Date(),
      communityId: 'infowars',
      comments: []
    };
    
    res.json({ success: true, thread });
  } catch (error) {
    console.error('Error getting thread:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
