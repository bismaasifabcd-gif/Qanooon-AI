import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Splash from './pages/Splash';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import LawyerSearch from './pages/LawyerSearch';
import LawLibrary from './pages/LawLibrary';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';

const ProtectedRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;
  if (!userData || !userData.name || userData.name === '') return <Navigate to="/onboarding" />;
  
  return children;
};

import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';

const AppContent = () => {
  const location = useLocation();
  const { user, userData } = useAuth();

  // RAG disabled to conserve API quota — vector store check skipped
  // useEffect(() => {
  //   const checkRAGStatus = async () => {
  //     try {
  //       const response = await fetch('/vector_store.json');
  //       if (response.ok) {
  //         const db = await response.json();
  //         console.log(`⚖️ RAG Status: Active and permanently initialized. Total pre-computed chunks loaded client-side:`, db.length);
  //       } else {
  //         console.warn("⚠️ RAG Status: vector_store.json could not be loaded from public folder.");
  //       }
  //     } catch (err) {
  //       console.error("⚠️ RAG Status: Error loading client-side vector store:", err);
  //     }
  //   };
  //   checkRAGStatus();
  // }, []);
  
  // Routes where we show the mobile bottom nav and desktop navbar
  const showNav = user && userData && ['/dashboard', '/lawyer', '/library', '/history', '/profile', '/settings'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      {/* 
        The Dashboard has its own custom header, 
        so we might not need the standard Navbar there. 
        But feature pages should probably have some nav.
      */}
      <main>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<div className="min-h-screen"><Onboarding /></div>} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/lawyer" element={<ProtectedRoute><LawyerSearch /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><LawLibrary /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      
      {showNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
