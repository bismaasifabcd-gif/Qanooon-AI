import fs from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, getDoc, setDoc, query, where } from 'firebase/firestore';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);
dotenv.config({ path: pathModule.join(__dirname, '../.env') });

// Setup pdfjs-dist for Node.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// 1. Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2. Setup Gemini via Fetch (matches frontend)
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

async function getEmbedding(text) {
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
}

async function ingestPdfs() {
  // 1. Check if law_vectors has any existing data to completely save API calls
  try {
    const lawVectorsSnap = await getDocs(collection(db, "law_vectors"));
    if (!lawVectorsSnap.empty) {
      console.log("RAG Status: law_vectors collection already contains data. Skipping PDF ingestion to conserve quota.");
      process.exit(0);
    }
  } catch (err) {
    console.error("Error checking law_vectors content:", err);
  }

  // 2. Check one-time flag in Firestore first
  try {
    const statusDoc = await getDoc(doc(db, "app_settings", "rag_status"));
    if (statusDoc.exists() && statusDoc.data().embeddingsCreated === true) {
      console.log("RAG Status: Embeddings already permanently generated. Skipping PDF Ingestion.");
      process.exit(0);
    }
  } catch (err) {
    console.error("Error checking rag_status:", err);
  }

  const booksDir = pathModule.join(__dirname, '../public/books');
  
  if (!fs.existsSync(booksDir)) {
    console.error(`Books directory not found at ${booksDir}`);
    return;
  }

  const files = fs.readdirSync(booksDir).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${files.length} PDF files.`);
  let totalChunks = 0;

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = pathModule.join(booksDir, file);
    const dataBuffer = new Uint8Array(fs.readFileSync(filePath));
    
    try {
      const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
      const pdfDocument = await loadingTask.promise;
      const numPages = pdfDocument.numPages;
      
      console.log(`  - PDF has ${numPages} pages.`);
      
      let successCount = 0;
      
      // We process page by page to preserve location mapping
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ').trim();
        
        if (pageText.length < 50) continue; // Skip empty/thin pages

        // To save quota, we only process first 50 pages of each book for the demo
        if (pageNum > 50) {
           console.log(`  - Skipping page ${pageNum} (limit reached for this pass)`);
           break;
        }

        try {
          // Check if page already vectorized
          const q = query(
            collection(db, "law_vectors"),
            where("lawTitle", "==", file),
            where("pageNumber", "==", pageNum)
          );
          const existingSnap = await getDocs(q);
          if (!existingSnap.empty) {
            console.log(`    ... Page ${pageNum} already vectorized. Skipping.`);
            successCount++;
            totalChunks++;
            continue;
          }

          const embedding = await getEmbedding(pageText.substring(0, 2000)); // Limit text for embedding
          
          await addDoc(collection(db, "law_vectors"), {
            lawTitle: file,
            chunkText: pageText,
            embedding: embedding,
            pageNumber: pageNum,
            createdAt: serverTimestamp(),
            source: 'pdf_upload'
          });
          
          successCount++;
          totalChunks++;
          if (pageNum % 5 === 0) {
            console.log(`    ... Progress: Page ${pageNum}/${numPages}`);
          }
        } catch (err) {
          console.error(`    - Error on page ${pageNum}:`, err.message);
          // Wait if quota exceeded
          if (err.message.includes('429') || err.message.includes('quota')) {
            console.log('    ... Quota hit, waiting 30s...');
            await new Promise(r => setTimeout(r, 30000));
            pageNum--; // Retry same page
          }
        }
      }
      console.log(`  - Completed ${file}! Uploaded ${successCount} pages.`);
    } catch (err) {
      console.error(`  - Failed to parse ${file}:`, err);
    }
  }
  
  // Set one-time flag in Firestore app_settings/rag_status
  try {
    await setDoc(doc(db, "app_settings", "rag_status"), {
      embeddingsCreated: true,
      createdAt: serverTimestamp(),
      totalChunks
    });
    console.log("RAG Status: Embeddings marked as permanently created in Firestore.");
  } catch (err) {
    console.error("Error setting rag_status:", err);
  }

  console.log('All books processed with page mapping!');
  process.exit(0);
}

ingestPdfs();
