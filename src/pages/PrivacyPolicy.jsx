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
      footer: "For privacy concerns, contact: privacy@kanoon-ai.com"
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
      footer: "رازداری کے خدشات کے لیے رابطہ کریں: privacy@kanoon-ai.com"
    }
  };

  const current = content[activeLang];

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <header className="bg-primary px-6 py-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        {/* Back and Logo Row */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-6 z-10 relative">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img src={logo} alt="Kanoon AI Logo" className="app-logo w-9 h-9 object-cover" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className={`text-accent text-3xl font-black mb-2 ${activeLang === 'urdu' ? 'font-urdu' : 'font-heading'}`}>
            {current.title}
          </h1>
          <p className={`text-white/60 text-sm font-medium ${activeLang === 'urdu' ? 'font-urdu' : ''}`}>
            {current.tagline}
          </p>
        </div>
      </header>

      {/* Language Toggle */}
      <div className="flex justify-center -mt-6 relative z-10">
        <div className="bg-white rounded-full shadow-xl border border-primary/5 p-1 flex">
          <button 
            onClick={() => setActiveLang('urdu')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeLang === 'urdu' ? 'bg-primary text-white' : 'text-primary/40'}`}
          >
            اردو
          </button>
          <button 
            onClick={() => setActiveLang('english')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeLang === 'english' ? 'bg-primary text-white' : 'text-primary/40'}`}
          >
            English
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {current.sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-primary/5 hover:shadow-md transition-all">
            <div className={`flex items-center space-x-4 mb-6 ${activeLang === 'urdu' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="p-3 bg-accent/10 rounded-xl">
                <section.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className={`text-xl font-bold text-primary ${activeLang === 'urdu' ? 'font-urdu' : ''}`}>
                {section.title}
              </h3>
            </div>
            <ul className={`space-y-4 ${activeLang === 'urdu' ? 'text-right' : ''}`}>
              {section.items.map((item, i) => (
                <li key={i} className={`flex items-start space-x-3 ${activeLang === 'urdu' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  <p className={`text-primary/60 font-medium ${activeLang === 'urdu' ? 'font-urdu text-lg' : 'text-sm'}`}>
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-primary/5 rounded-2xl p-6 text-center border-2 border-dashed border-primary/10">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Mail className="w-4 h-4 text-primary/40" />
            <p className="text-primary font-bold text-sm">{current.footer}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
