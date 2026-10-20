import { callGroq, buildSystemPrompt, GROQ_CHAT_MODEL, cors, readBody } from './_lib.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  try {
    const { message, history = [], userName = '', language = 'english' } = readBody(req);
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
    res.status(200).json({ response: content });
  } catch (err) {
    console.error('[chat]', err.message);
    res.status(500).json({ error: 'chat_failed' });
  }
}
