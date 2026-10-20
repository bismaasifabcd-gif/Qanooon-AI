import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Search, 
  Phone, 
  Globe, 
  Star, 
  Navigation,
  ShieldCheck,
  Scale,
  Gavel,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { KanoonLogo, LawyerProfessionalAvatar, LawyerSearchHeroIllustration } from '../components/SvgAssets';
import FeatureGuide from '../components/FeatureGuide';
import logo from '../assets/logo.png';

const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Quetta', 
  'Faisalabad', 'Multan', 'Rawalpindi', 'Gujranwala', 'Sialkot'
];

const LAW_TYPES = [
  'Family Law', 'Criminal Law', 'Property Law', 
  'Cyber Crime', 'Labour Law', 'Constitutional Law'
];

const LawyerSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  
  const [selectedCity, setSelectedCity] = useState('Lahore');
  
  // Prefill the specialty based on chatbot navigation state, default to Criminal Law
  const [selectedType, setSelectedType] = useState(location.state?.prefilledSpecialty || 'Criminal Law');
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const API_BASE = (
    import.meta.env.VITE_API_URL ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
  ).replace(/\/$/, '');

  const fetchLawyers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/lawyers?city=${encodeURIComponent(selectedCity)}&category=${encodeURIComponent(selectedType)}`
      );
      if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
      const data = await res.json();

      const mapped = (data.lawyers || []).map((l, index) => ({
        id: l.id || index,
        name: l.name,
        specialty: l.specialty && l.specialty !== 'General Practice' ? l.specialty : selectedType,
        rating: 'N/A',
        reviews: 0,
        experience: l.source === 'bar' ? 'Bar Association' : 'Listed Practice',
        status: 'Listed',
        address: l.address,
        phone: l.phone,
        website: l.website,
        lat: l.lat,
        lon: l.lon,
      }));

      setLawyers(mapped);
    } catch (err) {
      console.error('Lawyer lookup error:', err);
      setError(
        language === 'urdu'
          ? 'وکلاء کی فہرست حاصل کرنے میں دشواری ہوئی۔ دوبارہ کوشش کریں۔'
          : 'Could not load lawyers right now. Please try again.'
      );
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedType]);

  const lawyerGuideSteps = language === 'urdu'
    ? [
        { title: 'وکیل تلاش', text: 'اوپر سے شہر اور قانون کی قسم منتخب کریں — فہرست خود اپ ڈیٹ ہو جائے گی۔' },
        { title: 'رابطہ کریں', text: '"کال کریں" سے فون کریں یا "راستہ دیکھیں" سے نقشے پر مقام دیکھیں۔' },
      ]
    : [
        { title: 'Find a Lawyer', text: 'Pick your city and law type above — the list updates automatically.' },
        { title: 'Reach out', text: 'Use “Call Now” to phone, or “Directions” to open the office on the map.' },
      ];

  return (
    <div className="min-h-screen bg-surface pb-28">
      <FeatureGuide steps={lawyerGuideSteps} storageKey="qanoon_guide_lawyer" language={language} />
      {/* Header — rectangular, matches dashboard */}
      <header className="bg-primary px-5 md:px-8 pt-6 pb-6 border-b-2 border-accent/30">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Top row */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all flex-shrink-0">
              <ArrowLeft className={`w-5 h-5 ${language === 'urdu' ? 'rotate-180' : ''}`} />
            </button>
            <img src={logo} alt="Qanoon AI Logo" className="app-logo w-9 h-9 object-cover border border-white/10" />
            <h1 className={`text-white text-xl md:text-2xl font-black ${language === 'urdu' ? 'font-urdu text-2xl' : ''}`}>
              {t.findLawyer}
            </h1>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative group">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white/10 border border-white/10 focus:border-accent/50 rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-all appearance-none font-semibold text-sm"
              >
                {PAKISTAN_CITIES.map(c => <option key={c} value={c} className="text-primary">{c}</option>)}
              </select>
            </div>
            <div className="relative group">
              <Gavel className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-accent transition-colors" />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white/10 border border-white/10 focus:border-accent/50 rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-all appearance-none font-semibold text-sm"
              >
                {LAW_TYPES.map(t => <option key={t} value={t} className="text-primary">{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 md:px-8 pt-6 relative z-20 space-y-5">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className={`text-primary font-black text-base ${language === 'urdu' ? 'font-urdu text-lg' : ''}`}>
            {language === 'urdu' ? `${selectedCity} میں وکلاء` : `Lawyers in ${selectedCity}`}
          </h2>
          <span className="text-primary/40 font-bold text-xs">{lawyers.length} {language === 'urdu' ? '' : 'found'}</span>
        </div>

        {/* Lawyer Cards List */}
        <div className="space-y-3">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white h-36 rounded-xl animate-pulse shadow-sm border border-primary/8" />
            ))
          ) : error ? (
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-primary/8">
              <p className="text-primary/60 font-bold text-sm">{error}</p>
              <button onClick={fetchLawyers} className="mt-4 bg-primary text-white font-bold py-2.5 px-6 rounded-lg text-xs hover:bg-navy-light transition-all">
                {language === 'urdu' ? 'دوبارہ کوشش کریں' : 'Retry'}
              </button>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-primary/8">
              <p className="text-primary/60 font-bold text-sm">
                {language === 'urdu'
                  ? `${selectedCity} میں کوئی وکیل نہیں ملا۔ کسی اور شہر کا انتخاب کریں۔`
                  : `No lawyers found in ${selectedCity}. Try another city.`}
              </p>
            </div>
          ) : (
            lawyers.map((lawyer, index) => (
              <div 
                key={lawyer.id}
                className="bg-white rounded-xl shadow-sm border border-primary/8 overflow-hidden transition-all duration-200 hover:border-accent/30 hover:shadow-md group"
              >
                <div className="p-4 md:p-5">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                    {/* Lawyer Identity */}
                    <div className="flex items-start space-x-4 md:space-x-6 rtl:space-x-reverse w-full">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/5 rounded-lg flex items-center justify-center border border-primary/8 overflow-hidden">
                          <LawyerProfessionalAvatar initials={lawyer.name.split(' ').map(w => w[0]).join('').substring(0, 3)} seedIndex={index} className="w-full h-full" />
                        </div>
                      </div>
                      
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className={`text-base md:text-lg font-black text-primary line-clamp-2 ${language === 'urdu' ? 'font-urdu text-lg' : ''}`}>
                          {lawyer.name}
                        </h3>
                        <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                          <Briefcase className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                          <p className="text-primary/60 font-bold text-[10px] md:text-xs uppercase tracking-wide truncate">{lawyer.specialty}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
                          <span className="text-success font-black text-[10px] md:text-xs uppercase bg-success/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {lawyer.experience}
                          </span>
                          {lawyer.phone !== 'N/A' && (
                            <span className="text-accent font-black text-[10px] md:text-xs uppercase bg-accent/5 px-2 py-0.5 rounded-md">
                              {language === 'urdu' ? 'فون دستیاب' : 'Phone listed'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-48">
                      <button 
                        onClick={() => {
                          localStorage.setItem('kanoon_status_lawyer', 'true');
                          lawyer.phone !== 'N/A' && (window.location.href = `tel:${lawyer.phone}`);
                        }}
                        className={`w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-navy-light transition-all active:scale-95 text-xs md:text-sm ${lawyer.phone === 'N/A' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{language === 'urdu' ? 'کال کریں' : 'Call Now'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          localStorage.setItem('kanoon_status_lawyer', 'true');
                          const dest = (lawyer.lat && lawyer.lon)
                            ? `https://www.google.com/maps/dir/?api=1&destination=${lawyer.lat},${lawyer.lon}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.name + ' ' + lawyer.address)}`;
                          window.open(dest, '_blank');
                        }}
                        className="w-full border border-primary/10 hover:bg-primary/5 text-primary font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs md:text-sm"
                      >
                        <Navigation className="w-4 h-4 flex-shrink-0" />
                        <span>{language === 'urdu' ? 'راستہ دیکھیں' : 'Directions'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Badge */}
                  <div className="mt-4 pt-3 border-t border-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-primary/40 min-w-0">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">{lawyer.address}</span>
                    </div>
                    <button 
                      onClick={() => {
                        localStorage.setItem('kanoon_status_lawyer', 'true');
                        const link = lawyer.website
                          ? lawyer.website
                          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lawyer.name + ' ' + lawyer.address)}`;
                        window.open(link, '_blank');
                      }}
                      className="text-accent hover:underline flex items-center space-x-1 rtl:space-x-reverse text-[9px] md:text-[10px] font-black uppercase tracking-widest self-end sm:self-auto"
                    >
                      <span>{lawyer.website ? (language === 'urdu' ? 'ویب سائٹ' : 'Website') : (language === 'urdu' ? 'نقشے پر دیکھیں' : 'View on Map')}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Data-source note */}
      <div className="mt-6 mb-16 text-center px-6">
        <p className="text-primary/25 text-[9px] font-bold uppercase tracking-widest">
          {language === 'urdu' ? 'ڈیٹا: اوپن اسٹریٹ میپ و بار ایسوسی ایشنز' : 'Data: OpenStreetMap & Bar Associations'}
        </p>
      </div>
    </div>
  );
};

export default LawyerSearch;
