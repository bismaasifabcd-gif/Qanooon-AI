/**
 * AI Service — Groq only.
 *
 * The chatbot's answers come exclusively from the Groq-backed server
 * (server/server.js, deployed free on Render). No Wikipedia, no local RAG,
 * no other sources. The Groq API key lives on that server, never in the browser.
 *
 * Set VITE_API_URL to the server's URL (e.g. https://kanoon-ai-backend.onrender.com).
 * In dev it defaults to http://localhost:5000.
 *
 * Function names callGemini / callGeminiForDocument are kept for backward
 * compatibility with existing callers (Chatbot.jsx, FIR/Complaint components).
 */

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

/**
 * Chat — asks the Groq backend and returns its answer. Nothing else.
 */
export const callGemini = async (
  userMessage,
  conversationHistory,
  userName,
  language
) => {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      history: conversationHistory || [],
      userName: userName || '',
      language: language || 'english',
    }),
  });

  if (!res.ok) throw new Error(`Backend chat error ${res.status}`);

  const data = await res.json();
  const text = data?.response?.trim();
  if (!text) throw new Error('Empty response from backend');
  return text;
};

/**
 * Document generation — drafts FIRs / complaint letters via the Groq backend.
 */
export const callGeminiForDocument = async (prompt, language) => {
  const res = await fetch(`${API_BASE}/api/document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language: language || 'english' }),
  });
  if (!res.ok) throw new Error(`Backend document error ${res.status}`);
  const data = await res.json();
  const text = data?.response?.trim();
  if (!text) throw new Error('Empty response from backend');
  return text;
};

export default callGemini;
