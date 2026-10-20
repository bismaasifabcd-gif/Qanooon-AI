import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Mail, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/logo.png';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeLang, setActiveLang] = useState(language === 'urdu' ? 'urdu' : 'english');

  const content = {
    english: {
      title: "Privacy Policy",
      tagline: "Your legal privacy is our top priority.",
      sections: [
        {
          title: "1. Data We Collect",
          icon: Eye,
          items: ["Name and Email for account creation", "Legal chat history to provide context", "City and Phone (optional) for personalized help", "Device information for app performance"]
        },
        {
          title: "2. How We Use Your Data",
          icon: Info,
          items: ["To provide grounded legal advice via AI", "To improve our Pakistani Law database", "To facilitate lawyer searches", "Never sold to third-party advertisers"]
        },
        {
          title: "3. Data Storage & Security",
          icon: Lock,
          items: ["Stored securely on Google Cloud (Firebase)", "Encrypted in transit and at rest", "Regular security audits and updates"]
        },
        {
          title: "4. Your Rights",
          icon: Shield,
          items: ["Delete your account and all history anytime", "Request a download of your data", "Update your information in the Profile section"]
        }
      ],
      footer: "For privacy concerns, contact: support@qanoon-ai.app"
    },
    urdu: {
      title: "رازداری کی پالیسی",
      tagline: "آپ کی قانونی رازداری ہماری اولین ترجیح ہے۔",
      sections: [
        {
          title: "1. ہم جو ڈیٹا اکٹھا کرتے ہیں",
          icon: Eye,
          items: ["اکاؤنٹ بنانے کے لیے نام اور ای میل", "سیاق و سباق فراہم کرنے کے لیے چیٹ کی تاریخ", "شہر اور فون (اختیاری) برائے مدد", "ایپ کی کارکردگی کے لیے ڈیوائس کی معلومات"]
        },
        {
          title: "2. ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں",
          icon: Info,
          items: ["AI کے ذریعے قانونی مشورہ فراہم کرنے کے لیے", "ہمارے پاکستانی قانون کے ڈیٹا بیس کو بہتر بنانے کے لیے", "وکیل کی تلاش میں آسانی پیدا کرنے کے لیے", "کبھی بھی کسی تیسرے فریق کو فروخت نہیں کیا جاتا"]
        },
        {
          title: "3. ڈیٹا اسٹوریج اور سیکیورٹی",
          icon: Lock,
          items: ["گوگل کلاؤڈ (Firebase) پر محفوظ طریقے سے محفوظ", "منتقلی اور آرام کے وقت انکرپٹڈ", "باقاعدہ سیکیورٹی آڈٹ اور اپ ڈیٹس"]
        },
        {
          title: "4. آپ کے حقوق",
          icon: Shield,
          items: ["کسی بھی وقت اپنا اکاؤنٹ اور تمام ہسٹری حذف کریں", "اپنے ڈیٹا کے ڈاؤن لوڈ کی درخواست کریں", "پروفائل سیکشن میں اپنی معلومات کو اپ ڈیٹ کریں"]
        }
      ],
      footer: "رازداری کے خدشات کے لیے رابطہ کریں: support@qanoon-ai.app"
    }
  };

  const current = content[activeLang];

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header — rectangular, matches dashboard */}
      <header className="bg-primary px-5 md:px-8 pt-6 pb-6 border-b-2 border-accent/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={logo} alt="Qanoon AI Logo" className="app-logo w-9 h-9 object-cover border border-white/10" />
            <h1 className={`text-white text-xl md:text-2xl font-black ${activeLang === 'urdu' ? 'font-urdu text-2xl' : ''}`}>
              {current.title}
            </h1>
          </div>
          <p className={`text-white/50 text-sm font-medium ${activeLang === 'urdu' ? 'font-urdu text-base' : ''}`}>
            {current.tagline}
          </p>

          {/* Language Toggle */}
          <div className="inline-flex bg-white/10 rounded-lg p-1">
            <button 
              onClick={() => setActiveLang('english')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeLang === 'english' ? 'bg-accent text-primary' : 'text-white/50'}`}
            >
              English
            </button>
            <button 
              onClick={() => setActiveLang('urdu')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeLang === 'urdu' ? 'bg-accent text-primary' : 'text-white/50'}`}
            >
              اردو
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 pt-6 space-y-3">
        {current.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-primary/8">
            <div className={`flex items-center gap-3 mb-4 ${activeLang === 'urdu' ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className={`text-base font-black text-primary ${activeLang === 'urdu' ? 'font-urdu text-lg' : ''}`}>
                {section.title}
              </h3>
            </div>
            <ul className={`space-y-2.5 ${activeLang === 'urdu' ? 'text-right' : ''}`}>
              {section.items.map((item, i) => (
                <li key={i} className={`flex items-start gap-2.5 ${activeLang === 'urdu' ? 'flex-row-reverse' : ''}`}>
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <p className={`text-primary/60 font-medium ${activeLang === 'urdu' ? 'font-urdu text-base' : 'text-[13px]'}`}>
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/10 mb-8">
          <div className={`flex items-center justify-center gap-2 ${activeLang === 'urdu' ? 'flex-row-reverse' : ''}`}>
            <Mail className="w-4 h-4 text-primary/40 flex-shrink-0" />
            <p className="text-primary/70 font-bold text-xs break-all">{current.footer}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
