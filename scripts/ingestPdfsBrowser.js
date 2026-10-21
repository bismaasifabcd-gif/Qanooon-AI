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

// ─────────────────────────────────────────────────────────────────────────────
// Section-aware (structure-based) chunking for legal documents.
//
// Statutes are naturally organized as Act → Chapter → Section. We split the
// extracted text along those boundaries so that each chunk is a self-contained
// legal unit (one Section), carrying its own Chapter/Section metadata. This beats
// blind fixed-size splitting because a retrieved chunk is never cut off mid-clause
// and can cite its exact source.
// ─────────────────────────────────────────────────────────────────────────────

// A readable law name derived from the PDF file name (fallback to the file itself).
const LAW_NAME_MAP = {
  domestic: 'Domestic Violence Act 2012',
  peca: 'Prevention of Electronic Crimes Act 2016',
  ppc: 'Pakistan Penal Code 1860',
  constitution: 'Constitution of Pakistan 1973',
  family: 'Muslim Family Laws Ordinance 1961',
  labour: 'Labour Laws of Pakistan',
};

function deriveLawName(fileName, firstText) {
  const lower = (fileName + ' ' + firstText.slice(0, 400)).toLowerCase();
  for (const key of Object.keys(LAW_NAME_MAP)) {
    if (lower.includes(key)) return LAW_NAME_MAP[key];
  }
  return fileName.replace(/\.pdf$/i, '');
}

// Matches a chapter/part heading and captures a short, optional title that follows
// it (e.g. "CHAPTER III — Remedies"), stopping before the first section number.
const CHAPTER_RE = /\b(CHAPTER|PART)\s+([IVXLC]+|\d+)\b\s*[—:-]?\s*([A-Z][A-Za-z ]{0,40}?)?(?=\s+\d+[.\u2014:-]|\s+(?:CHAPTER|PART)\b|$)/gi;
// Matches the start of a section: "9.", "Section 9", "9-A." etc.
const SECTION_RE = /(?:^|\s)(?:Section\s+)?(\d+[A-Z]?)\s*[.\u2014:-]\s+/g;

/**
 * Split one document's text into section-level chunks with Act/Chapter/Section
 * metadata. Falls back to fixed-size windows (with overlap) for any text that has
 * no detectable section headings, so nothing is lost.
 */
function chunkBySection(fullText, lawName) {
  const chunks = [];
  let currentChapter = null;

  // Track the chapter in effect at each character offset.
  const chapterMarks = [];
  let m;
  CHAPTER_RE.lastIndex = 0;
  while ((m = CHAPTER_RE.exec(fullText)) !== null) {
    const num = m[2];
    const title = (m[3] || '').trim();
    const label = title ? `${num} — ${title}` : `${num}`;
    chapterMarks.push({ index: m.index, label });
  }
  const chapterAt = (pos) => {
    let label = null;
    for (const c of chapterMarks) {
      if (c.index <= pos) label = c.label; else break;
    }
    return label;
  };

  // Find every section boundary.
  const bounds = [];
  SECTION_RE.lastIndex = 0;
  while ((m = SECTION_RE.exec(fullText)) !== null) {
    bounds.push({ start: m.index, num: m[1] });
  }

  if (bounds.length === 0) {
    // No section structure detected → fixed-size fallback with overlap.
    return fixedSizeChunks(fullText, lawName);
  }

  for (let i = 0; i < bounds.length; i++) {
    const start = bounds[i].start;
    const end = i + 1 < bounds.length ? bounds[i + 1].start : fullText.length;
    const body = fullText.slice(start, end).trim();
    if (body.length < 40) continue;

    const sectionNum = bounds[i].num;
    const chapter = chapterAt(start);
    // Use the heading words right after the section number as a short title.
    // A section heading is typically a few Title-Case words before the first
    // sentence, e.g. "9. Protection Orders  A court may ...".
    const afterNum = body.replace(/^\s*(?:Section\s+)?\d+[A-Z]?\s*[.\u2014:-]\s*/, '');
    const titleMatch = (afterNum.match(/^([A-Z][A-Za-z]*(?:\s+(?:of|and|or|the|to|[A-Z][A-Za-z]*)){0,6})/) || [])[1] || '';
    const sectionTitle = cleanTitle(titleMatch);

    chunks.push(buildChunk({
      law: lawName,
      chapter: chapter || 'General Provisions',
      section: sectionTitle ? `${sectionNum} — ${sectionTitle}` : sectionNum,
      body,
    }));
  }
  return chunks.length ? chunks : fixedSizeChunks(fullText, lawName);
}

// Fixed-size windows (~1200 chars) with ~150-char overlap, used only when a
// document exposes no section headings.
function fixedSizeChunks(text, lawName, size = 1200, overlap = 150) {
  const out = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    const body = text.slice(i, i + size).trim();
    if (body.length < 40) continue;
    out.push(buildChunk({ law: lawName, chapter: 'General Provisions', section: '—', body }));
  }
  return out;
}

// Trim a captured heading to its title words: drop a trailing lone capital word
// that actually belongs to the next sentence (e.g. "Protection Orders A" → "Protection Orders").
function cleanTitle(t) {
  if (!t) return '';
  let title = t.trim().replace(/\s+(A|The|An|It|He|She|Any|No|Where|If|Subject)$/,'');
  return title.length < 60 ? title : '';
}

// Render a chunk's text with its legal header so the stored context is
// self-describing (and reads like the structured example in the README).
function buildChunk({ law, chapter, section, body }) {
  const header = `Law: ${law}\nChapter: ${chapter}\nSection: ${section}\n\n`;
  const cleanBody = body.replace(/\s+/g, ' ').trim();
  return {
    law,
    chapter,
    section,
    chunkText: header + cleanBody,
  };
}

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

      // 1. Extract the full document text (keeping a page map for citations).
      let fullText = '';
      const pageOffsets = [];
      for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ').trim();
        if (pageText.length < 50) continue;
        pageOffsets.push({ page: pageNum, offset: fullText.length });
        fullText += pageText + '\n';
      }

      if (fullText.length < 50) {
        console.log(`  - ${file}: no usable text, skipped.`);
        continue;
      }

      const lawName = deriveLawName(file, fullText);
      const pageFor = (approxOffset) => {
        let p = 1;
        for (const o of pageOffsets) { if (o.offset <= approxOffset) p = o.page; else break; }
        return p;
      };

      // 2. Section-aware chunking: one chunk per legal Section (Act → Chapter → Section).
      const sectionChunks = chunkBySection(fullText, lawName);
      console.log(`  - ${file}: ${lawName} → ${sectionChunks.length} section chunks.`);

      // 3. Embed each self-contained section chunk.
      let i = 0;
      for (const c of sectionChunks) {
        i++;
        console.log(`    · Embedding ${lawName} [${c.section}] (${i}/${sectionChunks.length})...`);
        const embedding = await embedText(c.chunkText.substring(0, 2000));
        vectorStore.push({
          lawTitle: file,
          law: c.law,
          chapter: c.chapter,
          section: c.section,
          chunkText: c.chunkText,
          pageNumber: pageFor(fullText.indexOf(c.chunkText.split('\n\n')[1]?.slice(0, 30) || '')),
          embedding,
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
