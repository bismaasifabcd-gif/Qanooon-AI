import fs from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// 1. Import Local AI & Vector Database
import * as lancedb from 'vectordb';
import { pipeline } from '@xenova/transformers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

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
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ').trim();
        
        if (pageText.length < 50) continue; 
        
        // Demo limit (same as your original script)
        if (pageNum > 50) {
            console.log(`  - Skipping page ${pageNum} (limit reached for this pass)`);
            break;
        }

        console.log(`  - Embedding ${file} Page ${pageNum}...`);
        // Embed locally, 0 costs
        const embedding = await embedText(pageText.substring(0, 2000));
        
        dataToInsert.push({
          vector: embedding,
          lawTitle: file,
          chunkText: pageText,
          pageNumber: pageNum
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
