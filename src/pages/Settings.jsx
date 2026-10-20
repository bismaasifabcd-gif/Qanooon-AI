import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Moon, 
  Bell, 
  Shield, 
  FileText, 
  LogOut, 
  ChevronRight,
  AlertTriangle,
  Volume2,
  Trash2,
  Monitor,
  Type,
  Info,
  Sliders,
  Sparkles,
  Gavel
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { signOut, deleteUser } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, updateDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

import logo from '../assets/logo.png';

const Settings = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { user, userData, refreshUserData } = useAuth();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [settings, setSettings] = useState(userData?.settings || {
    autoReadResponses: false,
    saveChatHistory: true,
    voiceSpeed: 1.0,
    fontSize: "medium",
    theme: "light",
    notifications: true
  });

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { settings: newSettings });
    }
  };

  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    if (user) {
      await updateDoc(doc(db, "users", user.uid), { preferredLanguage: newLang });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/splash');
  };

  const SettingRow = ({ icon: Icon, label, value, onClick, type = 'chevron', color = 'primary' }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all group mb-4"
    >
      <div className="flex items-center space-x-5 rtl:space-x-reverse">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
          color === 'red' ? 'bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white' : 'bg-surface text-primary group-hover:bg-primary group-hover:text-white'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-left rtl:text-right">
          <p className={`text-lg font-black text-primary group-hover:text-primary transition-colors ${language === 'urdu' ? 'font-urdu' : ''}`}>{label}</p>
          {typeof value === 'string' && <p className="text-primary/30 text-[10px] font-black uppercase tracking-widest mt-1">{value}</p>}
        </div>
      </div>
      {type === 'chevron' && <ChevronRight className={`w-5 h-5 text-primary/20 group-hover:text-accent transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${language === 'urdu' ? 'rotate-180' : ''}`} />}
      {type === 'toggle' && (
        <div className={`w-14 h-8 rounded-full transition-all relative p-1 ${value ? 'bg-accent' : 'bg-primary/10'}`}>
          <div className={`w-6 h-6 bg-white rounded-full shadow-lg transition-all transform ${value ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Settings Header */}
      <header className="bg-primary pt-12 pb-24 px-6 rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button onClick={() => navigate('/dashboard')} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10">
              <ArrowLeft className={`w-6 h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
            </button>
            <img src={logo} alt="Kanoon AI Logo" className="app-logo w-9 h-9 object-cover" />
            <h1 className={`text-white text-3xl font-black ${language === 'urdu' ? 'font-urdu text-4xl' : ''}`}>
              {t.settings}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 -mt-12 relative z-20 space-y-10">
        {/* Language Section */}
        <section className="space-y-4">
          <h2 className="text-primary/30 text-[10px] font-black uppercase tracking-[0.4em] px-4">Global Localization</h2>
          <SettingRow 
            icon={Globe} 
            label={language === 'urdu' ? 'اردو ↔ English' : 'System Language'} 
            value={language === 'urdu' ? 'اردو فعال ہے' : 'English Active'} 
            onClick={() => handleLanguageChange(language === 'urdu' ? 'english' : 'urdu')}
          />
        </section>

        {/* Intelligence Section */}
        <section className="space-y-4">
          <h2 className="text-primary/30 text-[10px] font-black uppercase tracking-[0.4em] px-4">AI Interaction</h2>
          <SettingRow 
            icon={Volume2} 
            label={language === 'urdu' ? 'جوابات خودکار پڑھیں' : 'Auto-Read Advisor'} 
            value={settings.autoReadResponses} 
            type="toggle"
            onClick={() => updateSetting('autoReadResponses', !settings.autoReadResponses)}
          />
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-surface text-primary rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <p className={`text-lg font-black text-primary ${language === 'urdu' ? 'font-urdu' : ''}`}>Voice Speed</p>
              </div>
              <span className="text-accent font-black">{settings.voiceSpeed}x</span>
            </div>
            <input 
              type="range" min="0.5" max="1.5" step="0.1"
              value={settings.voiceSpeed}
              onChange={(e) => updateSetting('voiceSpeed', parseFloat(e.target.value))}
              className="w-full accent-accent h-2 bg-primary/5 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </section>

        {/* Appearance Section */}
        <section className="space-y-4">
          <h2 className="text-primary/30 text-[10px] font-black uppercase tracking-[0.4em] px-4">Experience</h2>
          <SettingRow 
            icon={Monitor} 
            label={t.darkMode} 
            value={settings.theme === 'dark'} 
            type="toggle"
            onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')}
          />
          <SettingRow 
            icon={Type} 
            label="Typographic Scale" 
            value={settings.fontSize.toUpperCase()} 
            onClick={() => {
              const sizes = ['small', 'medium', 'large'];
              const next = sizes[(sizes.indexOf(settings.fontSize) + 1) % 3];
              updateSetting('fontSize', next);
            }}
          />
        </section>

        {/* Legal & Safety */}
        <section className="space-y-4">
          <h2 className="text-primary/30 text-[10px] font-black uppercase tracking-[0.4em] px-4">Compliance</h2>
          <SettingRow icon={Shield} label={t.privacyPolicy} onClick={() => navigate('/privacy-policy')} />
          <SettingRow icon={FileText} label={t.termsOfService} />
          <SettingRow icon={Info} label="Legal Infrastructure" value="v1.0.0 STABLE" />
        </section>

        {/* Danger Zone */}
        <section className="pt-10 space-y-4">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full btn-justice bg-primary text-white py-6 shadow-primary/20"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-xl">Terminate Session</span>
          </button>
          
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-6 flex items-center justify-center space-x-3 text-red-500 font-black uppercase tracking-widest text-[10px] hover:text-red-600 transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Erasure of Identity Data</span>
          </button>
        </section>
      </main>

      {/* Trust Seal */}
      <div className="mt-12 mb-20 flex flex-col items-center opacity-10">
        <Gavel className="w-12 h-12 text-primary" />
        <p className="text-[8px] font-black uppercase tracking-[0.7em] mt-2">Kanoon AI Core Infrastructure</p>
      </div>

      {/* Confirmation Modals Redesign */}
      {(showLogoutConfirm || showDeleteConfirm) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl border border-primary/5">
            <div className={`w-20 h-20 ${showDeleteConfirm ? 'bg-red-50' : 'bg-primary/5'} rounded-full flex items-center justify-center mb-8 mx-auto`}>
              <AlertTriangle className={`w-10 h-10 ${showDeleteConfirm ? 'text-red-500' : 'text-primary'}`} />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-primary text-2xl font-black">
                {showDeleteConfirm ? 'Purge Identity?' : 'Confirm Logout?'}
              </h3>
              <p className="text-primary/40 text-sm font-medium">
                {showDeleteConfirm 
                  ? 'All legal history and profile data will be permanently erased from the archive.' 
                  : 'You will need to re-verify your identity to access AskLex.'}
              </p>
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse mt-10">
              <button 
                onClick={() => { setShowLogoutConfirm(false); setShowDeleteConfirm(false); }}
                className="flex-1 border-2 border-primary/5 hover:bg-primary/5 text-primary/60 font-bold py-4 rounded-2xl transition-all"
              >
                {t.cancel}
              </button>
              <button 
                onClick={showLogoutConfirm ? handleLogout : () => navigate('/splash')}
                className={`flex-1 ${showDeleteConfirm ? 'bg-red-500' : 'bg-primary'} text-white font-bold py-4 rounded-2xl shadow-xl transition-all`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
