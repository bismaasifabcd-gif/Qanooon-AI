import { callGroq, GROQ_DOC_MODEL, cors, readBody } from './_lib.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { prompt, language = 'english' } = readBody(req);
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
    res.status(200).json({ response: content });
  } catch (err) {
    console.error('[document]', err.message);
    res.status(500).json({ error: 'document_failed' });
  }
}
