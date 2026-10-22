import { callGroq, GROQ_DOC_MODEL, cors, readBody } from './_lib.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { title, language = 'english' } = readBody(req);
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: "A 'title' string is required" });
    }

    const system =
      language === 'urdu'
        ? 'آپ ایک ماہر پاکستانی قانونی مصنف ہیں۔ دیے گئے قانون کی مکمل اور منظم تفصیل صرف JSON میں واپس کریں۔ تمام متن اردو میں ہو۔'
        : 'You are an expert Pakistani legal writer. Return a complete, well-organised explanation of the given law as STRICT JSON only — no markdown, no prose outside the JSON.';

    const shape =
      `{` +
      `"overview": "<2-3 sentence plain-language summary of what this law is and who it protects>",` +
      `"keySections": [{"section": "<e.g. Section 9>", "meaning": "<what it says in simple words>"}],` +
      `"punishments": ["<specific penalty / fine / jail term with the section it comes from>"],` +
      `"authority": "<the court, tribunal or department that handles this law>",` +
      `"procedure": ["<ordered, concrete step a citizen takes>"],` +
      `"helplines": ["<relevant helpline or office, if any>"]` +
      `}`;

    const prompt =
      (language === 'urdu'
        ? `اس پاکستانی قانون کی منظم تفصیل دیں: "${title}"۔ صرف اس JSON ساخت میں جواب دیں، کوئی اضافی متن نہیں:\n`
        : `Give a structured guide to this Pakistani law: "${title}". Respond with ONLY this JSON shape, nothing else:\n`) +
      shape +
      (language === 'urdu'
        ? `\nہر فہرست میں 3 تا 6 مختصر، واضح نکات ہوں۔ دفعہ نمبر اور اصل طریقہ کار درست بتائیں۔ قاری کو کسی اور ذریعہ کا حوالہ نہ دیں۔`
        : `\nEach list should have 3-6 short, clear items. Be specific with real section numbers and real procedure. Do not refer the reader elsewhere — give the detail here. Plain sentences, no markdown symbols inside the strings.`);

    const raw = await callGroq(
      GROQ_DOC_MODEL,
      [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.25, maxTokens: 4000 },
    );

    // Extract and normalise the JSON object.
    let data;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(match ? match[0] : raw);
    } catch {
      // Fallback: return the raw text as the overview so the UI still shows something.
      return res.status(200).json({
        detail: {
          overview: raw.slice(0, 1200),
          keySections: [],
          punishments: [],
          authority: '',
          procedure: [],
          helplines: [],
        },
      });
    }

    const arr = (v) => (Array.isArray(v) ? v.filter(Boolean).slice(0, 8) : []);
    res.status(200).json({
      detail: {
        overview: typeof data.overview === 'string' ? data.overview.trim() : '',
        keySections: arr(data.keySections)
          .map((s) =>
            typeof s === 'string'
              ? { section: '', meaning: s }
              : { section: (s.section || '').toString().trim(), meaning: (s.meaning || '').toString().trim() },
          )
          .filter((s) => s.meaning),
        punishments: arr(data.punishments).map((x) => x.toString().trim()),
        authority: typeof data.authority === 'string' ? data.authority.trim() : '',
        procedure: arr(data.procedure).map((x) => x.toString().trim()),
        helplines: arr(data.helplines).map((x) => x.toString().trim()),
      },
    });
  } catch (err) {
    console.error('[law-detail]', err.message);
    res.status(500).json({ error: 'detail_failed' });
  }
}
