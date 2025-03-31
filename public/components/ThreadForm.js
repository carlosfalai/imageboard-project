import React, { useState } from 'react';
import './ThreadForm.css';

const ThreadForm = ({ communityId, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleImageChange = (e) => {
    // In a real implementation, this would handle file uploads
    // For now, we'll just store the file names
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const extractYoutubeId = (url) => {
    // Extract YouTube video ID from URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Extract YouTube ID if URL is provided
    const youtubeVideoId = youtubeUrl ? extractYoutubeId(youtubeUrl) : null;
    
    // Create thread object
    const threadData = {
      communityId,
      title,
      content,
      images, // In a real implementation, these would be uploaded and URLs stored
      youtubeVideoId,
      category,
      isAnonymous
    };
    
    onSubmit(threadData);
    
    // Reset form
    setTitle('');
    setContent('');
    setImages([]);
    setYoutubeUrl('');
    setCategory('');
    setIsAnonymous(true);
  };

  return (
    <div className="thread-form-container">
      <h2>Create New Thread</h2>
      <form className="thread-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="youtubeUrl">YouTube URL (optional)</label>
          <input
            type="text"
            id="youtubeUrl"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="images">Upload Images (optional)</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            accept="image/*"
          />
          <div className="image-preview">
            {images.length > 0 && (
              <p>{images.length} image(s) selected</p>
            )}
          </div>
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous">Post Anonymously</label>
        </div>
        
        <button type="submit" className="submit-button">Create Thread</button>
      </form>
    </div>
  );
};

export default ThreadForm;
