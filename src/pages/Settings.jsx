import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  LogOut, 
  ChevronRight,
  AlertTriangle,
  Volume2,
  Trash2,
  Type,
  Info,
  Sparkles,
  Mail
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
  const [showAbout, setShowAbout] = useState(false);
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
      className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-primary/8 shadow-sm hover:border-accent/30 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
          color === 'red' ? 'bg-red-50 text-red-500' : 'bg-surface text-accent'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left rtl:text-right">
          <p className={`text-sm font-black text-primary ${language === 'urdu' ? 'font-urdu text-base' : ''}`}>{label}</p>
          {typeof value === 'string' && <p className="text-primary/35 text-[10px] font-bold mt-0.5">{value}</p>}
        </div>
      </div>
      {type === 'chevron' && <ChevronRight className={`w-5 h-5 text-primary/20 group-hover:text-accent transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${language === 'urdu' ? 'rotate-180' : ''}`} />}
      {type === 'toggle' && (
        <div className={`w-12 h-7 rounded-full transition-all relative p-1 flex-shrink-0 ${value ? 'bg-accent' : 'bg-primary/15'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-all transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
        </div>
      )}
    </button>
  );

  const SectionLabel = ({ children }) => (
    <h2 className="text-primary/40 text-[10px] font-black uppercase tracking-[0.2em] px-1 mb-2.5">{children}</h2>
  );

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Header — rectangular, matches dashboard */}
      <header className="bg-primary px-5 md:px-8 pt-6 pb-6 border-b-2 border-accent/30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all flex-shrink-0">
            <ArrowLeft className={`w-5 h-5 ${language === 'urdu' ? 'rotate-180' : ''}`} />
          </button>
          <img src={logo} alt="Qanoon AI Logo" className="app-logo w-9 h-9 object-cover border border-white/10" />
          <h1 className={`text-white text-xl md:text-2xl font-black ${language === 'urdu' ? 'font-urdu text-2xl' : ''}`}>
            {t.settings}
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 md:px-8 pt-6 space-y-6">
        {/* Language */}
        <section>
          <SectionLabel>{language === 'urdu' ? 'زبان' : 'Language'}</SectionLabel>
          <SettingRow 
            icon={Globe} 
            label={language === 'urdu' ? 'زبان' : 'App Language'} 
            value={language === 'urdu' ? 'اردو' : 'English'} 
            onClick={() => handleLanguageChange(language === 'urdu' ? 'english' : 'urdu')}
          />
        </section>

        {/* AI Interaction */}
        <section>
          <SectionLabel>{language === 'urdu' ? 'AI ترتیبات' : 'Assistant'}</SectionLabel>
          <div className="space-y-3">
            <SettingRow 
              icon={Volume2} 
              label={language === 'urdu' ? 'جوابات خودکار پڑھیں' : 'Auto-read answers aloud'} 
              value={settings.autoReadResponses} 
              type="toggle"
              onClick={() => updateSetting('autoReadResponses', !settings.autoReadResponses)}
            />
            <div className="bg-white p-4 rounded-xl border border-primary/8 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <p className={`text-sm font-black text-primary ${language === 'urdu' ? 'font-urdu text-base' : ''}`}>{language === 'urdu' ? 'آواز کی رفتار' : 'Voice speed'}</p>
                </div>
                <span className="text-accent font-black text-sm">{settings.voiceSpeed}x</span>
              </div>
              <input 
                type="range" min="0.5" max="1.5" step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => updateSetting('voiceSpeed', parseFloat(e.target.value))}
                className="w-full accent-accent h-1.5 bg-primary/5 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <SectionLabel>{language === 'urdu' ? 'ظاہری شکل' : 'Appearance'}</SectionLabel>
          <SettingRow 
            icon={Type} 
            label={language === 'urdu' ? 'متن کا سائز' : 'Text size'} 
            value={settings.fontSize === 'small' ? (language === 'urdu' ? 'چھوٹا' : 'Small') : settings.fontSize === 'large' ? (language === 'urdu' ? 'بڑا' : 'Large') : (language === 'urdu' ? 'درمیانہ' : 'Medium')} 
            onClick={() => {
              const sizes = ['small', 'medium', 'large'];
              const next = sizes[(sizes.indexOf(settings.fontSize) + 1) % 3];
              updateSetting('fontSize', next);
            }}
          />
        </section>

        {/* Legal & About */}
        <section>
          <SectionLabel>{language === 'urdu' ? 'قانونی و معلومات' : 'Legal & About'}</SectionLabel>
          <div className="space-y-3">
            <SettingRow icon={Shield} label={t.privacyPolicy} onClick={() => navigate('/privacy-policy')} />
            <SettingRow
              icon={Mail}
              label={language === 'urdu' ? 'مدد و رابطہ' : 'Help & Contact'}
              value="support@qanoon-ai.app"
              onClick={() => { window.location.href = 'mailto:support@qanoon-ai.app'; }}
            />
            <SettingRow
              icon={Sparkles}
              label={language === 'urdu' ? 'رہنمائی دوبارہ دیکھیں' : 'Replay App Guide'}
              onClick={() => {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith('qanoon_guide_'))
                  .forEach((k) => localStorage.removeItem(k));
                navigate('/dashboard');
              }}
            />
            <SettingRow icon={Info} label={language === 'urdu' ? 'ایپ کے بارے میں' : 'About Qanoon AI'} value="v1.0.0" onClick={() => setShowAbout(true)} />
          </div>
        </section>

        {/* Account actions */}
        <section className="pt-2 space-y-3">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-navy-light transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>{language === 'urdu' ? 'لاگ آؤٹ' : 'Log Out'}</span>
          </button>
          
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 flex items-center justify-center gap-2 text-red-500 font-bold text-xs hover:text-red-600 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>{language === 'urdu' ? 'اکاؤنٹ حذف کریں' : 'Delete Account'}</span>
          </button>
        </section>

        <p className="text-center text-primary/25 text-[10px] font-bold pt-2 pb-4">
          Qanoon AI · {language === 'urdu' ? 'قانون سب کے لیے' : 'Justice for everyone'}
        </p>
      </main>

      {/* About modal */}
      {showAbout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md animate-fade-in" onClick={() => setShowAbout(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-primary/5 text-center" onClick={(e) => e.stopPropagation()}>
            <img src={logo} alt="Qanoon AI" className="app-logo w-14 h-14 object-cover mx-auto mb-3" />
            <h3 className="text-primary text-lg font-black">Qanoon AI</h3>
            <p className="text-primary/40 text-xs font-bold mt-0.5">v1.0.0</p>
            <p className="text-primary/60 text-sm mt-3 leading-relaxed">
              {language === 'urdu'
                ? 'پاکستانی شہریوں کے لیے مفت AI قانونی معاون۔ یہ عمومی رہنمائی فراہم کرتا ہے، کسی وکیل کا متبادل نہیں۔'
                : 'A free AI legal assistant for Pakistani citizens. It provides general guidance and is not a substitute for a lawyer.'}
            </p>
            <button onClick={() => setShowAbout(false)} className="mt-5 w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-navy-light transition-all">
              {language === 'urdu' ? 'بند کریں' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {(showLogoutConfirm || showDeleteConfirm) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-primary/5">
            <div className={`w-14 h-14 ${showDeleteConfirm ? 'bg-red-50' : 'bg-primary/5'} rounded-xl flex items-center justify-center mb-5 mx-auto`}>
              <AlertTriangle className={`w-7 h-7 ${showDeleteConfirm ? 'text-red-500' : 'text-primary'}`} />
            </div>
            <div className="space-y-1.5 text-center">
              <h3 className="text-primary text-lg font-black">
                {showDeleteConfirm
                  ? (language === 'urdu' ? 'اکاؤنٹ حذف کریں؟' : 'Delete account?')
                  : (language === 'urdu' ? 'لاگ آؤٹ کریں؟' : 'Log out?')}
              </h3>
              <p className="text-primary/50 text-sm font-medium">
                {showDeleteConfirm 
                  ? (language === 'urdu' ? 'آپ کی تمام ہسٹری اور پروفائل مستقل طور پر حذف ہو جائے گی۔ یہ عمل واپس نہیں ہو سکتا۔' : 'Your history and profile data will be permanently deleted. This cannot be undone.')
                  : (language === 'urdu' ? 'دوبارہ استعمال کے لیے آپ کو دوبارہ سائن اِن کرنا ہوگا۔' : 'You will need to sign in again to use the app.')}
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => { setShowLogoutConfirm(false); setShowDeleteConfirm(false); }}
                className="flex-1 border border-primary/10 hover:bg-primary/5 text-primary/60 font-bold py-3 rounded-xl transition-all"
              >
                {t.cancel}
              </button>
              <button 
                onClick={showLogoutConfirm ? handleLogout : () => navigate('/splash')}
                className={`flex-1 ${showDeleteConfirm ? 'bg-red-500' : 'bg-primary'} text-white font-bold py-3 rounded-xl transition-all`}
              >
                {language === 'urdu' ? 'تصدیق' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
