import React, { useState, useEffect } from 'react';
import './YouTubeRSSFeed.css';

const YouTubeRSSFeed = ({ channelId, onNewVideo }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // In a real implementation, this would fetch the RSS feed from YouTube
    // For demonstration purposes, we're simulating the fetch
    const fetchYouTubeRSS = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real implementation, this would come from the YouTube RSS feed
        const mockVideos = [
          {
            id: 'video1',
            videoId: 'dQw4w9WgXcQ',
            title: 'Sample Video 1',
            description: 'This is a sample video description',
            publishedAt: new Date().toISOString(),
            thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg'
          },
          {
            id: 'video2',
            videoId: 'ZTFTngOG2bg',
            title: 'Sample Video 2',
            description: 'Another sample video description',
            publishedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            thumbnailUrl: 'https://img.youtube.com/vi/ZTFTngOG2bg/mqdefault.jpg'
          }
        ];
        
        setVideos(mockVideos);
        
        // Notify parent component about new videos
        // In a real implementation, this would only trigger for videos not already in the database
        mockVideos.forEach(video => {
          onNewVideo(video);
        });
        
      } catch (err) {
        console.error('Error fetching YouTube RSS feed:', err);
        setError('Failed to fetch YouTube videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchYouTubeRSS();
    
    // Set up periodic checking for new videos
    const intervalId = setInterval(() => {
      fetchYouTubeRSS();
    }, 3600000); // Check every hour
    
    return () => clearInterval(intervalId);
  }, [channelId, onNewVideo]);

  if (loading && videos.length === 0) {
    return <div className="youtube-rss-loading">Loading videos...</div>;
  }

  if (error) {
    return <div className="youtube-rss-error">{error}</div>;
  }

  return (
    <div className="youtube-rss-feed">
      <h3>Latest YouTube Videos</h3>
      <div className="youtube-videos-grid">
        {videos.map(video => (
          <div key={video.id} className="youtube-video-card">
            <div className="youtube-thumbnail">
              <img src={video.thumbnailUrl} alt={video.title} />
              <div className="play-icon">▶</div>
            </div>
            <div className="youtube-video-info">
              <h4 className="youtube-video-title">{video.title}</h4>
              <p className="youtube-video-date">
                {new Date(video.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeRSSFeed;
