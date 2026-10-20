import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Clock, 
  User, 
  Settings as SettingsIcon,
  Sparkles,
  ChevronRight,
  Gavel
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import askLexImg from '../assets/ask_lex_tile.png';
import findLawyerImg from '../assets/find_lawyer_tile.png';
import lawLibraryImg from '../assets/law_library_tile.png';
import historyImg from '../assets/history_tile.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { userData } = useAuth();

  const [caseStatus, setCaseStatus] = useState({
    firDrafted: false,
    lawyerFound: false,
    letterGenerated: false
  });

  React.useEffect(() => {
    const fir = localStorage.getItem('kanoon_status_fir') === 'true';
    const lawyer = localStorage.getItem('kanoon_status_lawyer') === 'true';
    const letter = localStorage.getItem('kanoon_status_letter') === 'true';
    setCaseStatus({
      firDrafted: fir,
      lawyerFound: lawyer,
      letterGenerated: letter
    });
  }, []);

  const features = [
    { 
      id: 'chatbot',
      image: askLexImg,
      title: t.chatbot, 
      desc: language === 'urdu' ? 'AI سے قانونی مشورہ لیں' : 'Instant AI legal guidance',
      path: '/chatbot',
      color: 'accent'
    },
    { 
      id: 'library',
      image: lawLibraryImg,
      title: t.lawLibrary, 
      desc: language === 'urdu' ? 'قوانین تلاش کریں' : 'Browse Pakistani laws',
      path: '/library',
      color: 'primary'
    },
    { 
      id: 'lawyer',
      image: findLawyerImg,
      title: t.findLawyer, 
      desc: language === 'urdu' ? 'سرکردہ وکیل تلاش کریں' : 'Connect with certified advocates',
      path: '/lawyer',
      color: 'primary'
    },
    { 
      id: 'history',
      image: historyImg,
      title: t.myHistory, 
      desc: language === 'urdu' ? 'ماضی کی گفتگو دیکھیں' : 'Review your past sessions',
      path: '/history',
      color: 'primary'
    }
  ];

  const FeatureCard = ({ feature }) => {
    return (
      <button
        onClick={() => navigate(feature.path)}
        className="bg-white p-3 rounded-xl border border-primary/8 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/30 flex flex-col text-left rtl:text-right group relative overflow-hidden active:scale-[0.98]"
      >
        <div className="w-full aspect-[16/10] rounded-lg overflow-hidden relative">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </div>

        <div className="pt-3 px-0.5 flex-1">
          <h3 className={`text-sm font-black text-primary group-hover:text-accent transition-colors ${language === 'urdu' ? 'font-urdu text-base leading-normal' : ''}`}>
            {feature.title}
          </h3>
          <p className={`text-primary/45 font-medium text-[11px] leading-snug mt-0.5 ${language === 'urdu' ? 'font-urdu text-[13px]' : ''}`}>
            {feature.desc}
          </p>
        </div>

        <div className="mt-3 px-0.5 flex items-center justify-between text-accent w-full">
          <span className="text-[9px] font-black uppercase tracking-widest">{language === 'urdu' ? 'کھولیں' : 'Open'}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${language === 'urdu' ? 'rotate-180' : ''}`} />
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-surface pb-24 animate-smooth-fade-in">
      {/* Header — clean rectangular bar */}
      <header className="bg-primary px-5 md:px-8 pt-6 pb-6 border-b-2 border-accent/30">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Top row: brand + actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="Qanoon AI Logo" className="app-logo w-9 h-9 object-cover border border-white/10" />
              <span className="text-white font-black text-lg tracking-tight">Qanoon AI</span>
            </div>
            <div className="flex gap-2 rtl:space-x-reverse">
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Greeting */}
          <div>
            <p className="text-accent text-[10px] font-black uppercase tracking-[0.25em]">{language === 'urdu' ? 'مین ڈیش بورڈ' : 'Citizen Workspace'}</p>
            <h1 className={`text-white text-2xl md:text-3xl font-black mt-0.5 ${language === 'urdu' ? 'font-urdu text-3xl leading-relaxed' : ''}`}>
              {t.dashboardGreeting}{userData?.name || 'User'} <span className="inline-block">👋</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder={language === 'urdu' ? 'قانون تلاش کریں یا سوال پوچھیں...' : 'Search laws or ask a legal question...'}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) navigate('/chatbot', { state: { prefill: e.target.value.trim() } }); }}
              className="w-full bg-white/10 border border-white/10 focus:border-accent/50 rounded-lg py-3 pl-11 pr-12 text-white placeholder:text-white/30 outline-none transition-all text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-primary p-1.5 rounded-md">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 md:px-8 pt-6 relative z-20 space-y-6">
        {/* Section label */}
        <div className="flex items-center justify-between">
          <h2 className={`text-primary font-black text-base ${language === 'urdu' ? 'font-urdu text-lg' : ''}`}>
            {language === 'urdu' ? 'خدمات' : 'Services'}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-3">
          {features.map(f => <FeatureCard key={f.id} feature={f} />)}
        </div>

        {/* Daily Legal Insight */}
        <div className="bg-primary rounded-xl p-5 md:p-6 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 bg-accent/15 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0 text-left rtl:text-right">
              <span className="text-accent font-black text-[9px] uppercase tracking-widest">
                {language === 'urdu' ? 'آج کا قانونی مشورہ' : 'Daily Legal Insight'}
              </span>
              <h3 className={`text-white font-black mt-1 ${language === 'urdu' ? 'font-urdu text-xl leading-relaxed' : 'text-base'}`}>
                {language === 'urdu' ? 'تحریری معاہدوں کی قانونی اہمیت' : 'Always Put Contracts in Writing'}
              </h3>
              <p className={`text-white/60 font-medium leading-relaxed mt-1.5 ${language === 'urdu' ? 'font-urdu text-base leading-relaxed' : 'text-[13px]'}`}>
                {language === 'urdu' ? 'معاہدہ ایکٹ 1872 کے تحت مالی یا جائیداد کے معاہدے ہمیشہ اسٹامپ پیپر پر تحریری شکل میں کریں۔ زبانی وعدے عدالت میں ثابت کرنا مشکل ہوتے ہیں۔' : 'Under the Contract Act 1872, execute financial or property agreements in writing on valid stamp paper. Oral contracts are valid but very hard to prove in court.'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent activity — link to real history */}
        <button
          onClick={() => navigate('/history')}
          className="w-full bg-white rounded-xl p-5 border border-primary/8 shadow-sm hover:border-accent/30 transition-all flex items-center justify-between text-left rtl:text-right group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className={`text-primary font-black text-sm ${language === 'urdu' ? 'font-urdu text-base' : ''}`}>
                {language === 'urdu' ? 'آپ کی سرگزشت' : 'Your History'}
              </p>
              <p className="text-primary/40 text-[11px] font-medium">
                {language === 'urdu' ? 'پچھلی گفتگو اور دستاویزات دیکھیں' : 'View past chats and documents'}
              </p>
            </div>
          </div>
          <ChevronRight className={`w-5 h-5 text-primary/30 group-hover:text-accent transition-colors ${language === 'urdu' ? 'rotate-180' : ''}`} />
        </button>
      </main>
    </div>
  );
};

export default Dashboard;
