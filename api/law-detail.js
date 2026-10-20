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
    res.status(200).json({ detail: content });
  } catch (err) {
    console.error('[law-detail]', err.message);
    res.status(500).json({ error: 'detail_failed' });
  }
}
