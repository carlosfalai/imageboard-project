const axios = require('axios');
const cheerio = require('cheerio');

// YouTube channel IDs for each community
const YOUTUBE_CHANNELS = {
  infowars: 'UCvsye7V9psc-APX6wV1twLg', // InfoWars
  thenx: 'UCqjwF8rxRsotnojGl4gM0Zw', // THENX - Chris Heria
  samshamoun: 'UC9JU55HpvRvCSb1TO2w_eDA', // Sam Shamoun
  tate: 'UCnYMOamNKLGVlJgRUbamveA', // Tristan Tate (example)
  freshandfit: 'UC5sqmi33b7l9kIYa0yASOmQ', // Fresh & Fit
  siddhanath: 'UC9XY5gIZNsWqZzXArUXKcSg' // Siddhanath Yoga Parampara (example)
};

// Function to fetch YouTube channel data
async function fetchYouTubeChannelData(channelId) {
  try {
    // First, get the channel page
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;
    const response = await axios.get(channelUrl);
    const $ = cheerio.load(response.data);
    
    // Extract channel information
    const channelName = $('meta[property="og:title"]').attr('content') || '';
    const channelDescription = $('meta[property="og:description"]').attr('content') || '';
    const channelThumbnail = $('meta[property="og:image"]').attr('content') || '';
    
    return {
      channelId,
      channelName,
      channelDescription,
      channelThumbnail,
      channelUrl
    };
  } catch (error) {
    console.error(`Error fetching YouTube channel data for ${channelId}:`, error);
    return {
      channelId,
      channelName: 'Channel not available',
      channelDescription: '',
      channelThumbnail: '',
      channelUrl: `https://www.youtube.com/channel/${channelId}`
    };
  }
}

// Function to fetch recent videos from a YouTube channel
async function fetchYouTubeVideos(channelId, maxResults = 10) {
  try {
    // Use YouTube's RSS feed for the channel
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const response = await axios.get(rssUrl);
    const $ = cheerio.load(response.data, { xmlMode: true });
    
    const videos = [];
    
    $('entry').each((i, entry) => {
      if (i >= maxResults) return false;
      
      const videoId = $(entry).find('yt\\:videoId').text();
      const title = $(entry).find('title').text();
      const link = $(entry).find('link').attr('href');
      const published = $(entry).find('published').text();
      const updated = $(entry).find('updated').text();
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      
      videos.push({
        videoId,
        title,
        link,
        published,
        updated,
        thumbnailUrl
      });
    });
    
    return videos;
  } catch (error) {
    console.error(`Error fetching YouTube videos for ${channelId}:`, error);
    return [];
  }
}

// Function to fetch all community data with their videos
async function fetchAllCommunityData() {
  const communities = [];
  
  for (const [communityId, channelId] of Object.entries(YOUTUBE_CHANNELS)) {
    try {
      const channelData = await fetchYouTubeChannelData(channelId);
      const videos = await fetchYouTubeVideos(channelId, 5);
      
      communities.push({
        id: communityId,
        name: channelData.channelName,
        description: channelData.channelDescription,
        thumbnail: channelData.channelThumbnail,
        channelUrl: channelData.channelUrl,
        videos
      });
    } catch (error) {
      console.error(`Error processing community ${communityId}:`, error);
    }
  }
  
  return communities;
}

module.exports = {
  fetchYouTubeChannelData,
  fetchYouTubeVideos,
  fetchAllCommunityData,
  YOUTUBE_CHANNELS
};
