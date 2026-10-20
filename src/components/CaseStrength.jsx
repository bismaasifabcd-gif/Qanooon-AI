import React, { useState } from 'react';
import { X, ShieldCheck, Upload, Loader2, FileText, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '')
).replace(/\/$/, '');

/**
 * CaseStrength — upload evidence, OCR it in-browser (free), then ask Groq to
 * rate the case strength (0-100) with strengths, gaps and recommendations.
 *
 * Props: situation (string, from chat context), onClose()
 */
const CaseStrength = ({ situation = '', onClose }) => {
  const { language } = useLanguage();
  const ur = language === 'urdu';

  const [fileName, setFileName] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [ocrStatus, setOcrStatus] = useState('');       // '', 'running', 'done', 'none'
  const [ocrProgress, setOcrProgress] = useState(0);
  const [answers, setAnswers] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setFileName(file.name);
    setResult(null);

    if (!file.type.startsWith('image/')) {
      // Non-image (e.g. PDF): we can't OCR here cheaply — rely on questions + chat.
      setEvidenceText('');
      setOcrStatus('none');
      return;
    }

    setOcrStatus('running');
    setOcrProgress(0);
    try {
      const { default: Tesseract } = await import('tesseract.js');
      const { data } = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100));
        },
      });
      const text = (data.text || '').trim();
      setEvidenceText(text);
      setOcrStatus(text.length > 15 ? 'done' : 'none');
    } catch (err) {
      console.error('OCR failed:', err);
      setEvidenceText('');
      setOcrStatus('none');
    }
  };

  const analyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/case-strength`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation, evidenceText, answers, language }),
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setResult(data);
    } catch {
      setError(ur ? 'تجزیہ میں دشواری ہوئی۔ دوبارہ کوشش کریں۔' : 'Could not analyse right now. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const scoreColor = (s) =>
    s >= 70 ? 'text-success' : s >= 40 ? 'text-accent' : 'text-red-500';
  const barColor = (s) =>
    s >= 70 ? 'bg-success' : s >= 40 ? 'bg-accent' : 'bg-red-500';

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4 bg-primary/50 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl border border-primary/5 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-5 py-4 flex items-center justify-between flex-shrink-0 border-b-2 border-accent/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-accent/15 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className={`text-white font-black text-base ${ur ? 'font-urdu text-lg' : ''}`}>
                {ur ? 'کیس کی مضبوطی کا تجزیہ' : 'Case Strength Analysis'}
              </h3>
              <p className="text-white/50 text-[10px] font-medium">
                {ur ? 'شواہد اپ لوڈ کریں' : 'Upload your evidence'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/20 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!result ? (
            <>
              {/* Upload */}
              <label className="block cursor-pointer">
                <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
                <div className="border-2 border-dashed border-primary/15 rounded-xl p-6 text-center hover:border-accent/40 transition-all">
                  {fileName ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileText className="w-5 h-5 text-accent" />
                      <span className="text-sm font-bold truncate max-w-[220px]">{fileName}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-7 h-7 text-primary/30 mx-auto mb-2" />
                      <p className="text-primary/60 text-sm font-bold">{ur ? 'تصویر یا دستاویز منتخب کریں' : 'Tap to upload a photo or document'}</p>
                      <p className="text-primary/30 text-[11px] mt-1">{ur ? 'میسج اسکرین شاٹ، نوٹس، معاہدہ وغیرہ' : 'Screenshot, notice, agreement, etc.'}</p>
                    </>
                  )}
                </div>
              </label>

              {/* OCR status */}
              {ocrStatus === 'running' && (
                <div className="flex items-center gap-2 text-primary/60 text-xs font-medium">
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  <span>{ur ? `متن پڑھا جا رہا ہے... ${ocrProgress}%` : `Reading text... ${ocrProgress}%`}</span>
                </div>
              )}
              {ocrStatus === 'done' && (
                <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-success text-xs font-bold mb-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{ur ? 'متن کامیابی سے پڑھا گیا' : 'Text extracted from evidence'}</span>
                  </div>
                  <p className="text-primary/50 text-[11px] line-clamp-3 whitespace-pre-line">{evidenceText.slice(0, 200)}...</p>
                </div>
              )}
              {ocrStatus === 'none' && fileName && (
                <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-primary/60 text-[11px]">
                    {ur
                      ? 'اس فائل سے متن نہیں ملا (مثلاً چوٹ کی تصویر)۔ نیچے چند سوالوں کے جواب دیں تاکہ بہتر تجزیہ ہو سکے۔'
                      : "No text found in this file (e.g. an injury photo). Answer the questions below so we can still assess your case."}
                  </p>
                </div>
              )}

              {/* Guided questions */}
              <div>
                <label className="block text-[11px] font-bold text-primary/50 mb-1">
                  {ur ? 'مزید تفصیل (اختیاری)' : 'Extra details (optional)'}
                </label>
                <textarea
                  value={answers}
                  onChange={(e) => setAnswers(e.target.value)}
                  rows={3}
                  placeholder={ur
                    ? 'مثلاً: واقعہ کب ہوا؟ کوئی گواہ؟ میڈیکل رپورٹ؟ پہلے کوئی شکایت درج کروائی؟'
                    : 'e.g. When did it happen? Any witnesses? Medical report? Any prior complaint filed?'}
                  className="w-full bg-white border border-primary/15 rounded-lg py-2.5 px-3.5 outline-none font-medium text-sm text-primary focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-xs font-bold border border-red-100">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={analyze}
                disabled={analyzing || (!evidenceText && !answers && !situation)}
                className="w-full bg-accent hover:bg-[#B3933C] text-primary font-black py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm disabled:opacity-40"
              >
                {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{analyzing ? (ur ? 'تجزیہ ہو رہا ہے...' : 'Analysing...') : (ur ? 'کیس کا تجزیہ کریں' : 'Analyse Case Strength')}</span>
              </button>

              <p className="text-primary/30 text-[10px] text-center leading-relaxed">
                {ur
                  ? 'یہ AI تخمینہ ہے، قطعی قانونی رائے نہیں۔ اہم معاملات پر وکیل سے رجوع کریں۔'
                  : 'This is an AI estimate, not a definitive legal opinion. Consult a lawyer for serious matters.'}
              </p>
            </>
          ) : (
            /* ---- Result ---- */
            <div className="space-y-5">
              {/* Score meter */}
              <div className="text-center py-2">
                <p className="text-primary/40 text-[11px] font-black uppercase tracking-widest mb-2">
                  {ur ? 'کیس کی مضبوطی' : 'Case Strength'}
                </p>
                {result.score != null ? (
                  <>
                    <p className={`text-5xl font-black ${scoreColor(result.score)}`}>{result.score}%</p>
                    <p className={`text-sm font-black mt-1 ${scoreColor(result.score)}`}>
                      {result.label}
                    </p>
                    <div className="mt-3 h-2.5 bg-primary/10 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor(result.score)} rounded-full transition-all duration-700`} style={{ width: `${result.score}%` }} />
                    </div>
                  </>
                ) : (
                  <p className="text-primary/60 text-sm">{result.summary}</p>
                )}
              </div>

              {result.summary && result.score != null && (
                <p className="text-primary/70 text-sm leading-relaxed bg-surface rounded-lg p-3">{result.summary}</p>
              )}

              {result.strengths?.length > 0 && (
                <div>
                  <p className="text-success font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {ur ? 'مضبوط پہلو' : 'Strengths'}
                  </p>
                  <ul className="space-y-1.5">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-primary/70 text-[13px]">
                        <span className="w-1.5 h-1.5 bg-success rounded-full mt-1.5 flex-shrink-0" /><span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.gaps?.length > 0 && (
                <div>
                  <p className="text-red-500 font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" /> {ur ? 'کمزور پہلو' : 'Gaps'}
                  </p>
                  <ul className="space-y-1.5">
                    {result.gaps.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-primary/70 text-[13px]">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" /><span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations?.length > 0 && (
                <div>
                  <p className="text-accent font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5" /> {ur ? 'تجاویز' : 'Recommendations'}
                  </p>
                  <ul className="space-y-1.5">
                    {result.recommendations.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-primary/70 text-[13px]">
                        <span className="w-4 h-4 bg-accent/15 text-accent font-black text-[9px] rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">{i + 1}</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button onClick={onClose} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-navy-light transition-all text-sm">
                {ur ? 'بند کریں' : 'Done'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseStrength;
