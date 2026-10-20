import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const Splash = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* CSS Keyframes for smooth fade-in */}
      <style>{`
        @keyframes smoothFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-smooth-fade-in {
          animation: smoothFadeIn 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse" />
      
      {/* Main Branding - Center of screen */}
      <div className="relative flex flex-col items-center space-y-6 animate-smooth-fade-in text-center">
        {/* Glowing Background Radial */}
        <div className="absolute inset-0 bg-accent/15 rounded-full blur-3xl scale-75 pointer-events-none" />
        
        {/* Large size: 200px x 200px */}
        <div className="relative z-10 w-[200px] h-[200px] flex items-center justify-center">
          <img 
            src={logo} 
            alt="Kanoon AI Logo" 
            className="app-logo w-full h-full object-cover" 
          />
        </div>

        {/* Subtext Quote */}
        <div className="flex flex-col items-center relative z-20">
          <div className="h-0.5 w-16 bg-accent/30 mb-3 animate-pulse" />
          <p className="text-accent/60 text-xs font-black uppercase tracking-[0.4em]">
            {language === 'urdu' ? 'قانون سب کے لیے ہے' : 'Qanoon Sabke Liye Hai'}
          </p>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center space-y-4">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default Splash;
