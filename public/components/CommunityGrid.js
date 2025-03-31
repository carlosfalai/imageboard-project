import React from 'react';
import { Link } from 'react-router-dom';
import './CommunityGrid.css';

const CommunityGrid = ({ communities }) => {
  return (
    <div className="community-grid">
      {communities.map((community) => (
        <div key={community.id} className="community-card">
          <Link to={`/community/${community.id}`}>
            <div className="community-thumbnail">
              <img src={community.thumbnail} alt={community.name} />
            </div>
            <h3 className="community-name">{community.name}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CommunityGrid;
