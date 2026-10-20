import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  BookOpen, 
  Clock, 
  User, 
  Settings as SettingsIcon,
  Bell,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
  Gavel,
  CheckCircle2,
  Calendar,
  FileText
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { KanoonLogo, DashboardCompassIllustration } from '../components/SvgAssets';
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
        className="bg-white p-4.5 rounded-[2rem] border border-primary/5 shadow-lg shadow-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 flex flex-col justify-between text-left rtl:text-right group relative overflow-hidden active:scale-95"
      >
        <div className="space-y-4 w-full">
          {/* Picture Header with aspect ratio */}
          <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden border border-primary/5 shadow-inner relative">
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-all duration-500 z-10 pointer-events-none" />
            <img 
              src={feature.image} 
              alt={feature.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>

          <div className="space-y-1 px-1">
            <h3 className={`text-base font-black text-primary group-hover:text-accent transition-colors truncate ${language === 'urdu' ? 'font-urdu text-lg leading-normal' : ''}`}>
              {feature.title}
            </h3>
            <p className={`text-primary/45 font-semibold text-[10px] leading-snug line-clamp-2 h-8 ${language === 'urdu' ? 'font-urdu text-[13px] leading-normal h-10' : ''}`}>
              {feature.desc}
            </p>
          </div>
        </div>

        <div className="mt-4 px-1 flex items-center justify-between text-accent group-hover:text-primary transition-colors w-full">
          <span className="text-[9px] font-black uppercase tracking-widest">{language === 'urdu' ? 'شروع کریں' : 'Launch'}</span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${language === 'urdu' ? 'rotate-180' : ''}`} />
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-surface pb-24 animate-smooth-fade-in">
      {/* Premium Header */}
      <header className="bg-primary pt-14 pb-20 px-6 rounded-b-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          {/* Logo row */}
          <div className="flex justify-between items-center">
            <img src={logo} alt="Kanoon AI Logo" className="app-logo w-10 h-10 object-cover shadow-lg border border-white/10" />
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button 
                onClick={() => navigate('/profile')}
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10 shadow-lg"
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10 shadow-lg"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-accent text-[10px] font-black uppercase tracking-[0.3em] opacity-80">{language === 'urdu' ? 'مین ڈیش بورڈ' : 'Citizen Workspace'}</p>
            <h1 className={`text-white text-3xl md:text-4xl font-black flex items-center ${language === 'urdu' ? 'font-urdu text-4xl leading-relaxed' : ''}`}>
              {t.dashboardGreeting}{userData?.name || 'User'}
              <span className="ml-2.5 animate-bounce">👋</span>
            </h1>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="max-w-4xl mx-auto mt-10 relative z-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors" />
            <input 
              type="text"
              placeholder={language === 'urdu' ? 'قانون تلاش کریں یا سوال پوچھیں...' : 'Search Pakistan penal codes, constitutional acts or ask a question...'}
              className="w-full bg-white/10 border-2 border-white/5 focus:border-accent/40 rounded-[2rem] py-5 pl-16 pr-6 text-white placeholder:text-white/30 outline-none backdrop-blur-xl transition-all shadow-inner text-sm font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent text-primary p-2.5 rounded-xl shadow-lg border border-accent/20">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 space-y-8">
        {/* Quick Highlights Slider */}
        <div className="flex space-x-4 overflow-x-auto pb-2 no-scrollbar rtl:space-x-reverse">
          <div className="flex-shrink-0 bg-success/10 border border-success/20 px-6 py-3.5 rounded-2xl flex items-center space-x-3 rtl:space-x-reverse shadow-lg shadow-success/5 animate-fade-up">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-success font-black text-xs whitespace-nowrap">{language === 'urdu' ? 'اپ ڈیٹ: خاندانی قوانین 2024 شامل' : 'Integrated: Muslim Family Laws Ordinance 2024'}</span>
          </div>
          <div className="flex-shrink-0 bg-accent/10 border border-accent/20 px-6 py-3.5 rounded-2xl flex items-center space-x-3 rtl:space-x-reverse shadow-lg shadow-accent/5 animate-fade-up">
            <ShieldAlert className="w-4 h-4 text-accent" />
            <span className="text-accent font-black text-xs whitespace-nowrap">{language === 'urdu' ? 'تصدیق شدہ وکلاء آن لائن ہیں' : 'PWA Support Enabled: Safe Offline Access'}</span>
          </div>
        </div>

        {/* Dashboard Compass Spotlight Banner */}
        <div className="card-premium overflow-hidden border border-accent/10 shadow-2xl relative group rounded-[2.5rem]">
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
          <DashboardCompassIllustration className="w-full relative z-0" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {features.map(f => <FeatureCard key={f.id} feature={f} />)}
        </div>

        {/* Premium Daily Legal Tip Section */}
        <div className="bg-gradient-to-br from-primary to-navy-light rounded-[2.5rem] p-8 border border-accent/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-4 max-w-2xl text-left rtl:text-right">
              <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-accent font-black text-[10px] uppercase tracking-widest">
                  {language === 'urdu' ? 'آج کا قانونی مشورہ' : 'Daily Legal Insight'}
                </span>
              </div>
              
              <div className="space-y-2.5">
                <h3 className={`text-white text-2xl font-black ${language === 'urdu' ? 'font-urdu text-3xl leading-relaxed' : ''}`}>
                  {language === 'urdu' ? 'تحریری معاہدوں کی اہمیت اور تعزیرات پاکستان' : 'The Legal Supremacy of Written Contracts'}
                </h3>
                <p className={`text-white/60 font-medium leading-relaxed text-sm ${language === 'urdu' ? 'font-urdu text-lg leading-relaxed' : ''}`}>
                  {language === 'urdu' ? 'معاہدہ ایکٹ 1872 کے تحت، ہمیشہ معاہدوں کو سٹیمپ پیپر پر تحریری شکل میں نافذ کریں۔ زبانی وعدوں کو پاکستانی عدالتوں میں ثابت کرنا انتہائی مشکل ہوتا ہے۔' : 'Under the Contract Act 1872, always execute financial or property agreements in writing on valid stamp paper. Oral contracts, while technically valid, are exceptionally difficult to prove in Pakistani civil courts.'}
                </p>
              </div>
            </div>
            
            <button className="flex-shrink-0 w-16 h-16 bg-accent rounded-[1.8rem] flex items-center justify-center text-primary shadow-lg shadow-accent/20 hover:scale-105 transition-all duration-300 border border-accent/30">
              <Gavel className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Premium Recent Activity Section */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-primary/5 shadow-xl shadow-primary/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 text-left rtl:text-right">
              <h4 className={`text-primary font-black text-2xl ${language === 'urdu' ? 'font-urdu text-3xl' : ''}`}>{language === 'urdu' ? 'حالیہ سرگرمی' : 'Recent Session History'}</h4>
              <p className="text-primary/30 text-xs font-medium">{language === 'urdu' ? 'آپ کی حالیہ تلاش اور مشاورت' : 'Keep track of your active inquiries'}</p>
            </div>
            <button 
              onClick={() => navigate('/history')}
              className="text-accent hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest bg-accent/5 px-4 py-2.5 rounded-xl border border-accent/15"
            >
              {language === 'urdu' ? 'تمام دیکھیں' : 'View History'}
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: MessageSquare,
                title: language === 'urdu' ? 'جائیداد کی وراثت کا سوال' : 'Property Inheritance Inquiry resolved',
                tag: language === 'urdu' ? 'چیٹ باٹ' : 'AskLex Session',
                time: language === 'urdu' ? '2 گھنٹے پہلے' : '2 hours ago',
                status: 'Completed',
                statusColor: 'bg-success/10 text-success border-success/20',
                statusIcon: CheckCircle2
              },
              {
                icon: User,
                title: language === 'urdu' ? 'سارہ خان (ایڈووکیٹ ہائی کورٹ)' : 'Advocate Sarah Khan consultation',
                tag: language === 'urdu' ? 'وکیل تلاش' : 'Lawyer Match',
                time: language === 'urdu' ? 'کل' : 'Yesterday',
                status: 'Contacted',
                statusColor: 'bg-accent/10 text-accent border-accent/20',
                statusIcon: Calendar
              },
              {
                icon: FileText,
                title: language === 'urdu' ? 'فیملی کورٹس ایکٹ 1964' : 'Muslim Family Courts Act 1964 researched',
                tag: language === 'urdu' ? 'لائبریری' : 'Law Library',
                time: language === 'urdu' ? '2 دن پہلے' : '2 days ago',
                status: 'Saved',
                statusColor: 'bg-primary/10 text-primary border-primary/20',
                statusIcon: FileText
              }
            ].map((activity, idx) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-surface rounded-[1.8rem] border border-primary/5 hover:border-accent/20 transition-all duration-300 gap-4 group"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse text-left rtl:text-right">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-md shadow-primary/5 group-hover:scale-105 transition-transform">
                    <activity.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className={`text-primary font-black text-sm ${language === 'urdu' ? 'font-urdu text-lg' : ''}`}>{activity.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-primary/30 text-[9px] font-black uppercase tracking-widest">{activity.tag}</span>
                      <span className="w-1 h-1 rounded-full bg-primary/20" />
                      <span className="text-primary/30 text-[9px] font-black uppercase tracking-widest">{activity.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-3 rtl:space-x-reverse">
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${activity.statusColor}`}>
                    <activity.statusIcon className="w-3 h-3" />
                    <span>{activity.status}</span>
                  </div>
                  <button 
                    onClick={() => navigate('/history')}
                    className="w-10 h-10 bg-white hover:bg-accent hover:text-primary rounded-xl flex items-center justify-center text-primary/30 hover:text-primary transition-all border border-primary/5 shadow-sm"
                  >
                    <ChevronRight className={`w-4 h-4 ${language === 'urdu' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Trust Badge Footer */}
      <footer className="mt-12 mb-20 flex flex-col items-center space-y-4 px-6 text-center">
        <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/5 shadow-inner animate-pulse">
          <KanoonLogo className="w-8 h-8 opacity-45" />
        </div>
        <p className="text-primary/20 text-[10px] font-bold uppercase tracking-[0.4em]">Justice Infrastructure for Pakistan</p>
      </footer>
    </div>
  );
};

export default Dashboard;
