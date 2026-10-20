import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeaturePlaceholder = ({ title }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-surface p-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 rtl:space-x-reverse text-primary hover:text-accent transition-colors mb-10"
      >
        <ArrowLeft className={`w-6 h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
        <span className="font-bold">Back to Dashboard</span>
      </button>
      <div className="flex flex-col items-center justify-center pt-20">
        <h1 className="text-4xl md:text-6xl font-bold text-primary text-center">
          {title} Screen
        </h1>
        <p className="text-xl text-text-dark/40 mt-4">Coming Soon...</p>
      </div>
    </div>
  );
};

export const Chatbot = () => <FeaturePlaceholder title="AI Chatbot" />;
export const LawyerSearch = () => <FeaturePlaceholder title="Find a Lawyer" />;
export const LawLibrary = () => <FeaturePlaceholder title="Law Library" />;
export const History = () => <FeaturePlaceholder title="My History" />;
