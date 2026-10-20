import React from 'react';
import { NavLink } from 'react-router-dom';
import { Scale, Search, BookOpen, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const BottomNav = () => {
  const { t, language } = useLanguage();

  const navItems = [
    { icon: Scale, label: t.chatbot, path: '/chatbot' },
    { icon: Search, label: t.findLawyer, path: '/lawyer' },
    { icon: BookOpen, label: t.lawLibrary, path: '/library' },
    { icon: Clock, label: t.myHistory, path: '/history' },
  ];

  // Reverse items for RTL
  const displayItems = language === 'urdu' ? [...navItems].reverse() : navItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-white/10 z-50 bottom-nav-safe">
      <div className="flex justify-around items-center h-16 px-2" dir="ltr">
        {displayItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors ${
                isActive ? 'text-accent' : 'text-white/40'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className={`text-[10px] font-medium truncate w-full text-center ${language === 'urdu' ? 'font-urdu' : ''}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
