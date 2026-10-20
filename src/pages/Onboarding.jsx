import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { OnboardingNameIllustration, LanguageGlobeIllustration, KanoonLogo } from '../components/SvgAssets';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const { setLanguage: updateAppLanguage } = useLanguage();

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

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />

      {/* Progress Indicator */}
      <div className="absolute top-12 left-0 right-0 flex justify-center space-x-2">
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-accent' : 'w-4 bg-primary/10'}`} 
          />
        ))}
      </div>

      <div className="w-full max-w-md space-y-10 relative z-10">
        {step === 1 && (
          <div className="space-y-10 animate-fade-up">
            <div className="space-y-4 text-center">
              <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <OnboardingNameIllustration className="w-32 h-32" />
              </div>
              <h1 className="text-4xl font-black text-primary leading-tight">
                First, what should<br />we call you?
              </h1>
              <p className="text-primary/40 font-medium">Your legal journey starts with a name.</p>
            </div>

            <div className="relative group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                autoFocus
                className="w-full bg-white border-2 border-primary/5 focus:border-accent rounded-[2rem] py-6 px-8 text-2xl text-primary font-black shadow-2xl transition-all outline-none placeholder:text-primary/10 text-center"
              />
            </div>

            <button
              onClick={() => name && setStep(2)}
              disabled={!name}
              className="btn-justice w-full py-6 text-xl"
            >
              <span>Continue</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-fade-up">
            <div className="space-y-4 text-center">
              <div className="w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <LanguageGlobeIllustration className="w-32 h-32" />
              </div>
              <h1 className="text-4xl font-black text-primary leading-tight">
                Choose your<br />preferred language
              </h1>
              <p className="text-primary/40 font-medium">You can change this anytime in settings.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'english', label: 'English', sub: 'Standard legal English' },
                { id: 'urdu', label: 'اردو', sub: 'مکمل اردو سپورٹ (نستعلیق)', urdu: true }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className={`relative p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between text-left group ${
                    selectedLanguage === lang.id 
                      ? 'border-accent bg-accent/5 shadow-2xl shadow-accent/10' 
                      : 'border-primary/5 bg-white hover:border-accent/20'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-2xl font-black text-primary ${lang.urdu ? 'font-urdu' : ''}`}>{lang.label}</p>
                    <p className="text-primary/40 text-xs font-bold uppercase tracking-wider">{lang.sub}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    selectedLanguage === lang.id ? 'bg-accent text-primary rotate-0 scale-100' : 'bg-primary/5 text-transparent rotate-90 scale-50'
                  }`}>
                    <Check className="w-6 h-6" />
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="btn-justice w-full py-6 text-xl"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ShieldCheck className="w-6 h-6" />
                </>
              )}
            </button>
            
            <button 
              onClick={() => setStep(1)} 
              className="w-full text-primary/30 font-bold hover:text-primary transition-colors py-2"
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {/* Trust Badge */}
      <div className="mt-12 flex items-center space-x-2 text-primary/10">
        <KanoonLogo className="w-4 h-4 opacity-30" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Justice Infrastructure for Pakistan</span>
      </div>
    </div>
  );
};

export default Onboarding;
