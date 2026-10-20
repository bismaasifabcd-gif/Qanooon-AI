import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Languages } from 'lucide-react';
import { KanoonLogo } from '../SvgAssets';

const Navbar = () => {
  const { toggleLanguage, t, language } = useLanguage();

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex items-center cursor-pointer">
              <KanoonLogo className="w-10 h-10 mr-2" />
              <span className="text-accent text-2xl md:text-3xl font-urdu font-bold">
                قانون
              </span>
              <span className="text-white text-2xl md:text-3xl font-heading font-bold ml-2">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-white hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
              {t.home}
            </Link>
            <Link to="/login" className="text-white hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">
              {t.login}
            </Link>
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/20"
            >
              <Languages className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
              <span className={language === 'english' ? 'font-urdu' : 'font-body'}>
                {t.switchLanguage}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
