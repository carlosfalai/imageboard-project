import React, { useState, useEffect } from 'react';
import './CommunityPage.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CommunityPage = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        setLoading(true);
        
        // In a production environment, this would call the backend API
        // For now, we'll use mock data with real YouTube thumbnails
        
        // Map of community IDs to their data
        const communityData = {
          'infowars': {
            id: 'infowars',
            name: 'InfoWars - Alex Jones',
            description: 'Official InfoWars channel featuring Alex Jones',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZTDkajQxPa4sjDOW-c3er1szXkSAO-H9TiF4-8u=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'KpcUMwdRMPk',
                title: 'The Great Reset Is Here: Surviving The NWO',
                thumbnailUrl: 'https://i.ytimg.com/vi/KpcUMwdRMPk/maxresdefault.jpg',
                published: '2023-05-15T18:00:00Z'
              },
              {
                videoId: 'dQw4w9WgXcQ',
                title: 'Times Alex Jones Was Right',
                thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                published: '2023-05-10T15:30:00Z'
              },
              {
                videoId: 'KpcUMwdRMPk',
                title: 'The Truth About Globalism',
                thumbnailUrl: 'https://i.ytimg.com/vi/KpcUMwdRMPk/maxresdefault.jpg',
                published: '2023-05-05T12:00:00Z'
              }
            ]
          },
          'thenx': {
            id: 'thenx',
            name: 'THENX - Chris Heria',
            description: 'Calisthenics & Fitness with Chris Heria',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQzRuFO_TkNFIjzgYr5AOF-jmqs9xkgKvKwRH4H=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'jYp1nUEGf8M',
                title: '10 Minute Home Ab Workout',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg',
                published: '2023-05-18T14:00:00Z'
              },
              {
                videoId: 'jYp1nUEGf8M',
                title: 'Full Body Workout Routine',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg',
                published: '2023-05-12T16:30:00Z'
              },
              {
                videoId: 'jYp1nUEGf8M',
                title: 'How to Get Your First Muscle Up',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg',
                published: '2023-05-08T13:45:00Z'
              }
            ]
          },
          'samshamoun': {
            id: 'samshamoun',
            name: 'Sam Shamoun',
            description: 'Christianity and demystifying Islam',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZRQfJSpcI_JgGVTlCMvLGzeMXnBwVMeJ9qGwA=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'dQKLFX2zNPg',
                title: 'Understanding Biblical Prophecy',
                thumbnailUrl: 'https://i.ytimg.com/vi/dQKLFX2zNPg/maxresdefault.jpg',
                published: '2023-05-20T19:00:00Z'
              },
              {
                videoId: 'dQKLFX2zNPg',
                title: 'The Truth About Islam',
                thumbnailUrl: 'https://i.ytimg.com/vi/dQKLFX2zNPg/maxresdefault.jpg',
                published: '2023-05-15T17:30:00Z'
              },
              {
                videoId: 'dQKLFX2zNPg',
                title: 'Defending Christianity',
                thumbnailUrl: 'https://i.ytimg.com/vi/dQKLFX2zNPg/maxresdefault.jpg',
                published: '2023-05-10T14:15:00Z'
              }
            ]
          },
          'tate': {
            id: 'tate',
            name: 'Tristan & Andrew Tate',
            description: 'Tristan and Andrew Tate official channel',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQkTgkXX5dZLyALD-JsLrQWjQu3AqKUZiVPpQ=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'BhtZgqp7Xug',
                title: 'How to Build Wealth',
                thumbnailUrl: 'https://i.ytimg.com/vi/BhtZgqp7Xug/maxresdefault.jpg',
                published: '2023-05-22T20:00:00Z'
              },
              {
                videoId: 'BhtZgqp7Xug',
                title: 'Mindset of Champions',
                thumbnailUrl: 'https://i.ytimg.com/vi/BhtZgqp7Xug/maxresdefault.jpg',
                published: '2023-05-18T18:30:00Z'
              },
              {
                videoId: 'BhtZgqp7Xug',
                title: 'The Truth About Success',
                thumbnailUrl: 'https://i.ytimg.com/vi/BhtZgqp7Xug/maxresdefault.jpg',
                published: '2023-05-14T15:45:00Z'
              }
            ]
          },
          'freshandfit': {
            id: 'freshandfit',
            name: 'Fresh & Fit',
            description: 'Fresh & Fit Podcast',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZTcwvZGTmGFhLzJGQWvh_IeI9xPnVz5-QUiSA=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'oDd-3MgJdUA',
                title: 'Dating in 2023',
                thumbnailUrl: 'https://i.ytimg.com/vi/oDd-3MgJdUA/maxresdefault.jpg',
                published: '2023-05-25T21:00:00Z'
              },
              {
                videoId: 'oDd-3MgJdUA',
                title: 'How to Build Your Network',
                thumbnailUrl: 'https://i.ytimg.com/vi/oDd-3MgJdUA/maxresdefault.jpg',
                published: '2023-05-20T19:30:00Z'
              },
              {
                videoId: 'oDd-3MgJdUA',
                title: 'Financial Freedom Strategies',
                thumbnailUrl: 'https://i.ytimg.com/vi/oDd-3MgJdUA/maxresdefault.jpg',
                published: '2023-05-15T16:45:00Z'
              }
            ]
          },
          'siddhanath': {
            id: 'siddhanath',
            name: 'Siddhanath Yoga Parampara',
            description: 'Yogiraj Gurunath Siddhanath teachings',
            thumbnail: 'https://yt3.googleusercontent.com/ytc/AIf8zZQzRuFO_TkNFIjzgYr5AOF-jmqs9xkgKvKwRH4H=s176-c-k-c0x00ffffff-no-rj',
            videos: [
              {
                videoId: 'jYp1nUEGf8M',
                title: 'Meditation Techniques',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg',
                published: '2023-05-28T22:00:00Z'
              },
              {
                videoId: 'jYp1nUEGf8M',
                title: 'Yoga for Beginners',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg',
                published: '2023-05-23T20:30:00Z'
              },
              {
                videoId: 'jYp1nUEGf8M',
                title: 'Spiritual Awakening Journey',
                thumbnailUrl: 'https://i.ytimg.com/vi/jYp1nUEGf8M/maxresdefault.jpg',
                published: '2023-05-18T17:45:00Z'
              }
            ]
          }
        };
        
        // Get the community data
        const selectedCommunity = communityData[communityId];
        
        if (!selectedCommunity) {
          throw new Error(`Community ${communityId} not found`);
        }
        
        setCommunity(selectedCommunity);
        setVideos(selectedCommunity.videos);
      } catch (err) {
        console.error('Error fetching community data:', err);
        setError(`Failed to load ${communityId} community. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [communityId]);

  if (loading) {
    return <div className="community-page-loading">Loading {communityId} community...</div>;
  }

  if (error) {
    return <div className="community-page-error">{error}</div>;
  }

  if (!community) {
    return <div className="community-page-not-found">Community not found</div>;
  }

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="community-header-thumbnail">
          <img src={community.thumbnail} alt={community.name} />
        </div>
        <div className="community-header-info">
          <h1 className="community-header-title">{community.name}</h1>
          <p className="community-header-description">{community.description}</p>
        </div>
      </div>
      
      <div className="community-videos">
        <h2 className="community-videos-title">Latest Videos</h2>
        <div className="community-videos-grid">
          {videos.map((video, index) => (
            <a 
              key={`${video.videoId}-${index}`} 
              href={`/thread/${video.videoId}`}
              className="video-card"
            >
              <div className="video-thumbnail">
                <img src={video.thumbnailUrl} alt={video.title} />
                <div className="video-play-button">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <div className="video-meta">
                  <span className="video-date">
                    {new Date(video.published).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <div className="community-create-thread">
        <a href={`/create-thread/${communityId}`} className="create-thread-button">
          Create New Thread
        </a>
      </div>
    </div>
  );
};

export default CommunityPage;
