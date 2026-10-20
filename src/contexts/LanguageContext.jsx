import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { ur } from '../translations/ur';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  const t = language === 'english' ? en : ur;

  useEffect(() => {
    // Update the document direction for RTL support
    if (language === 'urdu') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ur';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'english' ? 'urdu' : 'english'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
