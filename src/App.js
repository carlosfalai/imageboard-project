import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CommunityGrid from './components/CommunityGrid';
import ThreadGrid from './components/ThreadGrid';
import ThreadForm from './components/ThreadForm';
import CommentSection from './components/CommentSection';
import PhotoBoard from './components/PhotoBoard';
import GoogleTranslateWidget from './components/GoogleTranslateWidget';
import ChatBot from './components/ChatBot';
import CheckInFeature from './components/CheckInFeature';
import { AuthProvider } from './components/AuthContext';
import { LoginForm, RegisterForm, UserProfile } from './components/AuthForms';
import './App.css';

// Mock data for demonstration
const communities = [
  { id: 'infowars', name: 'InfoWars - Alex Jones', thumbnail: '/placeholder-infowars.jpg' },
  { id: 'thenx', name: 'THENX - Chris Heria', thumbnail: '/placeholder-thenx.jpg' },
  { id: 'samshamoun', name: 'Sam Shamoun', thumbnail: '/placeholder-samshamoun.jpg' },
  { id: 'tate', name: 'Tristan & Andrew Tate', thumbnail: '/placeholder-tate.jpg' },
  { id: 'freshandfit', name: 'Fresh & Fit', thumbnail: '/placeholder-freshandfit.jpg' },
  { id: 'siddhanath', name: 'Siddhanath Yoga Parampara', thumbnail: '/placeholder-siddhanath.jpg' }
];

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Header />
          <div className="google-translate-container">
            <GoogleTranslateWidget />
          </div>
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="landing-page">
                  <h1 className="landing-title">Multi-Imageboard Communities</h1>
                  <CommunityGrid communities={communities} />
                </div>
              } />
              <Route path="/community/:communityId" element={
                <div className="community-page">
                  {/* Community-specific content would be loaded here */}
                  <ThreadGrid threads={[]} />
                </div>
              } />
              <Route path="/thread/:threadId" element={
                <div className="thread-page">
                  {/* Thread-specific content would be loaded here */}
                  <CommentSection threadId="mock-thread-id" comments={[]} />
                </div>
              } />
              <Route path="/create-thread/:communityId" element={
                <div className="create-thread-page">
                  <ThreadForm communityId="mock-community-id" onSubmit={() => {}} />
                </div>
              } />
              <Route path="/profile" element={
                <div className="profile-page">
                  <UserProfile 
                    user={{
                      username: 'testuser',
                      email: 'test@example.com',
                      dateJoined: new Date().toISOString(),
                      communities: [
                        { communityId: 'infowars', isAnonymous: true },
                        { communityId: 'thenx', isAnonymous: false }
                      ]
                    }}
                    onUpdateSettings={() => {}}
                    onLogout={() => {}}
                  />
                </div>
              } />
              <Route path="/siddhanath/photoboard" element={
                <div className="photoboard-page">
                  <PhotoBoard albums={[]} isLoggedIn={true} />
                </div>
              } />
              <Route path="/siddhanath/checkin" element={
                <div className="checkin-page">
                  <CheckInFeature events={[]} isLoggedIn={true} />
                </div>
              } />
            </Routes>
          </main>
          <ChatBot />
          <footer className="footer">
            <div className="footer-content">
              <p>&copy; 2025 Multi-Imageboard. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
