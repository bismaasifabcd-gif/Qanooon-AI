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
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse z-0" />

      <div className="max-w-4xl space-y-12 relative z-10 animate-fade-up flex flex-col items-center">
        {/* Animated Hero Illustration */}
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-accent/15 rounded-full blur-3xl animate-scale-pulse" />
          <SplashHeroIllustration className="w-40 h-40 animate-float" />
        </div>

        {/* Premium Tagline */}
        <div className="inline-flex items-center space-x-2 bg-accent/10 px-6 py-2.5 rounded-full border border-accent/20 animate-bounce shadow-lg shadow-accent/5">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-accent font-black text-xs uppercase tracking-[0.2em]">
            {language === 'urdu' ? 'پاکستان کا پہلا AI قانونی اسسٹنٹ' : 'Pakistan\'s First AI Legal Assistant'}
          </span>
        </div>
        
        {/* Main Heading */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center justify-center">
            <KanoonLogo className="w-16 h-16 mr-4" />
            <h1 className={`text-6xl md:text-8xl font-black text-primary leading-tight tracking-tighter ${language === 'urdu' ? 'font-urdu' : ''}`}>
              {t.welcomeTitle}
            </h1>
          </div>
          <div className="h-2 w-24 bg-accent mx-auto rounded-full" />
        </div>
        
        {/* Subtitle */}
        <p className={`text-xl md:text-3xl text-primary/40 max-w-3xl mx-auto leading-relaxed font-medium ${language === 'urdu' ? 'font-urdu' : ''}`}>
          {t.welcomeSubtitle}
        </p>
        
        {/* CTA Section */}
        <div className="flex flex-col items-center space-y-6 pt-8 w-full">
          <button 
            onClick={() => navigate('/auth')}
            className="btn-justice w-full max-w-md py-6 text-2xl group shadow-2xl shadow-accent/20"
          >
            <Zap className="w-6 h-6 mr-2 fill-primary" />
            <span>{t.getStarted}</span>
            <ArrowRight className={`w-6 h-6 ml-3 transition-transform group-hover:translate-x-2 ${language === 'urdu' ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="flex items-center space-x-8 text-primary/20">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Grounded Advice</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Secure</span>
            </div>
          </div>
        </div>

        {/* Features Preview (Micro-cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full">
          {[
            { icon: MessageSquare, label: 'AI Chat' },
            { icon: KanoonLogo, label: 'Legal Library' },
            { icon: Globe, label: 'Bilingual' },
            { icon: Zap, label: 'Instant' }
          ].map((f, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-sm border border-primary/5 p-4 rounded-3xl flex flex-col items-center space-y-2 hover:bg-white transition-all shadow-sm">
              {typeof f.icon === 'function' || typeof f.icon === 'object' ? (
                <f.icon className="w-5 h-5 text-accent" />
              ) : (
                <f.icon className="w-5 h-5 text-accent" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Justice Badge */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center opacity-10">
        <KanoonLogo className="w-8 h-8" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] mt-2">Kanoon AI Infrastructure</p>
      </div>
    </div>
  );
};

export default Home;
