import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Sparkles } from 'lucide-react';

/**
 * FeatureGuide — a soft, translucent onboarding coachmark for first-time users.
 *
 * Shows one small guideline card at a time. It auto-advances after a few
 * seconds, and advances/dismisses on scroll or tap. Marks itself seen in
 * localStorage so it only runs once per user.
 *
 * Props:
 *   steps: [{ title, text }]
 *   storageKey: unique key so it shows only once
 *   language: 'urdu' | other
 *   onDone: optional callback when finished
 */
const FeatureGuide = ({ steps = [], storageKey = 'qanoon_guide_seen', language = 'english', onDone }) => {
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  // Start only if this guide hasn't been seen before.
  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey)) {
        const t = setTimeout(() => setActive(true), 600);
        return () => clearTimeout(t);
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  const finish = () => {
    setActive(false);
    try { localStorage.setItem(storageKey, '1'); } catch { /* ignore */ }
    onDone?.();
  };

  const next = () => {
    if (index < steps.length - 1) setIndex((i) => i + 1);
    else finish();
  };

  // Auto-advance each step after 4.5s.
  useEffect(() => {
    if (!active) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(next, 4500);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index]);

  // Advance on scroll (new feature guideline as they scroll).
  useEffect(() => {
    if (!active) return;
    let last = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - last) > 60) {
        last = window.scrollY;
        next();
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, index]);

  if (!active || steps.length === 0) return null;

  const step = steps[index];

  return (
    <div className="fixed inset-x-0 bottom-20 z-[70] flex justify-center px-4 pointer-events-none animate-fade-up">
      <div
        onClick={next}
        className="pointer-events-auto cursor-pointer w-full max-w-sm bg-primary/85 backdrop-blur-xl border border-accent/30 rounded-2xl shadow-2xl p-4 text-left rtl:text-right"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={`text-accent font-black text-[11px] uppercase tracking-wider ${language === 'urdu' ? 'font-urdu' : ''}`}>
                {step.title}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); finish(); }}
                className="text-white/40 hover:text-white flex-shrink-0"
                aria-label="Skip"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-white/80 text-xs leading-relaxed mt-1 ${language === 'urdu' ? 'font-urdu text-sm leading-loose' : ''}`}>
              {step.text}
            </p>

            {/* progress dots + next */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === index ? 'w-4 bg-accent' : 'w-1.5 bg-white/25'}`}
                  />
                ))}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="flex items-center gap-1 text-white/70 hover:text-accent text-[10px] font-black uppercase tracking-wider transition-colors"
              >
                <span>
                  {index === steps.length - 1
                    ? (language === 'urdu' ? 'ٹھیک ہے' : 'Got it')
                    : (language === 'urdu' ? 'آگے' : 'Next')}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 ${language === 'urdu' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGuide;
