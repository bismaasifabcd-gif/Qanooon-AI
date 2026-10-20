import { callGroq, GROQ_CHAT_MODEL, cors, readBody } from './_lib.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const {
      situation = '',       // what the user says the case is about
      evidenceText = '',     // OCR-extracted text from uploaded evidence
      answers = '',          // guided questionnaire answers (for photos with no text)
      language = 'english',
    } = readBody(req);

    if (!situation && !evidenceText && !answers) {
      return res.status(400).json({ error: 'nothing_to_analyse' });
    }

    const sys =
      language === 'urdu'
        ? 'آپ ایک پاکستانی قانونی تجزیہ کار ہیں۔ دیے گئے شواہد اور حالات کی بنیاد پر کیس کی مضبوطی کا منصفانہ تجزیہ کریں۔ صرف JSON واپس کریں۔'
        : 'You are a Pakistani legal case analyst. Fairly assess how strong a case is based on the evidence and situation provided. Return ONLY JSON.';

    const prompt =
      `Assess the strength of this legal matter under Pakistani law and respond with ONLY a valid JSON object, no markdown, in this exact shape:\n` +
      `{"score": <0-100 integer>, "label": "<Weak|Moderate|Strong>", "summary": "<2-3 sentence plain-language assessment>", "strengths": ["..."], "gaps": ["..."], "recommendations": ["..."]}\n\n` +
      (language === 'urdu' ? 'تمام متنی مواد (summary, strengths, gaps, recommendations) اردو میں لکھیں۔\n\n' : '') +
      `SITUATION: ${situation || '(not provided)'}\n\n` +
      `EVIDENCE TEXT (extracted from uploaded file): ${evidenceText ? evidenceText.slice(0, 4000) : '(none / not a text document)'}\n\n` +
      `USER ANSWERS: ${answers || '(none)'}\n\n` +
      `Be realistic and honest: more concrete, dated, corroborated evidence = higher score. Vague or missing evidence = lower score with clear gaps. Keep each list to 2-4 short items.`;

    const raw = await callGroq(
      GROQ_CHAT_MODEL,
      [
        { role: 'system', content: sys },
        { role: 'user', content: prompt },
      ],
      { temperature: 0.2, maxTokens: 2000 },
    );

    // Extract the JSON object from the model output.
    let data;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      data = JSON.parse(match ? match[0] : raw);
    } catch {
      return res.status(200).json({
        score: null,
        label: 'Unknown',
        summary: raw.slice(0, 400),
        strengths: [],
        gaps: [],
        recommendations: [],
      });
    }

    // Clamp score.
    let score = Number(data.score);
    if (!Number.isFinite(score)) score = null;
    else score = Math.max(0, Math.min(100, Math.round(score)));

    res.status(200).json({
      score,
      label: data.label || (score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Weak'),
      summary: data.summary || '',
      strengths: Array.isArray(data.strengths) ? data.strengths.slice(0, 4) : [],
      gaps: Array.isArray(data.gaps) ? data.gaps.slice(0, 4) : [],
      recommendations: Array.isArray(data.recommendations) ? data.recommendations.slice(0, 4) : [],
    });
  } catch (err) {
    console.error('[case-strength]', err.message);
    res.status(500).json({ error: 'analysis_failed' });
  }
}
