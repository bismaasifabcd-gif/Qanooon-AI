import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { OnboardingNameIllustration, LanguageGlobeIllustration } from '../components/SvgAssets';
import logo from '../assets/logo.png';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const { language, setLanguage: updateAppLanguage } = useLanguage();

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        preferredLanguage: selectedLanguage,
        createdAt: new Date(),
        onboardingComplete: true,
        settings: {
          autoReadResponses: false,
          saveChatHistory: true,
          voiceSpeed: 1.0,
          fontSize: "medium",
          theme: "light",
          notifications: true
        }
      });
      updateAppLanguage(selectedLanguage);
      await refreshUserData();
      navigate('/dashboard');
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const ur = language === 'urdu';

  return (
    <div className="h-[100dvh] bg-surface flex flex-col items-center justify-center px-5 py-6 relative overflow-hidden">
      {/* Background glows (viewport-scaled) */}
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] bg-accent/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] bg-primary/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />

      {/* Brand */}
      <div className="absolute top-6 left-0 right-0 flex items-center justify-center gap-2">
        <img src={logo} alt="Qanoon AI" className="app-logo w-7 h-7 object-cover" />
        <span className="text-primary font-black text-sm tracking-tight">Qanoon AI</span>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-16 left-0 right-0 flex justify-center gap-2">
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-10 bg-accent' : 'w-4 bg-primary/10'}`} 
          />
        ))}
      </div>

      <div className="w-full max-w-sm relative z-10">
        {step === 1 && (
          <div className="flex flex-col items-center gap-6 animate-fade-up">
            <OnboardingNameIllustration className="w-24 h-24 sm:w-28 sm:h-28" />
            <div className="text-center space-y-1.5">
              <h1 className={`text-2xl sm:text-3xl font-black text-primary leading-tight ${ur ? 'font-urdu' : ''}`}>
                {ur ? 'آپ کا نام کیا ہے؟' : 'What should we call you?'}
              </h1>
              <p className={`text-primary/45 text-sm font-medium ${ur ? 'font-urdu' : ''}`}>
                {ur ? 'تاکہ ہم آپ سے بہتر بات کر سکیں۔' : "So we can personalise your experience."}
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={ur ? 'پورا نام' : 'Full name'}
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) setStep(2); }}
              className={`w-full bg-white border border-primary/10 focus:border-accent rounded-xl py-3.5 px-5 text-center text-lg text-primary font-bold shadow-sm transition-all outline-none placeholder:text-primary/20 ${ur ? 'font-urdu' : ''}`}
            />

            <button
              onClick={() => name.trim() && setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-accent text-primary font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#B3933C] transition-all disabled:opacity-40 text-sm"
            >
              <span>{ur ? 'آگے بڑھیں' : 'Continue'}</span>
              <ArrowRight className={`w-5 h-5 ${ur ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-6 animate-fade-up">
            <LanguageGlobeIllustration className="w-24 h-24 sm:w-28 sm:h-28" />
            <div className="text-center space-y-1.5">
              <h1 className={`text-2xl sm:text-3xl font-black text-primary leading-tight ${ur ? 'font-urdu' : ''}`}>
                {ur ? 'اپنی زبان منتخب کریں' : 'Choose your language'}
              </h1>
              <p className={`text-primary/45 text-sm font-medium ${ur ? 'font-urdu' : ''}`}>
                {ur ? 'آپ اسے بعد میں سیٹنگز سے بدل سکتے ہیں۔' : 'You can change this anytime in settings.'}
              </p>
            </div>

            <div className="w-full grid grid-cols-1 gap-3">
              {[
                { id: 'english', label: 'English', sub: 'Standard legal English' },
                { id: 'urdu', label: 'اردو', sub: 'مکمل اردو سپورٹ', urdu: true }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`relative p-4 rounded-xl border transition-all flex items-center justify-between text-left ${
                    selectedLanguage === lang.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-primary/10 bg-white hover:border-accent/30'
                  }`}
                >
                  <div>
                    <p className={`text-lg font-black text-primary ${lang.urdu ? 'font-urdu' : ''}`}>{lang.label}</p>
                    <p className="text-primary/40 text-[11px] font-bold">{lang.sub}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    selectedLanguage === lang.id ? 'bg-accent text-primary scale-100' : 'bg-primary/5 text-transparent scale-50'
                  }`}>
                    <Check className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full bg-accent text-primary font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#B3933C] transition-all disabled:opacity-40 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>{ur ? 'مکمل کریں' : 'Finish Setup'}</span>
                  <ShieldCheck className="w-5 h-5" />
                </>
              )}
            </button>
            
            <button 
              onClick={() => setStep(1)} 
              className={`text-primary/35 font-bold hover:text-primary transition-colors text-xs ${ur ? 'font-urdu' : ''}`}
            >
              {ur ? 'واپس جائیں' : 'Go back'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
