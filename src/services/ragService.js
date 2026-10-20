import { pipeline, env } from '@xenova/transformers';

// Tell Xenova/transformers to download model/WASM from CDN since browser doesn't have Node FS
env.allowLocalModels = false;
env.useBrowserCache = true; // Caches the 90MB model in browser IndexedDB once, loads instantly on next visits

let generateEmbedding = null;
let vectorDatabase = null;

// Cosine Similarity calculator inside JavaScript
function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Fetch the pre-computed static JSON vector database from public/vector_store.json
async function loadVectorDatabase() {
  if (vectorDatabase) return vectorDatabase;
  
  console.log("Browser RAG: Fetching pre-compiled vector_store.json...");
  const response = await fetch('/vector_store.json');
  if (!response.ok) {
    throw new Error("Failed to load static vector database file");
  }
  vectorDatabase = await response.json();
  console.log(`Browser RAG: Loaded ${vectorDatabase.length} law chunks into browser memory.`);
  return vectorDatabase;
}

// Load the embedding model locally in browser memory
async function loadEmbeddingModel() {
  if (generateEmbedding) return generateEmbedding;
  
  // Must match the model used to build public/vector_store.json (see scripts/ingestPdfsBrowser.js)
  console.log("Browser RAG: Loading HuggingFace model in browser (all-mpnet-base-v2)...");
  generateEmbedding = await pipeline('feature-extraction', 'Xenova/all-mpnet-base-v2');
  console.log("Browser RAG: Model initialized successfully.");
  return generateEmbedding;
}

/**
 * Perform vector search completely in the user's browser (0 API cost, 100% serverless).
 */
export const searchLaws = async (userQuery, topK = 5) => {
  try {
    // 1. Fetch DB and Load WASM model in parallel
    const [db, embed] = await Promise.all([
      loadVectorDatabase(),
      loadEmbeddingModel()
    ]);

    // 2. Generate embedding for query on-the-fly inside the browser (0 cost)
    console.log("Browser RAG: Embedding query...");
    const output = await embed(userQuery, { pooling: 'mean', normalize: true });
    const queryVector = Array.from(output.data);

    // Guard: the stored vectors must have the same dimension as the query
    // embedder. If vector_store.json was built with a different model (e.g. the
    // old 384-dim MiniLM store), skip RAG rather than return garbage matches.
    const storedDim = db[0]?.embedding?.length;
    if (storedDim && storedDim !== queryVector.length) {
      console.warn(
        `Browser RAG: dimension mismatch (query ${queryVector.length}, store ${storedDim}). ` +
        "Rebuild vector_store.json with the mpnet ingest script. Skipping local RAG."
      );
      return [];
    }

    // 3. Compute cosine similarity between the query and all stored chunks
    console.log("Browser RAG: Matching vectors...");
    const scoredChunks = db.map(chunk => {
      const score = cosineSimilarity(queryVector, chunk.embedding);
      return { ...chunk, score };
    });

    // 4. Sort and select top matches
    const topResults = scoredChunks
      .filter(chunk => chunk.score >= 0.35) // mpnet cosine threshold (lower spread than MiniLM)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    console.log(`Browser RAG: Search complete. Found ${topResults.length} relevant context documents.`);
    return topResults;

  } catch (error) {
    console.error("Browser RAG Search Error:", error);
    return [];
  }
};
