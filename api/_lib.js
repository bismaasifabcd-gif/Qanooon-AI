// Shared logic for Qanoon AI serverless API (Vercel).
// Groq + OpenStreetMap. The Groq key lives only in the GROQ_API_KEY env var.

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
export const GROQ_CHAT_MODEL = 'openai/gpt-oss-120b';
export const GROQ_DOC_MODEL = 'openai/gpt-oss-120b';

async function callGroqOnce(model, messages, temperature, maxTokens) {
  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
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

export async function callGroq(model, messages, { temperature = 0.4, maxTokens = 4096 } = {}) {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not configured');
  let { content, finishReason } = await callGroqOnce(model, messages, temperature, maxTokens);
  if (!content && finishReason === 'length') {
    ({ content } = await callGroqOnce(model, messages, temperature, maxTokens * 2));
  }
  if (!content) throw new Error('Groq returned an empty response');
  return content;
}

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

export function buildSystemPrompt(userName, language) {
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

// ---- CORS helper (frontend may be served from a different origin) ----
export function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Parse a JSON body on Vercel (req.body may already be parsed, or be a string).
export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
}

// ---- Find a Lawyer (OpenStreetMap) ----
export const CITY_COORDS = {
  Lahore: [31.5204, 74.3587], Karachi: [24.8607, 67.0011], Islamabad: [33.6844, 73.0479],
  Peshawar: [34.0151, 71.5249], Quetta: [30.1798, 66.975], Faisalabad: [31.4504, 73.135],
  Multan: [30.1575, 71.5249], Rawalpindi: [33.5651, 73.0169], Gujranwala: [32.1877, 74.1945],
  Sialkot: [32.4945, 74.5229],
};

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const LAW_CATEGORIES = [
  'Family Law', 'Criminal Law', 'Property Law',
  'Cyber Crime', 'Labour Law', 'Constitutional Law',
];

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

// Fetch with a hard timeout so a slow Overpass call can't exceed Vercel's
// 10s serverless limit. Returns [] on timeout/failure (we still have baseline).
async function fetchWithTimeout(url, opts, ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function overpassQuery(lat, lon) {
  // Smaller radius + shorter server timeout keeps responses well under 10s.
  const q =
    `[out:json][timeout:8];(` +
    `node["office"="lawyer"](around:15000,${lat},${lon});` +
    `way["office"="lawyer"](around:15000,${lat},${lon});` +
    `);out center 30;`;
  for (const ep of OVERPASS_ENDPOINTS) {
    try {
      const r = await fetchWithTimeout(
        ep,
        {
          method: 'POST',
          headers: { 'User-Agent': 'KanoonAI/1.0 (legal-aid app)' },
          body: 'data=' + encodeURIComponent(q),
        },
        7000, // abort after 7s so the whole function stays under 10s
      );
      if (!r.ok) continue;
      const d = await r.json();
      return d.elements || [];
    } catch {
      // timeout or network error — try next endpoint, else fall through
    }
  }
  return []; // give up on OSM; caller still returns the Bar Association baseline
}

function toLawyer(el, city) {
  const t = el.tags || {};
  const addr = [t['addr:street'], t['addr:suburb'], t['addr:city'] || city].filter(Boolean).join(', ');
  const name = t.name || 'Law Office';
  return {
    id: `${el.type}/${el.id}`,
    name,
    specialty: guessSpecialty(name),
    address: addr || `${city}, Pakistan`,
    phone: t.phone || t['contact:phone'] || 'N/A',
    website: t.website || t['contact:website'] || '',
    lat: el.lat ?? el.center?.lat,
    lon: el.lon ?? el.center?.lon,
    source: 'osm',
  };
}

function baselineForCity(city) {
  const [lat, lon] = CITY_COORDS[city] || [];
  const barName =
    city === 'Islamabad' ? 'Islamabad District Bar Association'
      : city === 'Lahore' ? 'Lahore High Court Bar Association'
      : city === 'Karachi' ? 'Karachi Bar Association'
      : `${city} District Bar Association`;
  return LAW_CATEGORIES.map((sp) => ({
    id: `bar/${city}/${sp}`.replace(/\s+/g, '_'),
    name: `${barName} — ${sp} Desk`,
    specialty: sp,
    address: `${barName}, ${city}, Pakistan`,
    phone: 'N/A',
    website: '',
    lat, lon,
    source: 'bar',
  }));
}

export async function getLawyers(city, category) {
  const coords = CITY_COORDS[city];
  if (!coords) throw new Error('unsupported_city');
  let osm = [];
  try {
    const els = await overpassQuery(coords[0], coords[1]);
    osm = els.map((e) => toLawyer(e, city)).filter((l) => l.name !== 'Law Office');
  } catch { /* fall back to baseline only */ }
  let all = [...osm, ...baselineForCity(city)];
  if (category) {
    all = all
      .filter((l) => l.specialty === category || l.specialty === 'General Practice' || l.source === 'bar')
      .sort((a, b) => (b.specialty === category) - (a.specialty === category));
  }
  return all.slice(0, 40);
}
