import React, { useState, useEffect } from 'react';
import './ThreadPage.css';
import CommentSection from './CommentSection';
import { useParams } from 'react-router-dom';

const ThreadPage = () => {
  const { videoId } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would call the backend API
        // For now, we'll use mock data
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock thread data
        const mockThread = {
          id: `thread-${videoId}`,
          title: `YouTube Video Thread - ${videoId}`,
          videoId,
          videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          publishedAt: new Date().toISOString(),
          communityId: 'infowars', // This would be determined from the actual video
          description: 'This is a thread automatically created from a YouTube video. The description would contain information from the video description.',
          upvotes: 125,
          downvotes: 12,
          comments: Array(10).fill().map((_, index) => ({
            id: `comment-${index}`,
            author: `Anonymous${index + 1}`,
            content: `This is comment #${index + 1} on this thread. The comments section allows for anonymous posting with upvoting, downvoting, and emoji reactions.`,
            timestamp: new Date(Date.now() - index * 3600000).toISOString(),
            upvotes: Math.floor(Math.random() * 50),
            downvotes: Math.floor(Math.random() * 10),
            reactions: {
              '👍': Math.floor(Math.random() * 20),
              '❤️': Math.floor(Math.random() * 15),
              '😂': Math.floor(Math.random() * 10),
              '😮': Math.floor(Math.random() * 5),
              '😡': Math.floor(Math.random() * 3)
            }
          }))
        };
        
        setThread(mockThread);
      } catch (err) {
        console.error('Error fetching thread:', err);
        setError('Failed to load thread. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchThread();
    }
  }, [videoId]);

  if (loading) {
    return <div className="thread-loading">Loading thread...</div>;
  }

  if (error) {
    return <div className="thread-error">{error}</div>;
  }

  if (!thread) {
    return <div className="thread-not-found">Thread not found</div>;
  }

  return (
    <div className="thread-page">
      <div className="thread-content">
        <h1 className="thread-title">{thread.title}</h1>
        
        <div className="thread-meta">
          <span className="thread-date">
            Posted on {new Date(thread.publishedAt).toLocaleDateString()}
          </span>
          <span className="thread-community">
            in <a href={`/community/${thread.communityId}`}>{thread.communityId}</a>
          </span>
        </div>
        
        <div className="thread-video-container">
          <iframe 
            className="thread-video"
            src={`https://www.youtube.com/embed/${thread.videoId}`}
            title={thread.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="thread-description">
          {thread.description}
        </div>
        
        <div className="thread-actions">
          <button className="thread-upvote">
            👍 {thread.upvotes}
          </button>
          <button className="thread-downvote">
            👎 {thread.downvotes}
          </button>
          <button className="thread-share">
            Share
          </button>
        </div>
      </div>
      
      <CommentSection comments={thread.comments} threadId={thread.id} />
    </div>
  );
};

export default ThreadPage;
