import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CommunityGrid from './components/CommunityGrid';
import CommunityPage from './components/CommunityPage';
import ThreadPage from './components/ThreadPage';
import ThreadForm from './components/ThreadForm';
import { AuthProvider } from './components/AuthContext';
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
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="landing-page">
                  <h1 className="landing-title">Multi-Imageboard Communities</h1>
                  <CommunityGrid communities={communities} />
                </div>
              } />
              <Route path="/community/:communityId" element={<CommunityPage />} />
              <Route path="/thread/:videoId" element={<ThreadPage />} />
              <Route path="/create-thread/:communityId" element={
                <div className="create-thread-page">
                  <ThreadForm />
                </div>
              } />
            </Routes>
          </main>
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
