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

  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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

  return (
    <div className="min-h-screen bg-surface pb-28">
      {/* Premium Header */}
      <header className="bg-primary pt-10 pb-20 md:pt-14 md:pb-28 px-4 sm:px-6 rounded-b-[2.5rem] md:rounded-b-[4rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute right-16 bottom-0 w-40 h-40 opacity-15 pointer-events-none hidden md:block">
          <LawyerSearchHeroIllustration className="w-full h-full" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center space-x-3 md:space-x-4 rtl:space-x-reverse">
              <button onClick={() => navigate('/dashboard')} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10">
                <ArrowLeft className={`w-5 h-5 md:w-6 md:h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
              </button>
              <img src={logo} alt="Kanoon AI Logo" className="app-logo w-8 h-8 md:w-9 md:h-9 object-cover" />
              <h1 className={`text-white text-2xl md:text-3xl font-black ${language === 'urdu' ? 'font-urdu text-3xl' : ''}`}>
                {t.findLawyer}
              </h1>
            </div>
          </div>

          {/* Search/Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="relative group">
              <MapPin className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors" />
              <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white/10 border-2 border-white/5 focus:border-accent/50 rounded-xl md:rounded-2xl py-3.5 pl-12 pr-4 md:py-5 md:pl-16 md:pr-6 text-white outline-none backdrop-blur-xl transition-all appearance-none font-bold text-sm md:text-base"
              >
                {PAKISTAN_CITIES.map(c => <option key={c} value={c} className="text-primary">{c}</option>)}
              </select>
            </div>
            <div className="relative group">
              <Gavel className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-accent transition-colors" />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white/10 border-2 border-white/5 focus:border-accent/50 rounded-xl md:rounded-2xl py-3.5 pl-12 pr-4 md:py-5 md:pl-16 md:pr-6 text-white outline-none backdrop-blur-xl transition-all appearance-none font-bold text-sm md:text-base"
              >
                {LAW_TYPES.map(t => <option key={t} value={t} className="text-primary">{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 relative z-20 space-y-6 md:space-y-8">
        {/* Results Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Filter className="w-4 h-4 text-accent" />
            <span className="text-primary font-black text-xs md:text-sm uppercase tracking-widest">Available Experts</span>
          </div>
          <span className="text-primary/30 font-bold text-[10px] md:text-xs">{lawyers.length} Results</span>
        </div>

        {/* Lawyer Cards List */}
        <div className="space-y-4 md:space-y-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white h-48 rounded-[2rem] md:rounded-[2.5rem] animate-pulse shadow-xl border border-primary/5" />
            ))
          ) : error ? (
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-xl border border-primary/5">
              <p className="text-primary/60 font-bold text-sm">{error}</p>
              <button onClick={fetchLawyers} className="mt-4 bg-primary text-white font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-navy-light transition-all">
                {language === 'urdu' ? 'دوبارہ کوشش کریں' : 'Retry'}
              </button>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-8 text-center shadow-xl border border-primary/5">
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
                className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-primary/5 border border-primary/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 group"
              >
                <div className="p-5 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                    {/* Lawyer Identity */}
                    <div className="flex items-start space-x-4 md:space-x-6 rtl:space-x-reverse w-full">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/5 rounded-2xl md:rounded-3xl flex items-center justify-center border-2 border-primary/5 group-hover:border-accent transition-all overflow-hidden">
                          <LawyerProfessionalAvatar initials={lawyer.name.split(' ').map(w => w[0]).join('').substring(0, 3)} seedIndex={index} className="w-full h-full" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[7px] md:text-[8px] font-black uppercase tracking-tighter shadow-lg ${
                          lawyer.status === 'Available' ? 'bg-success text-white' : 'bg-red-500 text-white'
                        }`}>
                          {lawyer.status}
                        </div>
                      </div>
                      
                      <div className="space-y-1 min-w-0 flex-1">
                        <h3 className={`text-lg md:text-2xl font-black text-primary truncate ${language === 'urdu' ? 'font-urdu text-xl' : ''}`}>
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
                        className={`w-full bg-primary text-white font-bold py-3 md:py-4 px-4 rounded-xl md:rounded-2xl flex items-center justify-center space-x-2 shadow-xl shadow-primary/10 hover:bg-navy-light transition-all active:scale-95 text-xs md:text-sm ${lawyer.phone === 'N/A' ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        className="w-full border-2 border-primary/5 hover:bg-primary/5 text-primary font-bold py-3 md:py-4 px-4 rounded-xl md:rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 text-xs md:text-sm"
                      >
                        <Navigation className="w-4 h-4 flex-shrink-0" />
                        <span>{language === 'urdu' ? 'راستہ دیکھیں' : 'Directions'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Address Badge */}
                  <div className="mt-6 pt-4 border-t border-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

      {/* Trust Seal */}
      <div className="mt-8 mb-16 flex flex-col items-center justify-center space-y-3 px-6 text-center opacity-30">
        <div className="w-12 h-12 bg-primary/5 rounded-[1.2rem] flex items-center justify-center border border-primary/5 p-2">
          <KanoonLogo className="w-full h-full" />
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.4em] max-w-[200px]">
          Kanoon AI Verified Legal Professional Network
        </p>
      </div>
    </div>
  );
};

export default LawyerSearch;
