import React, { useState } from 'react';
import './CommentSection.css';

const CommentSection = ({ threadId, comments: initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    // In a real implementation, this would call an API
    const newCommentObj = {
      id: Date.now().toString(), // Temporary ID
      threadId,
      content: newComment,
      createdAt: new Date().toISOString(),
      isAnonymous,
      upvotes: 0,
      downvotes: 0,
      reactions: {},
      parentCommentId: replyTo,
      // If image was selected, it would be uploaded and URL stored
      images: image ? [image.name] : []
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    setReplyTo(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
    // Focus on comment input
    document.getElementById('comment-input').focus();
  };

  const handleVote = (commentId, voteType) => {
    // In a real implementation, this would call an API
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        if (voteType === 'up') {
          return { ...comment, upvotes: comment.upvotes + 1 };
        } else {
          return { ...comment, downvotes: comment.downvotes + 1 };
        }
      }
      return comment;
    }));
  };

  const handleReaction = (commentId, reaction) => {
    // In a real implementation, this would call an API
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        const updatedReactions = { ...comment.reactions };
        updatedReactions[reaction] = (updatedReactions[reaction] || 0) + 1;
        return { ...comment, reactions: updatedReactions };
      }
      return comment;
    }));
  };

  // Function to render comments recursively
  const renderComments = (parentId = null) => {
    return comments
      .filter(comment => comment.parentCommentId === parentId)
      .map(comment => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <span className="comment-author">
              {comment.isAnonymous ? 'Anonymous' : 'User123'}
            </span>
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          
          <div className="comment-content">{comment.content}</div>
          
          {comment.images && comment.images.length > 0 && (
            <div className="comment-images">
              {comment.images.map((img, index) => (
                <div key={index} className="comment-image">
                  <img src={`/placeholder-image.jpg`} alt="Comment attachment" />
                </div>
              ))}
            </div>
          )}
          
          <div className="comment-actions">
            <button onClick={() => handleVote(comment.id, 'up')}>
              👍 {comment.upvotes}
            </button>
            <button onClick={() => handleVote(comment.id, 'down')}>
              👎 {comment.downvotes}
            </button>
            <button onClick={() => handleReply(comment.id)}>
              Reply
            </button>
            <div className="comment-reactions">
              {Object.entries(comment.reactions || {}).map(([reaction, count]) => (
                <span key={reaction} className="reaction">
                  {reaction} {count}
                </span>
              ))}
              <div className="reaction-buttons">
                <button onClick={() => handleReaction(comment.id, '❤️')}>❤️</button>
                <button onClick={() => handleReaction(comment.id, '😂')}>😂</button>
                <button onClick={() => handleReaction(comment.id, '😮')}>😮</button>
                <button onClick={() => handleReaction(comment.id, '😢')}>😢</button>
              </div>
            </div>
          </div>
          
          {/* Render replies recursively */}
          <div className="comment-replies">
            {renderComments(comment.id)}
          </div>
        </div>
      ));
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      
      <div className="comments-container">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          renderComments()
        )}
      </div>
      
      <form className="comment-form" onSubmit={handleSubmit}>
        {replyTo && (
          <div className="replying-to">
            Replying to comment. <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
          </div>
        )}
        
        <textarea
          id="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        
        <div className="comment-form-actions">
          <div className="comment-form-options">
            <div className="form-group">
              <input
                type="file"
                id="comment-image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {image && <span className="selected-file">{image.name}</span>}
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="comment-anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="comment-anonymous">Post Anonymously</label>
            </div>
          </div>
          
          <button type="submit" className="submit-button">
            {replyTo ? 'Reply' : 'Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
