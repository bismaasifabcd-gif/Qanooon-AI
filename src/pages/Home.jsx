import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Zap, 
  MessageSquare,
  Lock
} from 'lucide-react';
import { KanoonLogo, SplashHeroIllustration } from '../components/SvgAssets';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Home = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      const checkOnboardingAndRedirect = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          if (userData?.name && userData?.name !== '') {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } catch (error) {
          console.error("Error checking user doc on home page:", error);
          navigate('/onboarding');
        }
      };
      checkOnboardingAndRedirect();
    }
  }, [user, navigate]);

  return (
    <div className="h-[100dvh] bg-surface flex flex-col items-center justify-center px-5 py-6 text-center relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse z-0" />

      <div className="w-full max-w-md relative z-10 animate-fade-up flex flex-col items-center justify-center gap-5 sm:gap-6">
        {/* Hero Illustration */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/15 rounded-full blur-3xl animate-scale-pulse" />
          <SplashHeroIllustration className="w-24 h-24 sm:w-28 sm:h-28 animate-float relative z-10" />
        </div>

        {/* Premium Tagline */}
        <div className="inline-flex items-center space-x-2 bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          <span className="text-accent font-black text-[10px] uppercase tracking-[0.15em]">
            {language === 'urdu' ? 'پاکستان کا پہلا AI قانونی اسسٹنٹ' : "Pakistan's First AI Legal Assistant"}
          </span>
        </div>

        {/* Main Heading */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-3">
            <KanoonLogo className="w-11 h-11 sm:w-12 sm:h-12" />
            <h1 className={`text-5xl sm:text-6xl font-black text-primary leading-none tracking-tighter ${language === 'urdu' ? 'font-urdu' : ''}`}>
              {t.welcomeTitle}
            </h1>
          </div>
          <div className="h-1.5 w-20 bg-accent rounded-full" />
        </div>

        {/* Subtitle */}
        <p className={`text-sm sm:text-base text-primary/50 max-w-sm mx-auto leading-relaxed font-medium ${language === 'urdu' ? 'font-urdu text-base sm:text-lg' : ''}`}>
          {t.welcomeSubtitle}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/auth')}
          className="btn-justice w-full max-w-xs py-4 text-lg group shadow-xl shadow-accent/20 mt-1"
        >
          <Zap className="w-5 h-5 mr-2 fill-primary" />
          <span>{t.getStarted}</span>
          <ArrowRight className={`w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 ${language === 'urdu' ? 'rotate-180' : ''}`} />
        </button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-primary/30">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Grounded</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Secure</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Bilingual</span>
          </div>
        </div>

        {/* Feature chips */}
        <div className="grid grid-cols-4 gap-2 w-full pt-1">
          {[
            { icon: MessageSquare, label: 'AI Chat' },
            { icon: KanoonLogo, label: 'Library' },
            { icon: Globe, label: 'Urdu/Eng' },
            { icon: Zap, label: 'Instant' },
          ].map((f, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-sm border border-primary/5 py-2.5 rounded-2xl flex flex-col items-center gap-1 shadow-sm">
              <f.icon className="w-4 h-4 text-accent" />
              <span className="text-[8px] font-black uppercase tracking-wider text-primary/40">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
