import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  BookOpen,
  MessageSquare,
  Scale,
  Gavel,
  Library,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../contexts/LanguageContext';
import { lawsData, LAW_CATEGORY_LABELS } from '../data/laws';
import { searchLaws } from '../services/ragService';
import { KanoonLogo, LibraryBooksIllustration } from '../components/SvgAssets';
import logo from '../assets/logo.png';

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
).replace(/\/$/, '');

const BOOKMARK_KEY = 'kanoon_bookmarked_laws';

const LawLibrary = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedLawId, setExpandedLawId] = useState(null);
  const [aiResults, setAiResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [details, setDetails] = useState({});        // lawId -> markdown text
  const [loadingDetailId, setLoadingDetailId] = useState(null);

  const loadFullDetail = async (law) => {
    if (details[law.id]) return; // already loaded
    setLoadingDetailId(law.id);
    try {
      const res = await fetch(`${API_BASE}/api/law-detail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: law.title, language }),
      });
      if (!res.ok) throw new Error('detail failed');
      const data = await res.json();
      setDetails((prev) => ({ ...prev, [law.id]: data.detail || '' }));
    } catch {
      setDetails((prev) => ({
        ...prev,
        [law.id]: language === 'urdu'
          ? 'تفصیل حاصل کرنے میں دشواری ہوئی۔ دوبارہ کوشش کریں۔'
          : 'Could not load the full detail right now. Please try again.',
      }));
    } finally {
      setLoadingDetailId(null);
    }
  };

  // Load bookmarks from localStorage once.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || '[]');
      setBookmarks(Array.isArray(saved) ? saved : []);
    } catch { setBookmarks([]); }
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(next));
      return next;
    });
  };

  const categories = [
    { id: 'all', label: LAW_CATEGORY_LABELS.all, icon: Library },
    { id: 'criminal', label: LAW_CATEGORY_LABELS.criminal, icon: Gavel },
    { id: 'constitutional', label: LAW_CATEGORY_LABELS.constitutional, icon: ShieldCheck },
    { id: 'family', label: LAW_CATEGORY_LABELS.family, icon: Bookmark },
    { id: 'property', label: LAW_CATEGORY_LABELS.property, icon: Scale },
    { id: 'cyber', label: LAW_CATEGORY_LABELS.cyber, icon: Sparkles },
    { id: 'labour', label: LAW_CATEGORY_LABELS.labour, icon: FileText },
  ];

  // Smart (RAG) search across the PDF corpus — fires on longer queries.
  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.trim().length > 5) {
      setIsSearching(true);
      try {
        const results = await searchLaws(val);
        setAiResults(results || []);
      } catch { setAiResults([]); }
      setIsSearching(false);
    } else {
      setAiResults([]);
    }
  };

  const getPdfUrlByTitle = (title) => {
    const law = lawsData.find((l) => l.pdfUrl && l.pdfUrl.includes(title));
    return law ? law.pdfUrl : `/books/${title}`;
  };

  const openFullText = (law) => {
    if (law.pdfUrl) window.open(law.pdfUrl, '_blank');
    else if (law.sourceUrl) window.open(law.sourceUrl, '_blank');
  };

  const copyCitation = (law) => {
    const citation = `${law.title}${law.year ? ` (${law.year})` : ''}, ${law.province === 'federal' ? 'Federal' : law.province}, Pakistan.`;
    navigator.clipboard?.writeText(citation);
    setCopiedId(law.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Instant text filter + category + bookmark filter.
  const filteredLaws = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lawsData.filter((law) => {
      const matchesSearch =
        !q ||
        law.title.toLowerCase().includes(q) ||
        (law.titleUrdu || '').includes(searchQuery) ||
        (law.description || '').toLowerCase().includes(q) ||
        (law.keySections || []).some((s) => s.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;
      const matchesBookmark = !showBookmarksOnly || bookmarks.includes(law.id);
      return matchesSearch && matchesCategory && matchesBookmark;
    });
  }, [searchQuery, selectedCategory, showBookmarksOnly, bookmarks]);

  return (
    <div className="min-h-screen bg-surface pb-24">
      {/* Premium Header */}
      <header className="bg-primary pt-12 pb-24 px-6 rounded-b-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button onClick={() => navigate('/dashboard')} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all border border-white/10">
                <ArrowLeft className={`w-6 h-6 ${language === 'urdu' ? 'rotate-180' : ''}`} />
              </button>
              <img src={logo} alt="Kanoon AI Logo" className="app-logo w-9 h-9 object-cover" />
              <div>
                <h1 className={`text-white text-3xl font-black ${language === 'urdu' ? 'font-urdu text-4xl' : ''}`}>
                  {t.lawLibrary}
                </h1>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  {lawsData.length} Acts, Codes & Ordinances
                </p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={language === 'urdu' ? 'قانون، دفعہ یا موضوع تلاش کریں...' : 'Search any law, section or topic...'}
              className="w-full bg-white/10 border-2 border-white/5 focus:border-accent/50 rounded-[2rem] py-5 pl-16 pr-14 text-white placeholder:text-white/30 outline-none backdrop-blur-xl transition-all"
            />
            {searchQuery && (
              <button onClick={() => handleSearch('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-14 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 relative z-20 space-y-6 md:space-y-8">
        {/* AI SEARCH RESULTS (REAL DATA FROM BOOKS) */}
        {aiResults.length > 0 && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2 text-accent">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                  {language === 'urdu' ? 'اسمارٹ سیکشن تلاش' : 'Smart Section Discovery'}
                </span>
              </div>
              <span className="text-primary/30 text-[9px] md:text-[10px] font-bold uppercase">Exact Page Match</span>
            </div>
            {aiResults.map((res, i) => (
              <div key={i} className="bg-primary/95 backdrop-blur-xl rounded-[1.7rem] md:rounded-[2rem] p-5 md:p-8 border border-accent/20 shadow-2xl group hover:border-accent/50 transition-all">
                <div className="flex justify-between items-start mb-4 md:mb-6 gap-2">
                  <div className="space-y-1">
                    <div className="bg-accent/10 px-3 py-0.5 md:px-4 md:py-1 rounded-full border border-accent/20 inline-block max-w-[200px] sm:max-w-xs truncate">
                      <span className="text-accent text-[9px] md:text-[10px] font-black uppercase">{res.lawTitle.split('.').slice(0, -1).join('.').substring(0, 30)}...</span>
                    </div>
                    {res.pageNumber && (
                      <p className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest pl-1 md:pl-2">Found on Page {res.pageNumber}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-white/20 text-[8px] md:text-[10px] font-bold uppercase">Match</span>
                    <span className="text-accent font-black text-lg md:text-xl">{(res.score * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-8 border border-white/5 group-hover:bg-white/10 transition-colors">
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed font-medium">
                    "{res.chunkText.length > 300 ? res.chunkText.substring(0, 300) + '...' : res.chunkText}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => window.open(`${getPdfUrlByTitle(res.lawTitle)}${res.pageNumber ? `#page=${res.pageNumber}` : ''}`, '_blank')}
                    className="flex-1 bg-accent text-primary font-black text-[10px] md:text-xs uppercase tracking-widest py-3 md:py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-white transition-all shadow-lg shadow-accent/20"
                  >
                    <BookOpen className="w-4 h-4 flex-shrink-0" />
                    <span>Read Full Page {res.pageNumber ? res.pageNumber : ''}</span>
                  </button>
                  <button
                    onClick={() => navigate('/chatbot', { state: { prefill: `Explain this section from ${res.lawTitle} (Page ${res.pageNumber}): ${res.chunkText.substring(0, 100)}...` } })}
                    className="flex-1 border border-white/20 text-white font-black text-[10px] md:text-xs uppercase tracking-widest py-3 md:py-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-white/10 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span>Explain Section</span>
                  </button>
                </div>
              </div>
            ))}
            <div className="h-px bg-primary/5 mx-8" />
          </div>
        )}

        {/* Category Pills */}
        <div className="flex space-x-2 md:space-x-3 overflow-x-auto pb-4 no-scrollbar rtl:space-x-reverse px-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center space-x-1.5 md:space-x-2 rtl:space-x-reverse px-4 py-2.5 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-accent text-primary shadow-lg shadow-accent/20 scale-105'
                  : 'bg-white text-primary/40 hover:text-primary border border-primary/5'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
              <span className={language === 'urdu' ? 'font-urdu text-base md:text-lg' : 'text-xs md:text-sm'}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Toolbar: result count + bookmarks toggle */}
        <div className="flex items-center justify-between px-1">
          <span className="text-primary/40 font-bold text-[10px] md:text-xs uppercase tracking-widest">
            {filteredLaws.length} {language === 'urdu' ? 'قوانین' : 'Results'}
          </span>
          <button
            onClick={() => setShowBookmarksOnly((v) => !v)}
            className={`flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-all ${
              showBookmarksOnly ? 'bg-accent text-primary' : 'bg-white text-primary/40 border border-primary/5 hover:text-primary'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{language === 'urdu' ? 'محفوظ شدہ' : 'Saved'} ({bookmarks.length})</span>
          </button>
        </div>

        {/* Laws List */}
        <div className="space-y-4">
          {filteredLaws.length > 0 ? (
            filteredLaws.map((law) => {
              const isBookmarked = bookmarks.includes(law.id);
              const isOpen = expandedLawId === law.id;
              return (
                <div
                  key={law.id}
                  className="bg-white rounded-[1.7rem] md:rounded-[2rem] border border-primary/5 shadow-xl shadow-primary/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="p-5 md:p-7 cursor-pointer group" onClick={() => setExpandedLawId(isOpen ? null : law.id)}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse flex-wrap gap-y-1">
                          <span className="text-[8px] md:text-[10px] font-black text-accent uppercase tracking-widest">
                            {LAW_CATEGORY_LABELS[law.category] || law.category}
                          </span>
                          <div className="w-1 h-1 bg-primary/10 rounded-full flex-shrink-0" />
                          <span className="text-[8px] md:text-[10px] font-bold text-primary/30 uppercase truncate">{law.province === 'federal' ? 'Federal' : law.province}</span>
                          {law.year && (
                            <>
                              <div className="w-1 h-1 bg-primary/10 rounded-full flex-shrink-0" />
                              <span className="text-[8px] md:text-[10px] font-bold text-primary/30 uppercase">{law.year}</span>
                            </>
                          )}
                        </div>
                        <h3 className={`text-base md:text-xl font-black text-primary group-hover:text-accent transition-colors ${language === 'urdu' ? 'font-urdu text-lg md:text-2xl leading-relaxed' : ''}`}>
                          {language === 'urdu' ? law.titleUrdu : law.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(law.id); }}
                          className={`p-2 rounded-lg md:rounded-xl transition-all ${isBookmarked ? 'bg-accent/15 text-accent' : 'bg-surface text-primary/30 hover:text-accent'}`}
                          title={isBookmarked ? 'Remove bookmark' : 'Save'}
                        >
                          {isBookmarked ? <BookmarkCheck className="w-4 h-4 md:w-5 md:h-5" /> : <Bookmark className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                        <div className={`p-2 rounded-lg md:p-3 md:rounded-xl transition-all ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-surface text-primary group-hover:bg-accent'}`}>
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="px-5 pb-6 md:px-7 md:pb-7 space-y-5 animate-fade-up">
                      <div className="h-px bg-primary/5" />

                      <p className={`text-primary/60 leading-relaxed ${language === 'urdu' ? 'font-urdu text-base md:text-lg' : 'text-xs md:text-sm'}`}>
                        {language === 'urdu' ? law.descriptionUrdu : law.description}
                      </p>

                      {/* Key sections */}
                      {law.keySections && law.keySections.length > 0 && (
                        <div className="bg-surface rounded-2xl p-4 md:p-5 space-y-2.5">
                          <p className="text-[9px] md:text-[10px] font-black text-primary/40 uppercase tracking-widest flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-accent" />
                            {language === 'urdu' ? 'اہم دفعات' : 'Key Sections'}
                          </p>
                          <ul className="space-y-1.5">
                            {law.keySections.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-primary/70 text-xs md:text-sm font-medium">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Full detail (AI-generated, in-app) */}
                      {details[law.id] ? (
                        <div className="bg-surface rounded-2xl p-4 md:p-5 border border-accent/10">
                          <p className="text-[9px] md:text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5 mb-3">
                            <BookOpen className="w-3.5 h-3.5" />
                            {language === 'urdu' ? 'مکمل تفصیل' : 'Full Detail'}
                          </p>
                          <div className={`markdown-content ${language === 'urdu' ? 'font-urdu text-base leading-loose' : 'text-xs md:text-sm'} text-primary/80`}>
                            <ReactMarkdown>{details[law.id]}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => loadFullDetail(law)}
                          disabled={loadingDetailId === law.id}
                          className="w-full bg-primary/5 hover:bg-accent/10 border border-primary/10 hover:border-accent/40 text-primary font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs md:text-sm disabled:opacity-60"
                        >
                          {loadingDetailId === law.id ? (
                            <>
                              <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                              <span>{language === 'urdu' ? 'تفصیل تیار ہو رہی ہے...' : 'Loading full detail...'}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 text-accent" />
                              <span>{language === 'urdu' ? 'مکمل تفصیل پڑھیں' : 'Read Full Detail'}</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Meta grid */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-surface p-3 md:p-4 rounded-xl md:rounded-2xl space-y-0.5">
                          <p className="text-[8px] md:text-[10px] font-black text-primary/30 uppercase">Enacted</p>
                          <p className="text-primary font-bold text-xs md:text-base">{law.year || 'N/A'}</p>
                        </div>
                        <div className="bg-surface p-3 md:p-4 rounded-xl md:rounded-2xl space-y-0.5">
                          <p className="text-[8px] md:text-[10px] font-black text-primary/30 uppercase">Status</p>
                          <p className="text-success font-bold flex items-center text-xs md:text-base">
                            <span className="w-1.5 h-1.5 bg-success rounded-full mr-1.5 rtl:ml-1.5 rtl:mr-0 animate-pulse flex-shrink-0" />
                            In Force
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-1">
                        <button
                          onClick={() => navigate('/chatbot', { state: { prefill: `Explain ${law.title} in simple terms` } })}
                          className="btn-justice flex-1 py-3 md:py-4 text-xs md:text-sm"
                        >
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          <span>{language === 'urdu' ? 'AI سے پوچھیں' : 'Ask AI'}</span>
                        </button>
                        {law.pdfUrl && (
                          <button
                            onClick={() => openFullText(law)}
                            className="flex-1 border-2 border-primary/10 hover:bg-primary/5 text-primary font-bold py-3 md:py-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center space-x-2 text-xs md:text-sm"
                          >
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span>{language === 'urdu' ? 'اصل دستاویز (PDF)' : 'Original PDF'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => copyCitation(law)}
                          className="sm:w-14 border-2 border-primary/10 hover:bg-primary/5 text-primary font-bold py-3 md:py-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center"
                          title="Copy citation"
                        >
                          {copiedId === law.id ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : aiResults.length === 0 && (
            <div className="bg-white rounded-[2rem] p-8 md:p-12 text-center space-y-4 shadow-xl border border-primary/5">
              <LibraryBooksIllustration className="w-36 h-36 md:w-48 md:h-48 mx-auto" />
              <h3 className="text-primary font-black text-lg md:text-xl">
                {showBookmarksOnly
                  ? (language === 'urdu' ? 'کوئی محفوظ شدہ قانون نہیں' : 'No saved laws yet')
                  : (language === 'urdu' ? 'کوئی قانون نہیں ملا' : 'No laws found')}
              </h3>
              <p className="text-primary/40 text-xs md:text-sm">
                {language === 'urdu' ? 'مختلف الفاظ یا فلٹر آزمائیں۔' : 'Try different keywords or filters.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Justice Badge */}
      <div className="mt-12 mb-20 flex flex-col items-center opacity-10">
        <KanoonLogo className="w-12 h-12" />
        <p className="text-[8px] font-black uppercase tracking-[0.5em] mt-2">Certified Legal Repository</p>
      </div>
    </div>
  );
};

export default LawLibrary;
