import fs from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { pipeline, env } from '@xenova/transformers';

// Force the WASM backend instead of the native onnxruntime-node binary.
// The native .node module fails to load on some Windows setups (ERR_DLOPEN_FAILED),
// and WASM is the same backend the browser uses — fully portable, no native deps.
env.backends.onnx.wasm.numThreads = 1;

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

// Embedding model — must match the runtime query embedder in src/services/ragService.js
const EMBEDDING_MODEL = 'Xenova/all-mpnet-base-v2'; // 768-dim, higher quality than MiniLM
const EXPECTED_DIM = 768; // all-mpnet-base-v2 output size

// Cap pages embedded per PDF to keep public/vector_store.json small enough for a
// browser-side RAG to download and hold in memory. Groq also does live web
// search, so local RAG is a supplement, not the only source.
const MAX_PAGES_PER_PDF = 200;

async function ingestPdfsForBrowser() {
  const booksDir = pathModule.join(__dirname, '../public/books');
  const outputFile = pathModule.join(__dirname, '../public/vector_store.json');

  // Build once: skip if a VALID mpnet store already exists (unless --force).
  // A store from the old MiniLM model (384-dim) is treated as stale and rebuilt.
  const force = process.argv.includes('--force');
  if (fs.existsSync(outputFile) && !force) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
      const dim = existing[0]?.embedding?.length;
      if (dim === EXPECTED_DIM && existing.length > 0) {
        console.log(`vector_store.json already valid (${existing.length} chunks, ${dim}-dim). Skipping rebuild.`);
        console.log("Run 'npm run ingest:browser -- --force' to regenerate anyway.");
        return;
      }
      console.log(`Existing store is ${dim}-dim (expected ${EXPECTED_DIM}). Rebuilding with ${EMBEDDING_MODEL}...`);
    } catch {
      console.log("Existing store unreadable. Rebuilding...");
    }
  }

  if (!fs.existsSync(booksDir)) {
    console.error(`Books directory not found at ${booksDir}`);
    return;
  }

  // 1. Initialize Local Embedding Model
  console.log(`Loading open-source embedding model '${EMBEDDING_MODEL}' (downloads once, ~420MB)...`);
  const generateEmbedding = await pipeline('feature-extraction', EMBEDDING_MODEL);

  const embedText = async (text) => {
    const output = await generateEmbedding(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  };

  const files = fs.readdirSync(booksDir).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${files.length} PDF files.`);
  
  const vectorStore = [];

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = pathModule.join(booksDir, file);
    const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
    
    try {
      const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      const pageLimit = Math.min(numPages, MAX_PAGES_PER_PDF);

      for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ').trim();
        
        if (pageText.length < 50) continue;

        console.log(`  - Embedding ${file} Page ${pageNum}/${pageLimit} (of ${numPages})...`);
        const embedding = await embedText(pageText.substring(0, 2000));

        vectorStore.push({
          lawTitle: file,
          chunkText: pageText,
          pageNumber: pageNum,
          embedding: embedding
        });
      }
      console.log(`  - Completed ${file}!`);
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
    }
  }

  if (vectorStore.length > 0) {
    // 2. Save everything to public/vector_store.json
    console.log(`Saving vector database to ${outputFile}...`);
    fs.writeFileSync(outputFile, JSON.stringify(vectorStore, null, 2));
    console.log(`Successfully generated browser-compatible vector database with ${vectorStore.length} chunks!`);
  } else {
    console.log("No text extracted to insert.");
  }
}

ingestPdfsForBrowser();
