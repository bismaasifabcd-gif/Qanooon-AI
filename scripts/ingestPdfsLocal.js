import fs from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// 1. Import Local AI & Vector Database
import * as lancedb from 'vectordb';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

// ─────────────────────────────────────────────────────────────────────────────
// Section-aware (structure-based) chunking — see scripts/ingestPdfsBrowser.js for
// the detailed explanation. Statutes are split along Act → Chapter → Section so
// each chunk is a self-contained legal unit with its own metadata.
// ─────────────────────────────────────────────────────────────────────────────
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
const CHAPTER_RE = /\b(CHAPTER|PART)\s+([IVXLC]+|\d+)\b\s*[—:-]?\s*([A-Z][A-Za-z ]{0,40}?)?(?=\s+\d+[.\u2014:-]|\s+(?:CHAPTER|PART)\b|$)/gi;
const SECTION_RE = /(?:^|\s)(?:Section\s+)?(\d+[A-Z]?)\s*[.\u2014:-]\s+/g;

function chunkBySection(fullText, lawName) {
  const chunks = [];
  const chapterMarks = [];
  let m;
  CHAPTER_RE.lastIndex = 0;
  while ((m = CHAPTER_RE.exec(fullText)) !== null) {
    const num = m[2];
    const title = (m[3] || '').trim();
    chapterMarks.push({ index: m.index, label: title ? `${num} — ${title}` : `${num}` });
  }
  const chapterAt = (pos) => {
    let label = null;
    for (const c of chapterMarks) { if (c.index <= pos) label = c.label; else break; }
    return label;
  };
  const bounds = [];
  SECTION_RE.lastIndex = 0;
  while ((m = SECTION_RE.exec(fullText)) !== null) bounds.push({ start: m.index, num: m[1] });
  if (bounds.length === 0) return fixedSizeChunks(fullText, lawName);

  for (let i = 0; i < bounds.length; i++) {
    const start = bounds[i].start;
    const end = i + 1 < bounds.length ? bounds[i + 1].start : fullText.length;
    const body = fullText.slice(start, end).trim();
    if (body.length < 40) continue;
    const sectionNum = bounds[i].num;
    const chapter = chapterAt(start);
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
function fixedSizeChunks(text, lawName, size = 1200, overlap = 150) {
  const out = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    const body = text.slice(i, i + size).trim();
    if (body.length < 40) continue;
    out.push(buildChunk({ law: lawName, chapter: 'General Provisions', section: '—', body }));
  }
  return out;
}
function cleanTitle(t) {
  if (!t) return '';
  const title = t.trim().replace(/\s+(A|The|An|It|He|She|Any|No|Where|If|Subject)$/, '');
  return title.length < 60 ? title : '';
}
function buildChunk({ law, chapter, section, body }) {
  const header = `Law: ${law}\nChapter: ${chapter}\nSection: ${section}\n\n`;
  return { law, chapter, section, chunkText: header + body.replace(/\s+/g, ' ').trim() };
}

async function ingestPdfsLocally() {
  const booksDir = pathModule.join(__dirname, '../public/books');
  const dbPath = pathModule.join(__dirname, '../vector_store');
  
  if (!fs.existsSync(booksDir)) {
    console.error(`Books directory not found at ${booksDir}`);
    return;
  }

  // 2. Initialize Local Embedding Model (Downloads to your machine once, totally free)
  console.log("Loading open-source embedding model 'all-MiniLM-L6-v2' (this may take a minute on the first run)...");
  const generateEmbedding = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const embedText = async (text) => {
    const output = await generateEmbedding(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  };

  // 3. Initialize Local Vector Database (LanceDB)
  console.log(`Connecting to local Vector DB at ${dbPath}...`);
  const db = await lancedb.connect(dbPath);
  
  try {
    // If table exists, we drop it to start fresh for this script, 
    // but in reality you can check if it exists and skip.
    const existingTableNames = await db.tableNames();
    if (existingTableNames.includes('laws')) {
      console.log("Vector DB 'laws' table already exists. Dropping it to rebuild...");
      await db.dropTable('laws');
    }
  } catch (err) {
    // Ignore error if table doesn't exist
  }

  const files = fs.readdirSync(booksDir).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${files.length} PDF files.`);
  
  const dataToInsert = [];

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = pathModule.join(booksDir, file);
    const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
    
    try {
      const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;

      // 1. Extract full document text (cap pages for a fast demo pass).
      let fullText = '';
      const pageLimit = Math.min(numPages, 50);
      for (let pageNum = 1; pageNum <= pageLimit; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ').trim();
        if (pageText.length < 50) continue;
        fullText += pageText + '\n';
      }
      if (fullText.length < 50) { console.log(`  - ${file}: no usable text, skipped.`); continue; }

      // 2. Section-aware chunking (Act → Chapter → Section).
      const lawName = deriveLawName(file, fullText);
      const sectionChunks = chunkBySection(fullText, lawName);
      console.log(`  - ${file}: ${lawName} → ${sectionChunks.length} section chunks.`);

      // 3. Embed each self-contained section chunk (local, 0 cost).
      let i = 0;
      for (const c of sectionChunks) {
        i++;
        console.log(`    · Embedding ${lawName} [${c.section}] (${i}/${sectionChunks.length})...`);
        const embedding = await embedText(c.chunkText.substring(0, 2000));
        dataToInsert.push({
          vector: embedding,
          lawTitle: file,
          law: c.law,
          chapter: c.chapter,
          section: c.section,
          chunkText: c.chunkText,
        });
      }
      console.log(`  - Completed ${file}!`);
    } catch (err) {
      console.error(`Failed to parse ${file}:`, err);
    }
  }

  if (dataToInsert.length > 0) {
    // 4. Save to disk permanently
    console.log("Saving vectors to local database...");
    await db.createTable('laws', dataToInsert);
    console.log(`Successfully embedded and saved ${dataToInsert.length} chunks to local Vector DB!`);
    console.log(`Database saved at: ${dbPath}`);
  } else {
    console.log("No text extracted to insert.");
  }
}

ingestPdfsLocally();
