import React, { useState } from 'react';
import './AuthForms.css';

export const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real implementation, this would call the API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Call the onLogin callback with the user data
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="auth-switch">
        Don't have an account? <button className="switch-button">Register</button>
      </div>
    </div>
  );
};

export const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // In a real implementation, this would call the API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Call the onRegister callback with the user data
      onRegister(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Register</h2>
      {error && <div className="auth-error">{error}</div>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="auth-switch">
        Already have an account? <button className="switch-button">Login</button>
      </div>
    </div>
  );
};

export const UserProfile = ({ user, onUpdateSettings, onLogout }) => {
  const [anonymitySettings, setAnonymitySettings] = useState(
    user.communities.reduce((acc, community) => {
      acc[community.communityId] = community.isAnonymous;
      return acc;
    }, {})
  );

  const handleAnonymityToggle = async (communityId) => {
    const newValue = !anonymitySettings[communityId];
    
    try {
      // In a real implementation, this would call the API
      const response = await fetch('/api/auth/community-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          communityId,
          isAnonymous: newValue
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update settings');
      }

      // Update local state
      setAnonymitySettings({
        ...anonymitySettings,
        [communityId]: newValue
      });
      
      // Call the onUpdateSettings callback
      onUpdateSettings(communityId, newValue);
    } catch (err) {
      console.error('Error updating anonymity settings:', err);
      // Revert the change in UI
      setAnonymitySettings({
        ...anonymitySettings
      });
    }
  };

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Call the onLogout callback
    onLogout();
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="profile-info">
        <div className="info-group">
          <label>Username:</label>
          <span>{user.username}</span>
        </div>
        <div className="info-group">
          <label>Email:</label>
          <span>{user.email}</span>
        </div>
        <div className="info-group">
          <label>Member Since:</label>
          <span>{new Date(user.dateJoined).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="anonymity-settings">
        <h3>Anonymity Settings</h3>
        <p className="settings-description">
          Toggle anonymity for each community. When turned on, your posts will be anonymous.
          When turned off, your username will be displayed with your posts.
        </p>
        
        <div className="communities-list">
          {user.communities.map(community => (
            <div key={community.communityId} className="community-setting">
              <span className="community-name">
                {/* In a real implementation, this would show the community name */}
                Community {community.communityId}
              </span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={anonymitySettings[community.communityId]}
                  onChange={() => handleAnonymityToggle(community.communityId)}
                />
                <span className="toggle-slider"></span>
              </label>
              <span className="anonymity-status">
                {anonymitySettings[community.communityId] ? 'Anonymous' : 'Identified'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
