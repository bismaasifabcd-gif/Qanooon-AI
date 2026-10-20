import { getLawyers, cors } from './_lib.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const city = (req.query.city || 'Lahore').toString();
    const category = (req.query.category || '').toString();
    const lawyers = await getLawyers(city, category);
    res.status(200).json({ lawyers });
  } catch (err) {
    if (err.message === 'unsupported_city') {
      return res.status(400).json({ error: 'unsupported_city' });
    }
    console.error('[lawyers]', err.message);
    res.status(502).json({ error: 'lawyer_lookup_failed' });
  }
}
