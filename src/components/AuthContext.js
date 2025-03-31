import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthContext.css';

// Create the context
export const AuthContext = React.createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // In a real implementation, this would verify the token with the server
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            setCurrentUser(data.user);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (userData) => {
    setCurrentUser(userData);
    setAuthModalOpen(false);
    navigate('/');
  };

  // Register function
  const register = async (userData) => {
    setCurrentUser(userData);
    setAuthModalOpen(false);
    navigate('/');
  };

  // Logout function
  const logout = async () => {
    try {
      await fetch('/api/auth/logout');
      localStorage.removeItem('token');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Update user settings
  const updateSettings = (communityId, isAnonymous) => {
    setCurrentUser(prevUser => {
      const updatedCommunities = prevUser.communities.map(community => {
        if (community.communityId === communityId) {
          return { ...community, isAnonymous };
        }
        return community;
      });
      
      return {
        ...prevUser,
        communities: updatedCommunities
      };
    });
  };

  // Open auth modal
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // Close auth modal
  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Switch auth mode
  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  // Check if user is anonymous in a specific community
  const isAnonymousInCommunity = (communityId) => {
    if (!currentUser) return true; // Default to anonymous if not logged in
    
    const community = currentUser.communities.find(c => c.communityId === communityId);
    return community ? community.isAnonymous : currentUser.settings.defaultAnonymous;
  };

  // Context value
  const value = {
    currentUser,
    loading,
    authModalOpen,
    authMode,
    login,
    register,
    logout,
    updateSettings,
    openAuthModal,
    closeAuthModal,
    switchAuthMode,
    isAnonymousInCommunity
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
