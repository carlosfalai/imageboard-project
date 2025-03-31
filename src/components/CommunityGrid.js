import React, { useState, useEffect } from 'react';
import './CommunityGrid.css';
import axios from 'axios';

const CommunityGrid = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        
        // In a production environment, this would call the backend API
        // For now, we'll use mock data with real YouTube thumbnails
        
        const mockCommunities = [
          {
            id: 'infowars',
            name: 'InfoWars - Alex Jones',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZTDkajQxPa4sjDOW-c3er1szXkSAO-H9TiF4-8u=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'sample1',
                title: 'Latest InfoWars Video',
                thumbnailUrl: 'https://i.ytimg.com/vi/KpcUMwdRMPk/maxresdefault.jpg'
              }
            ]
          },
          {
            id: 'thenx',
            name: 'THENX - Chris Heria',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQzRuFO_TkNFIjzgYr5AOF-jmqs9xkgKvKwRH4H=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'sample2',
                title: 'Latest THENX Workout',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg'
              }
            ]
          },
          {
            id: 'samshamoun',
            name: 'Sam Shamoun',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZRQfJSpcI_JgGVTlCMvLGzeMXnBwVMeJ9qGwA=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'sample3',
                title: 'Latest Sam Shamoun Video',
                thumbnailUrl: 'https://i.ytimg.com/vi/dQKLFX2zNPg/maxresdefault.jpg'
              }
            ]
          },
          {
            id: 'tate',
            name: 'Tristan & Andrew Tate',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQkTgkXX5dZLyALD-JsLrQWjQu3AqKUZiVPpQ=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'sample4',
                title: 'Latest Tate Brothers Video',
                thumbnailUrl: 'https://i.ytimg.com/vi/BhtZgqp7Xug/maxresdefault.jpg'
              }
            ]
          },
          {
            id: 'freshandfit',
            name: 'Fresh & Fit',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZTcwvZGTmGFhLzJGQWvh_IeI9xPnVz5-QUiSA=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'sample5',
                title: 'Latest Fresh & Fit Podcast',
                thumbnailUrl: 'https://i.ytimg.com/vi/oDd-3MgJdUA/maxresdefault.jpg'
              }
            ]
          },
          {
            id: 'siddhanath',
            name: 'Siddhanath Yoga Parampara',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQzRuFO_TkNFIjzgYr5AOF-jmqs9xkgKvKwRH4H=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'sample6',
                title: 'Latest Siddhanath Yoga Video',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg'
              }
            ]
          },
          {
            id: 'pol',
            name: '4chan /pol/',
            thumbnail: 'https://i.imgur.com/3jCXxGV.png',
            videos: []
          }
        ];
        
        setCommunities(mockCommunities);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) {
    return <div className="community-grid-loading">Loading communities...</div>;
  }

  if (error) {
    return <div className="community-grid-error">{error}</div>;
  }

  return (
    <div className="community-grid">
      {communities.map(community => (
        <a 
          key={community.id} 
          href={`/${community.id}`}
          className="community-card"
        >
          <div className="community-thumbnail">
            <img 
              src={community.thumbnail || `https://via.placeholder.com/300x200?text=${community.name}`} 
              alt={community.name} 
            />
          </div>
          <div className="community-info">
            <h2 className="community-name">{community.name}</h2>
          </div>
        </a>
      ))}
    </div>
  );
};

export default CommunityGrid;
