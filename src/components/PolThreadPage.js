import React, { useState, useEffect } from 'react';
import './PolThreadPage.css';
import { useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import CommentSection from './CommentSection';

const PolThreadPage = () => {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has verified age
    const verificationStatus = localStorage.getItem('pol_age_verified');
    if (verificationStatus === 'true') {
      setAgeVerified(true);
    }

    // If age is verified, fetch thread
    if (ageVerified) {
      fetchThread();
    }
  }, [threadId, ageVerified]);

  const fetchThread = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the backend API
      // For now, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock thread data
      const mockThread = {
        id: `thread-${threadId}`,
        threadId,
        title: `4chan /pol/ Thread ${threadId}`,
        content: `This is a thread imported from 4chan /pol/ board. Content has been filtered according to community guidelines. The thread discusses various political topics and current events.`,
        thumbnailUrl: `https://via.placeholder.com/300x200.png?text=POL+${threadId}`,
        imageUrl: `https://via.placeholder.com/800x600.png?text=POL+${threadId}+Full+Image`,
        postDate: new Date().toISOString(),
        postCount: Math.floor(Math.random() * 100) + 10,
        isNew: false
      };
      
      // Mock posts data
      const mockPosts = Array(mockThread.postCount).fill().map((_, index) => ({
        id: `post-${index}`,
        postId: `${12345678 + index}`,
        author: index === 0 ? 'Original Poster (OP)' : `Anonymous${Math.floor(Math.random() * 1000)}`,
        content: index === 0 
          ? mockThread.content 
          : `This is reply #${index} to the thread. All content has been filtered according to community guidelines.`,
        imageUrl: index % 5 === 0 ? `https://via.placeholder.com/300x200.png?text=Reply+${index}` : null,
        postDate: new Date(Date.now() - index * 600000).toISOString(),
        isFiltered: false
      }));
      
      setThread(mockThread);
      setPosts(mockPosts);
    } catch (err) {
      console.error('Error fetching /pol/ thread:', err);
      setError('Failed to load thread from 4chan /pol/. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAgeVerification = () => {
    localStorage.setItem('pol_age_verified', 'true');
    setAgeVerified(true);
  };

  const handleAddComment = (comment) => {
    if (!user) {
      alert('You must be logged in to post comments.');
      return;
    }
    
    // In a real implementation, this would call the backend API
    // For now, we'll just add the comment to the local state
    const newComment = {
      id: `post-${posts.length}`,
      postId: `${Date.now()}`,
      author: user.username || 'Member',
      content: comment,
      imageUrl: null,
      postDate: new Date().toISOString(),
      isFiltered: false
    };
    
    setPosts([...posts, newComment]);
  };

  if (!ageVerified) {
    return (
      <div className="pol-age-verification">
        <div className="pol-age-verification-content">
          <h2>Age Verification Required</h2>
          <p>The content in this section is only suitable for adults (18+).</p>
          <p>By clicking "I am 18 or older", you confirm that you are at least 18 years old.</p>
          
          <div className="pol-age-verification-actions">
            <button 
              className="pol-age-verification-confirm" 
              onClick={handleAgeVerification}
            >
              I am 18 or older
            </button>
            <button 
              className="pol-age-verification-cancel"
              onClick={() => window.history.back()}
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="pol-thread-loading">Loading thread from 4chan /pol/...</div>;
  }

  if (error) {
    return <div className="pol-thread-error">{error}</div>;
  }

  if (!thread) {
    return <div className="pol-thread-not-found">Thread not found</div>;
  }

  return (
    <div className="pol-thread-page">
      <div className="pol-thread-header">
        <h1 className="pol-thread-title">{thread.title}</h1>
        <div className="pol-thread-meta">
          <span className="pol-thread-date">
            Posted on {new Date(thread.postDate).toLocaleDateString()}
          </span>
          <span className="pol-thread-replies">
            {thread.postCount} replies
          </span>
        </div>
      </div>
      
      <div className="pol-thread-content">
        {thread.imageUrl && (
          <div className="pol-thread-image">
            <img src={thread.imageUrl} alt={thread.title} />
          </div>
        )}
        
        <div className="pol-posts-container">
          {posts.map((post, index) => (
            <div key={post.id} className={`pol-post ${index === 0 ? 'pol-post-op' : ''}`}>
              <div className="pol-post-header">
                <span className="pol-post-author">{post.author}</span>
                <span className="pol-post-date">
                  {new Date(post.postDate).toLocaleString()}
                </span>
                <span className="pol-post-id">No. {post.postId}</span>
              </div>
              
              {post.imageUrl && (
                <div className="pol-post-image">
                  <img src={post.imageUrl} alt="" />
                </div>
              )}
              
              <div className="pol-post-content">
                {post.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pol-thread-comment-form">
        {user ? (
          <div className="pol-comment-form">
            <h3>Add a comment</h3>
            <textarea 
              placeholder="Write your comment here..."
              className="pol-comment-textarea"
            ></textarea>
            <div className="pol-comment-actions">
              <button className="pol-comment-submit">Post Comment</button>
            </div>
          </div>
        ) : (
          <div className="pol-login-required">
            <p>You must be <a href="/login">logged in</a> to post comments.</p>
          </div>
        )}
      </div>
      
      <div className="pol-thread-footer">
        <a href="/pol" className="pol-back-button">Back to /pol/ threads</a>
        <p className="pol-thread-disclaimer">
          Content is filtered to comply with community guidelines. Member-only posting is enforced.
        </p>
      </div>
    </div>
  );
};

export default PolThreadPage;
