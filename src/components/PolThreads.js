import React, { useState, useEffect } from 'react';
import './PolThreads.css';
import { useAuth } from './AuthContext';

const PolThreads = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [newThreadsCount, setNewThreadsCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has verified age
    const verificationStatus = localStorage.getItem('pol_age_verified');
    if (verificationStatus === 'true') {
      setAgeVerified(true);
    }

    // If age is verified, fetch threads
    if (ageVerified) {
      fetchThreads();
      
      // Set up polling for new threads count
      const interval = setInterval(() => {
        fetchNewThreadsCount();
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [ageVerified]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the backend API
      // For now, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock thread data
      const mockThreads = Array(15).fill().map((_, index) => ({
        id: `thread-${index}`,
        threadId: `${12345678 + index}`,
        title: `4chan /pol/ Thread ${index + 1}`,
        content: `This is a thread imported from 4chan /pol/ board. Content has been filtered according to community guidelines.`,
        thumbnailUrl: `https://via.placeholder.com/150x150.png?text=POL+${index + 1}`,
        postDate: new Date(Date.now() - index * 3600000).toISOString(),
        postCount: Math.floor(Math.random() * 100) + 5,
        isNew: index < 3 // First 3 threads are new
      }));
      
      setThreads(mockThreads);
      setNewThreadsCount(mockThreads.filter(thread => thread.isNew).length);
    } catch (err) {
      console.error('Error fetching /pol/ threads:', err);
      setError('Failed to load threads from 4chan /pol/. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNewThreadsCount = async () => {
    try {
      // In a real implementation, this would call the backend API
      // For now, we'll use a random number
      const count = Math.floor(Math.random() * 5);
      setNewThreadsCount(count);
    } catch (err) {
      console.error('Error fetching new threads count:', err);
    }
  };

  const handleAgeVerification = () => {
    localStorage.setItem('pol_age_verified', 'true');
    setAgeVerified(true);
  };

  const markThreadAsRead = (threadId) => {
    setThreads(threads.map(thread => 
      thread.threadId === threadId ? { ...thread, isNew: false } : thread
    ));
    
    // Update new threads count
    setNewThreadsCount(prev => Math.max(0, prev - 1));
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
    return <div className="pol-threads-loading">Loading threads from 4chan /pol/...</div>;
  }

  if (error) {
    return <div className="pol-threads-error">{error}</div>;
  }

  return (
    <div className="pol-threads">
      <div className="pol-threads-header">
        <h2 className="pol-threads-title">
          4chan /pol/ Threads
          {newThreadsCount > 0 && (
            <span className="pol-new-threads-badge">{newThreadsCount}</span>
          )}
        </h2>
        <p className="pol-threads-info">
          Threads are automatically imported from 4chan /pol/ and filtered according to community guidelines.
          {!user && <span className="pol-login-prompt"> Please <a href="/login">login</a> to post comments.</span>}
        </p>
      </div>
      
      <div className="pol-threads-grid">
        {threads.map(thread => (
          <a 
            key={thread.threadId} 
            href={`/pol/thread/${thread.threadId}`}
            className="pol-thread-card"
            onClick={() => markThreadAsRead(thread.threadId)}
          >
            <div className="pol-thread-thumbnail">
              <img src={thread.thumbnailUrl} alt={thread.title} />
              {thread.isNew && <div className="pol-thread-new-indicator">1</div>}
            </div>
            
            <div className="pol-thread-info">
              <h3 className="pol-thread-title">{thread.title}</h3>
              <div className="pol-thread-meta">
                <span className="pol-thread-date">
                  {new Date(thread.postDate).toLocaleDateString()}
                </span>
                <span className="pol-thread-replies">
                  {thread.postCount} replies
                </span>
              </div>
              <p className="pol-thread-excerpt">{thread.content.substring(0, 100)}...</p>
            </div>
          </a>
        ))}
      </div>
      
      <div className="pol-threads-footer">
        <p className="pol-threads-disclaimer">
          Content is filtered to comply with community guidelines. Member-only posting is enforced.
        </p>
      </div>
    </div>
  );
};

export default PolThreads;
