import React from 'react';
import './ThreadGrid.css';

const ThreadGrid = ({ threads }) => {
  return (
    <div className="thread-grid">
      {threads.map((thread) => (
        <div key={thread.id} className="thread-card">
          <div className="thread-thumbnail">
            {thread.youtubeVideoId ? (
              <div className="youtube-thumbnail">
                <img 
                  src={`https://img.youtube.com/vi/${thread.youtubeVideoId}/mqdefault.jpg`} 
                  alt={thread.title} 
                />
                <div className="play-icon">▶</div>
              </div>
            ) : thread.images && thread.images.length > 0 ? (
              <img src={thread.images[0]} alt={thread.title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div className="thread-info">
            <h3 className="thread-title">{thread.title}</h3>
            <div className="thread-meta">
              <span className="thread-date">{new Date(thread.createdAt).toLocaleDateString()}</span>
              <div className="thread-stats">
                <span className="upvotes">👍 {thread.upvotes}</span>
                <span className="downvotes">👎 {thread.downvotes}</span>
                <span className="comments">💬 {thread.commentCount}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThreadGrid;
