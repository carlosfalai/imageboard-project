import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './YouTubeThreads.css';

const YouTubeThreads = ({ communityId }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would call the backend API
        // For now, we'll use a mock response based on the YouTube channel IDs
        const channelIds = {
          infowars: 'UCvsye7V9psc-APX6wV1twLg',
          thenx: 'UCqjwF8rxRsotnojGl4gM0Zw',
          samshamoun: 'UC9JU55HpvRvCSb1TO2w_eDA',
          tate: 'UCnYMOamNKLGVlJgRUbamveA',
          freshandfit: 'UC5sqmi33b7l9kIYa0yASOmQ',
          siddhanath: 'UC9XY5gIZNsWqZzXArUXKcSg'
        };
        
        // Simulate API call
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyDummyKey&channelId=${channelIds[communityId]}&part=snippet,id&order=date&maxResults=10`);
        
        // Transform the response to match our thread format
        const mockThreads = Array(5).fill().map((_, index) => ({
          id: `thread-${index}`,
          title: `Latest video from ${communityId} - ${index + 1}`,
          videoId: `video-${index}`,
          videoUrl: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
          thumbnailUrl: `https://via.placeholder.com/480x360.png?text=${communityId}+Video+${index + 1}`,
          publishedAt: new Date(Date.now() - index * 86400000).toISOString(),
          communityId,
          commentCount: Math.floor(Math.random() * 100),
          upvotes: Math.floor(Math.random() * 500),
          downvotes: Math.floor(Math.random() * 50)
        }));
        
        setThreads(mockThreads);
      } catch (err) {
        console.error('Error fetching YouTube threads:', err);
        setError('Failed to load threads from YouTube. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchThreads();
    }
  }, [communityId]);

  if (loading) {
    return <div className="youtube-threads-loading">Loading threads from YouTube...</div>;
  }

  if (error) {
    return <div className="youtube-threads-error">{error}</div>;
  }

  return (
    <div className="youtube-threads">
      <h2 className="youtube-threads-title">Latest Videos from {communityId}</h2>
      
      <div className="youtube-threads-grid">
        {threads.map(thread => (
          <div key={thread.id} className="youtube-thread-card">
            <div className="youtube-thread-thumbnail">
              <img src={thread.thumbnailUrl} alt={thread.title} />
              <div className="youtube-thread-play-button">▶</div>
            </div>
            
            <div className="youtube-thread-info">
              <h3 className="youtube-thread-title">{thread.title}</h3>
              <div className="youtube-thread-meta">
                <span className="youtube-thread-date">
                  {new Date(thread.publishedAt).toLocaleDateString()}
                </span>
                <span className="youtube-thread-comments">
                  💬 {thread.commentCount}
                </span>
              </div>
              
              <div className="youtube-thread-actions">
                <button className="youtube-thread-upvote">
                  👍 {thread.upvotes}
                </button>
                <button className="youtube-thread-downvote">
                  👎 {thread.downvotes}
                </button>
                <button className="youtube-thread-share">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeThreads;
