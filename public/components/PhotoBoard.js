import React, { useState } from 'react';
import './PhotoBoard.css';

const PhotoBoard = ({ albums = [], isLoggedIn = false }) => {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    file: null
  });

  const handleAlbumSelect = (albumId) => {
    setSelectedAlbum(albumId);
    setShowUploadForm(false);
  };

  const handlePhotoUpload = (e) => {
    e.preventDefault();
    // In a real implementation, this would upload the photo to the server
    console.log('Uploading photo:', newPhoto);
    setNewPhoto({ title: '', description: '', file: null });
    setShowUploadForm(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto({
        ...newPhoto,
        file: e.target.files[0]
      });
    }
  };

  const handleLike = (photoId) => {
    // In a real implementation, this would call an API to like the photo
    console.log('Liking photo:', photoId);
  };

  // Find the current album if one is selected
  const currentAlbum = albums.find(album => album.id === selectedAlbum);

  return (
    <div className="photoboard-container">
      <div className="photoboard-header">
        <h2>Siddhanath Yoga Parampara Photo Board</h2>
        <div className="photoboard-actions">
          {isLoggedIn && (
            <button 
              className="upload-button"
              onClick={() => setShowUploadForm(!showUploadForm)}
            >
              {showUploadForm ? 'Cancel Upload' : 'Upload Photo'}
            </button>
          )}
        </div>
      </div>

      {showUploadForm && isLoggedIn && (
        <div className="photo-upload-form">
          <h3>Upload New Photo</h3>
          <form onSubmit={handlePhotoUpload}>
            <div className="form-group">
              <label htmlFor="photo-title">Title</label>
              <input
                type="text"
                id="photo-title"
                value={newPhoto.title}
                onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="photo-description">Description</label>
              <textarea
                id="photo-description"
                value={newPhoto.description}
                onChange={(e) => setNewPhoto({...newPhoto, description: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="photo-file">Photo</label>
              <input
                type="file"
                id="photo-file"
                onChange={handleFileChange}
                accept="image/*"
                required
              />
              {newPhoto.file && (
                <div className="file-preview">
                  Selected: {newPhoto.file.name}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="photo-album">Album</label>
              <select 
                id="photo-album"
                value={selectedAlbum || ''}
                onChange={(e) => setSelectedAlbum(e.target.value)}
                required
              >
                <option value="">Select an album</option>
                {albums.map(album => (
                  <option key={album.id} value={album.id}>
                    {album.title}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="submit-button">Upload Photo</button>
          </form>
        </div>
      )}

      <div className="albums-navigation">
        <h3>Albums</h3>
        <div className="album-list">
          <button 
            className={selectedAlbum === null ? 'active' : ''}
            onClick={() => handleAlbumSelect(null)}
          >
            All Photos
          </button>
          {albums.map(album => (
            <button
              key={album.id}
              className={selectedAlbum === album.id ? 'active' : ''}
              onClick={() => handleAlbumSelect(album.id)}
            >
              {album.title} ({album.photos.length})
            </button>
          ))}
        </div>
      </div>

      <div className="photos-grid">
        {selectedAlbum === null ? (
          // Show all photos from all albums
          albums.flatMap(album => album.photos).map(photo => (
            <div key={photo.id} className="photo-card">
              <div className="photo-image">
                <img src={photo.imageUrl} alt={photo.title} />
              </div>
              <div className="photo-info">
                <h4>{photo.title}</h4>
                <p className="photo-description">{photo.description}</p>
                <div className="photo-meta">
                  <span className="photo-date">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </span>
                  <div className="photo-actions">
                    <button onClick={() => handleLike(photo.id)}>
                      ❤️ {photo.likes}
                    </button>
                    <button>💬 {photo.comments.length}</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Show photos from selected album
          currentAlbum?.photos.map(photo => (
            <div key={photo.id} className="photo-card">
              <div className="photo-image">
                <img src={photo.imageUrl} alt={photo.title} />
              </div>
              <div className="photo-info">
                <h4>{photo.title}</h4>
                <p className="photo-description">{photo.description}</p>
                <div className="photo-meta">
                  <span className="photo-date">
                    {new Date(photo.createdAt).toLocaleDateString()}
                  </span>
                  <div className="photo-actions">
                    <button onClick={() => handleLike(photo.id)}>
                      ❤️ {photo.likes}
                    </button>
                    <button>💬 {photo.comments.length}</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PhotoBoard;
