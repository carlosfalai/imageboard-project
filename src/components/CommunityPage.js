import React, { useState, useEffect } from 'react';
import './CommunityPage.css';
import YouTubeThreads from './YouTubeThreads';
import ThreadForm from './ThreadForm';
import { useParams } from 'react-router-dom';

const CommunityPage = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Community data mapping
  const communityData = {
    infowars: {
      name: 'InfoWars - Alex Jones',
      description: 'Official InfoWars community with "Times that AJ was right" thread category',
      channelId: 'UCvsye7V9psc-APX6wV1twLg',
      categories: ['Times AJ was right', 'News', 'Discussions', 'Events']
    },
    thenx: {
      name: 'THENX - Chris Heria',
      description: 'Official THENX community with workout categories and fitness discussions',
      channelId: 'UCqjwF8rxRsotnojGl4gM0Zw',
      categories: ['Workouts', 'Nutrition', 'Transformation', 'Equipment']
    },
    samshamoun: {
      name: 'Sam Shamoun',
      description: 'Christianity and demystifying Islam content from Sam Shamoun',
      channelId: 'UC9JU55HpvRvCSb1TO2w_eDA',
      categories: ['Christianity', 'Islam', 'Debates', 'Theology']
    },
    tate: {
      name: 'Tristan & Andrew Tate',
      description: 'Official community for Tristan and Andrew Tate content',
      channelId: 'UCnYMOamNKLGVlJgRUbamveA',
      categories: ['Motivation', 'Business', 'Lifestyle', 'Debates']
    },
    freshandfit: {
      name: 'Fresh & Fit',
      description: 'Official Fresh & Fit community for podcast discussions and content',
      channelId: 'UC5sqmi33b7l9kIYa0yASOmQ',
      categories: ['Podcast Episodes', 'Dating', 'Self-Improvement', 'Guest Highlights']
    },
    siddhanath: {
      name: 'Siddhanath Yoga Parampara',
      description: 'Official community for Siddhanath Yoga Parampara teachings and events',
      channelId: 'UC9XY5gIZNsWqZzXArUXKcSg',
      categories: ['Teachings', 'Events', 'Meditation', 'Practices']
    }
  };

  useEffect(() => {
    // Simulate fetching community data
    const fetchCommunity = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        setTimeout(() => {
          setCommunity(communityData[communityId] || {
            name: communityId,
            description: `Community for ${communityId}`,
            categories: ['General']
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching community:', error);
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunity();
    }
  }, [communityId]);

  if (loading) {
    return <div className="community-loading">Loading community...</div>;
  }

  if (!community) {
    return <div className="community-error">Community not found</div>;
  }

  return (
    <div className="community-page">
      <div className="community-header">
        <h1 className="community-name">{community.name}</h1>
        <p className="community-description">{community.description}</p>
        
        <div className="community-categories">
          {community.categories.map(category => (
            <span key={category} className="community-category">{category}</span>
          ))}
        </div>
      </div>
      
      <div className="community-actions">
        <button className="create-thread-button">Create New Thread</button>
      </div>
      
      <div className="community-content">
        <YouTubeThreads communityId={communityId} />
        
        <div className="community-recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-placeholder">
            <p>This section will show recent posts and comments from community members.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
