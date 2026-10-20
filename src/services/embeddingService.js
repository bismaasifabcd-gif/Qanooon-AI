/**
 * Service for generating embeddings using Gemini API and vector operations.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Generates a vector embedding for the given text.
 * Uses models/text-embedding-004 (768 dimensions).
 */
export const getEmbedding = async (text) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "models/gemini-embedding-001",
      content: {
        parts: [{ text }]
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Embedding Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.embedding.values;
};

/**
 * Calculates the cosine similarity between two vectors.
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
};
