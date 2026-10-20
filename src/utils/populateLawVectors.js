import { db } from "../firebase/config";
import { collection, getDocs, addDoc, serverTimestamp, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import { getEmbedding } from "../services/embeddingService";

/**
 * Iterates through all laws and generates embeddings for their sections.
 */
export const populateLawVectors = async () => {
  console.log("Starting Law Vectorization...");
  
  // 1. Check if law_vectors has any existing data first to completely save API calls
  try {
    const lawVectorsSnap = await getDocs(collection(db, "law_vectors"));
    if (!lawVectorsSnap.empty) {
      console.log("RAG Status: law_vectors collection already contains data. Skipping all embedding generation to conserve quota.");
      return true;
    }
  } catch (err) {
    console.error("Error checking law_vectors content:", err);
  }
  
  // 2. Check one-time flag in Firestore
  try {
    const statusDoc = await getDoc(doc(db, "app_settings", "rag_status"));
    if (statusDoc.exists() && statusDoc.data().embeddingsCreated === true) {
      console.log("RAG Status: Embeddings already marked as completed. Skipping API calls.");
      return true;
    }
  } catch (err) {
    console.error("Error checking rag_status:", err);
  }

  const lawsSnapshot = await getDocs(collection(db, "laws"));
  let totalChunks = 0;
  
  for (const lawDoc of lawsSnapshot.docs) {
    const law = lawDoc.data();
    const lawId = lawDoc.id;

    console.log(`Vectorizing: ${law.title}`);

    // Loop through sections
    const sectionEntries = Object.entries(law.sections || {});
    
    for (const [sectionNum, section] of sectionEntries) {
      try {
        // 2. Check if chunk already vectorized to prevent duplicate calls
        const q = query(
          collection(db, "law_vectors"),
          where("lawId", "==", lawId),
          where("sectionNum", "==", sectionNum)
        );
        const existingSnap = await getDocs(q);
        if (!existingSnap.empty) {
          console.log(`  - Section ${sectionNum} already vectorized. Skipping.`);
          totalChunks++;
          continue;
        }

        // Create English Chunk
        const chunkText = `Law: ${law.title}. Section ${sectionNum}: ${section.title}. Text: ${section.text}`;
        const embedding = await getEmbedding(chunkText);

        await addDoc(collection(db, "law_vectors"), {
          lawId,
          lawTitle: law.title,
          lawTitleUrdu: law.titleUrdu,
          sectionNum,
          sectionTitle: section.title,
          chunkText,
          chunkTextUrdu: `قانون: ${law.titleUrdu}۔ دفعہ ${sectionNum}: ${section.titleUrdu}۔ متن: ${section.textUrdu}`,
          embedding,
          createdAt: serverTimestamp()
        });

        console.log(`  - Section ${sectionNum} vectorized.`);
        totalChunks++;
      } catch (err) {
        console.error(`  - Error vectorizing section ${sectionNum}:`, err);
      }
    }
  }
  
  // 3. Save permanent flag in app_settings
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

  console.log("Vectorization Complete!");
  return true;
};
