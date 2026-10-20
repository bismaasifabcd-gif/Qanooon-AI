/**
 * Kanoon AI — Groq backend proxy.
 *
 * A tiny Express server that keeps the Groq API key server-side and exposes
 * two endpoints the frontend calls:
 *   POST /api/chat      -> Groq Compound (server-side web search) legal answers
 *   POST /api/document  -> Groq Llama 3.1 document drafting (FIR / complaint)
 *
 * Runs free on Render (see ../render.yaml). No Firebase Functions / Blaze needed.
 * Firebase still handles hosting, auth, and Firestore separately.
 *
 * Env vars:
 *   GROQ_API_KEY  (required) — your Groq API key (gsk_...)
 *   PORT          (optional) — Render sets this automatically
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

// Allow the browser app (Firebase Hosting) to call this API from another origin.
app.use(cors());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
// Open-source model on the Groq free tier. The 120B model is notably more
// accurate on legal facts than the 20B, and (being a reasoning model) needs a
// generous token budget so it has room to produce a final answer after thinking.
const GROQ_CHAT_MODEL = 'openai/gpt-oss-120b';
const GROQ_DOC_MODEL = 'openai/gpt-oss-120b';

/**
 * Low-level Groq chat-completions call (OpenAI-compatible API).
 * Returns the assistant's reply text.
 */
async function callGroqOnce(model, messages, temperature, maxTokens) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      // Keep reasoning brief so the token budget goes to the actual answer.
      reasoning_effort: 'low',
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const choice = data?.choices?.[0];
  return {
    content: choice?.message?.content?.trim() || '',
    finishReason: choice?.finish_reason,
  };
}

async function callGroq(model, messages, { temperature = 0.4, maxTokens = 4096 } = {}) {
  if (!GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured on the server');

  let { content, finishReason } = await callGroqOnce(model, messages, temperature, maxTokens);

  // Reasoning models can spend the whole budget "thinking" and return empty
  // content with finish_reason 'length'. If that happens, retry once with a
  // much larger budget so there's room for a final answer.
  if (!content && finishReason === 'length') {
    ({ content } = await callGroqOnce(model, messages, temperature, maxTokens * 2));
  }

  if (!content) throw new Error('Groq returned an empty response');
  return content;
}

// The frontend renders answers as a structured card when the reply uses these
// exact tags. Always return them in this order so the UI stays clean & readable.
const FORMAT_SPEC_EN =
  'You MUST format every answer using these exact tags, in this order, with nothing before or after:\n' +
  '[LAW_NAME] the specific Pakistani law and the exact section number(s), e.g. "Pakistan Penal Code, Section 379"\n' +
  '[EXPLANATION] A COMPLETE, SELF-CONTAINED answer. Explain fully in plain language: what the law says, ' +
  'what the relevant section actually states (paraphrase the provision), the legal requirements/conditions, ' +
  'any important exceptions, the relevant court or authority, and timelines where applicable. ' +
  'Write 1-3 well-structured paragraphs so the user gets EVERYTHING they need here and does NOT have to read the act or any other source. Still keep the wording simple.\n' +
  '[ACTIONS] 3-6 concrete step-by-step actions the person can take, each on its own line, no numbering (the app numbers them). Include which office/court to go to, documents needed, and relevant helpline numbers if any.\n' +
  '[PUNISHMENT] The exact penalty/fine/imprisonment term the law prescribes, with the section. If none applies, write: Not applicable\n' +
  '[SEVERITY] exactly one of: LOW, MEDIUM, HIGH\n\n' +
  'CRITICAL RULES:\n' +
  '- Give the full detail yourself. NEVER tell the user to "read the full act", "consult the statute", "refer to the law", or go to another source for details. This app IS their source.\n' +
  '- Do not add any headings, markdown, or text outside these tags.\n' +
  '- If you are genuinely unsure of an exact section number, give the correct law name and explain you are not certain of the precise section, but still answer fully.';

const FORMAT_SPEC_UR =
  'ہر جواب لازماً انہی ٹیگز میں، اسی ترتیب سے دیں، ان سے باہر کچھ نہ لکھیں:\n' +
  '[LAW_NAME] متعلقہ پاکستانی قانون اور عین دفعہ نمبر، مثلاً "Pakistan Penal Code, Section 379"\n' +
  '[EXPLANATION] ایک مکمل اور خود کفیل جواب۔ آسان الفاظ میں پوری تفصیل دیں: قانون کیا کہتا ہے، متعلقہ دفعہ کا مفہوم، ' +
  'شرائط، اہم استثناءات، متعلقہ عدالت/ادارہ، اور وقت کی حد۔ 1 تا 3 پیراگراف لکھیں تاکہ صارف کو یہیں سب کچھ مل جائے اور اسے کوئی اور ذریعہ دیکھنے کی ضرورت نہ پڑے۔\n' +
  '[ACTIONS] 3 تا 6 عملی اقدامات، ہر ایک الگ سطر میں، نمبر کے بغیر۔ کون سے دفتر/عدالت جانا ہے، کون سے کاغذات چاہییں، اور متعلقہ ہیلپ لائن نمبر بھی بتائیں۔\n' +
  '[PUNISHMENT] قانون کے مطابق عین سزا/جرمانہ/قید، دفعہ کے ساتھ۔ اگر لاگو نہ ہو تو لکھیں: Not applicable\n' +
  '[SEVERITY] ان میں سے ایک: LOW, MEDIUM, HIGH\n\n' +
  'اہم اصول: ساری تفصیل خود دیں۔ صارف کو کبھی یہ نہ کہیں کہ "مکمل قانون پڑھیں" یا کسی اور ذریعے سے تفصیل لیں — یہ ایپ ہی ان کا ذریعہ ہے۔ ان ٹیگز کے علاوہ کچھ نہ لکھیں۔';

function buildSystemPrompt(userName, language) {
  const nameNote = userName ? `The user's name is ${userName}. ` : '';
  if (language === 'urdu') {
    return (
      `آپ "AskLex" ہیں، ایک ماہر پاکستانی قانونی معاون۔ ${nameNote}` +
      'پاکستانی قانون (PPC, CrPC, PECA, Family Laws, Labour Laws وغیرہ) کے مطابق مکمل اور درست تفصیل دیں۔ ' +
      'آپ وکیل نہیں ہیں؛ یہ عمومی رہنمائی ہے، مگر جواب مکمل اور خود کفیل ہونا چاہیے۔\n\n' +
      FORMAT_SPEC_UR
    );
  }
  return (
    `You are "AskLex", an expert AI legal assistant for Pakistani citizens. ${nameNote}` +
    'Give complete, accurate, and detailed answers on Pakistani law (PPC, CrPC, PECA, Family Laws, Labour Laws, etc.). ' +
    'You are not a lawyer and this is general guidance, but your answer must be complete and self-contained.\n\n' +
    FORMAT_SPEC_EN
  );
}

app.get('/', (_req, res) => res.json({ ok: true, service: 'kanoon-ai-backend' }));
app.get('/health', (_req, res) => res.json({ ok: true }));

// Chat endpoint — answers come only from Groq.
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], userName = '', language = 'english' } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "A 'message' string is required" });
    }

    const priorTurns = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && m.content)
          .slice(-10)
          .map((m) => ({ role: m.role, content: String(m.content) }))
      : [];

    const messages = [
      { role: 'system', content: buildSystemPrompt(userName, language) },
      ...priorTurns,
      { role: 'user', content: message },
    ];

    const content = await callGroq(GROQ_CHAT_MODEL, messages, { temperature: 0.3, maxTokens: 6000 });
    res.json({ response: content });
  } catch (err) {
    console.error('[/api/chat] error:', err.message);
    res.status(500).json({ error: 'chat_failed' });
  }
});

// Document endpoint — Groq Llama drafting.
app.post('/api/document', async (req, res) => {
  try {
    const { prompt, language = 'english' } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: "A 'prompt' string is required" });
    }

    const system =
      language === 'urdu'
        ? 'آپ پاکستانی شہریوں کے لیے ایک ماہر قانونی دستاویز نویس ہیں۔ صرف مطلوبہ دستاویز تیار کریں، کوئی اضافی تبصرہ نہ کریں۔'
        : 'You are an expert legal document writer for Pakistani citizens. Output only the requested document with no extra commentary.';

    const content = await callGroq(
      GROQ_DOC_MODEL,
      [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.3, maxTokens: 4096 },
    );
    res.json({ response: content });
  } catch (err) {
    console.error('[/api/document] error:', err.message);
    res.status(500).json({ error: 'document_failed' });
  }
});

// ---------------------------------------------------------------------------
// Find a Lawyer — free data via OpenStreetMap Overpass (no API key / billing).
// ---------------------------------------------------------------------------

// Approx city-centre coordinates for Pakistani cities we support.
const CITY_COORDS = {
  Lahore: [31.5204, 74.3587],
  Karachi: [24.8607, 67.0011],
  Islamabad: [33.6844, 73.0479],
  Peshawar: [34.0151, 71.5249],
  Quetta: [30.1798, 66.975],
  Faisalabad: [31.4504, 73.135],
  Multan: [30.1575, 71.5249],
  Rawalpindi: [33.5651, 73.0169],
  Gujranwala: [32.1877, 74.1945],
  Sialkot: [32.4945, 74.5229],
};

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

// Simple in-memory cache: key -> { at, lawyers }
const lawyerCache = new Map();
const LAWYER_CACHE_MS = 24 * 60 * 60 * 1000; // 24h

async function overpassQuery(lat, lon) {
  const q =
    `[out:json][timeout:25];(` +
    `node["office"="lawyer"](around:20000,${lat},${lon});` +
    `way["office"="lawyer"](around:20000,${lat},${lon});` +
    `node["amenity"="lawyer"](around:20000,${lat},${lon});` +
    `);out center 40;`;

  let lastErr;
  for (const ep of OVERPASS_ENDPOINTS) {
    try {
      const r = await fetch(ep, {
        method: 'POST',
        headers: { 'User-Agent': 'KanoonAI/1.0 (legal-aid app)' },
        body: 'data=' + encodeURIComponent(q),
      });
      if (!r.ok) { lastErr = new Error(`Overpass ${r.status}`); continue; }
      const d = await r.json();
      return d.elements || [];
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('Overpass unavailable');
}

const LAW_CATEGORIES = [
  'Family Law', 'Criminal Law', 'Property Law',
  'Cyber Crime', 'Labour Law', 'Constitutional Law',
];

// Map a place name to a best-guess specialty so category filtering is meaningful.
function guessSpecialty(name = '') {
  const n = name.toLowerCase();
  if (/family|divorce|khula|nikah|custody|matrimon/.test(n)) return 'Family Law';
  if (/criminal|penal|fir|bail/.test(n)) return 'Criminal Law';
  if (/property|land|revenue|estate|rent|tenant/.test(n)) return 'Property Law';
  if (/cyber|digital|peca|it /.test(n)) return 'Cyber Crime';
  if (/labour|labor|employment|industrial|wage/.test(n)) return 'Labour Law';
  if (/constitution|writ|fundamental|human right/.test(n)) return 'Constitutional Law';
  if (/tax|revenue/.test(n)) return 'Property Law';
  return 'General Practice';
}

function toLawyer(el, city) {
  const t = el.tags || {};
  const addr = [t['addr:street'], t['addr:suburb'], t['addr:city'] || city]
    .filter(Boolean)
    .join(', ');
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  const name = t.name || 'Law Office';
  return {
    id: `${el.type}/${el.id}`,
    name,
    specialty: guessSpecialty(name),
    address: addr || `${city}, Pakistan`,
    phone: t.phone || t['contact:phone'] || 'N/A',
    website: t.website || t['contact:website'] || '',
    lat,
    lon,
    source: 'osm',
  };
}

// Every listed city has a District Bar Association that handles ALL categories.
// This guarantees non-empty, verifiable results for cities where OSM is sparse.
// (Bar Associations refer citizens to specialist advocates in any field.)
function baselineForCity(city) {
  const [lat, lon] = CITY_COORDS[city] || [];
  const make = (name, specialties) =>
    specialties.map((sp) => ({
      id: `bar/${city}/${sp}`.replace(/\s+/g, '_'),
      name: `${name} — ${sp} Desk`,
      specialty: sp,
      address: `${name}, ${city}, Pakistan`,
      phone: 'N/A',
      website: '',
      lat,
      lon,
      source: 'bar',
    }));

  const barName =
    city === 'Islamabad' ? 'Islamabad District Bar Association'
      : city === 'Lahore' ? 'Lahore High Court Bar Association'
      : city === 'Karachi' ? 'Karachi Bar Association'
      : `${city} District Bar Association`;

  // One entry per category so every category always has at least one result.
  return make(barName, LAW_CATEGORIES);
}

// POST /api/law-detail  { title, language } -> detailed, self-contained write-up
app.post('/api/law-detail', async (req, res) => {
  try {
    const { title, language = 'english' } = req.body || {};
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: "A 'title' string is required" });
    }

    const system =
      language === 'urdu'
        ? 'آپ ایک ماہر پاکستانی قانونی مصنف ہیں۔ دیے گئے قانون کی مکمل، منظم اور آسان تفصیل اردو میں لکھیں تاکہ صارف کو کوئی اور ذریعہ دیکھنے کی ضرورت نہ پڑے۔'
        : 'You are an expert Pakistani legal writer. Produce a complete, well-organised, plain-language explanation so the reader needs no other source.';

    const prompt =
      (language === 'urdu'
        ? `اس پاکستانی قانون کی تفصیل لکھیں: "${title}"۔ `
        : `Write a detailed guide to this Pakistani law: "${title}". `) +
      (language === 'urdu'
        ? 'ان عنوانات کے تحت لکھیں (ہر عنوان کے آگے ## لگائیں): ## جائزہ, ## اہم دفعات اور ان کا مطلب, ## سزائیں/جرمانے, ## متعلقہ عدالت یا ادارہ, ## عملی رہنمائی۔ مارک ڈاؤن استعمال کریں۔'
        : 'Use markdown headings (##) and cover: ## Overview, ## Key Sections & What They Mean, ## Punishments / Penalties, ## Relevant Court or Authority, ## Practical Guidance. Be specific with section numbers and real procedure. Do NOT tell the reader to consult the act elsewhere — give the detail here.');

    const content = await callGroq(
      GROQ_DOC_MODEL,
      [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.3, maxTokens: 6000 },
    );
    res.json({ detail: content });
  } catch (err) {
    console.error('[/api/law-detail] error:', err.message);
    res.status(500).json({ error: 'detail_failed' });
  }
});

// GET /api/lawyers?city=Lahore&category=Family%20Law
app.get('/api/lawyers', async (req, res) => {
  const city = (req.query.city || 'Lahore').toString();
  const category = (req.query.category || '').toString();
  const coords = CITY_COORDS[city];
  if (!coords) return res.status(400).json({ error: 'unsupported_city' });

  const cacheKey = city;
  let all;
  const cached = lawyerCache.get(cacheKey);
  if (cached && Date.now() - cached.at < LAWYER_CACHE_MS) {
    all = cached.lawyers;
  } else {
    let osm = [];
    try {
      const els = await overpassQuery(coords[0], coords[1]);
      osm = els.map((e) => toLawyer(e, city)).filter((l) => l.name !== 'Law Office');
    } catch (e) {
      console.warn('[/api/lawyers] OSM failed, using baseline only:', e.message);
    }
    // Merge OSM results with the bar-association baseline (OSM first).
    all = [...osm, ...baselineForCity(city)];
    lawyerCache.set(cacheKey, { at: Date.now(), lawyers: all });
  }

  try {
    let lawyers = all;
    if (category) {
      // Show matching specialty + general-practice offices (which handle any case),
      // and always include the bar-association desk for that category.
      const matches = all.filter(
        (l) => l.specialty === category || l.specialty === 'General Practice' || l.source === 'bar'
      );
      // Put exact-category matches first.
      lawyers = matches.sort((a, b) => (b.specialty === category) - (a.specialty === category));
    }
    res.json({ lawyers: lawyers.slice(0, 40), cached: !!cached });
  } catch (err) {
    console.error('[/api/lawyers] error:', err.message);
    res.status(502).json({ error: 'lawyer_lookup_failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Kanoon AI backend running on port ${PORT}`);
});
