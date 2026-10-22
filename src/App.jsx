import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BottomNav from './components/layout/BottomNav';

// Splash loads eagerly (it's the first screen). Every other page is code-split
// with React.lazy so heavy pages (Chatbot's jsPDF/pdf.js, the RAG library, etc.)
// are fetched only when the user navigates there — keeping first paint fast.
import Splash from './pages/Splash';
const Home = lazy(() => import('./pages/Home'));
const Auth = lazy(() => import('./pages/Auth'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const LawyerSearch = lazy(() => import('./pages/LawyerSearch'));
const LawLibrary = lazy(() => import('./pages/LawLibrary'));
const History = lazy(() => import('./pages/History'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));

// Lightweight full-screen fallback shown while a page chunk loads.
const PageLoader = () => (
  <div className="min-h-[100dvh] flex items-center justify-center bg-surface">
    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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
