import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

const DAILY_LIMIT = 50; // Reasonable daily limit per user (server-enforced)
const DOCUMENT_LIMIT = 5; // Max document generations per day

/**
 * Server-side rate limiter using Firestore.
 * Stores usage counts per user per day — cannot be bypassed by clearing localStorage.
 */
export const checkRateLimit = async (userId, type = 'chat') => {
  if (!userId) {
    // If not logged in, fall back to localStorage with strict limit
    return checkLocalRateLimit(type);
  }

  const today = new Date().toISOString().split('T')[0];
  const rateLimitRef = doc(db, 'users', userId, 'rateLimit', today);

  try {
    const rateLimitDoc = await getDoc(rateLimitRef);
    
    if (!rateLimitDoc.exists()) {
      // First query of the day — create the document
      await setDoc(rateLimitRef, {
        chatCount: type === 'chat' ? 1 : 0,
        docCount: type === 'document' ? 1 : 0,
        date: today,
        updatedAt: serverTimestamp()
      });
      return { allowed: true, remaining: type === 'chat' ? DAILY_LIMIT - 1 : DOCUMENT_LIMIT - 1 };
    }

    const data = rateLimitDoc.data();
    const currentCount = type === 'chat' ? (data.chatCount || 0) : (data.docCount || 0);
    const limit = type === 'chat' ? DAILY_LIMIT : DOCUMENT_LIMIT;

    if (currentCount >= limit) {
      return { 
        allowed: false, 
        remaining: 0,
        message: type === 'chat' 
          ? `Daily chat limit reached (${DAILY_LIMIT}/day). Please try again tomorrow.`
          : `Daily document generation limit reached (${DOCUMENT_LIMIT}/day). Please try again tomorrow.`
      };
    }

    // Increment the counter
    const updateField = type === 'chat' ? 'chatCount' : 'docCount';
    await setDoc(rateLimitRef, {
      ...data,
      [updateField]: currentCount + 1,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { allowed: true, remaining: limit - currentCount - 1 };

  } catch (error) {
    console.error('Rate limit check failed:', error);
    // On error, allow the request but log it (fail-open for UX)
    return { allowed: true, remaining: -1 };
  }
};

/**
 * Fallback localStorage rate limiter for non-authenticated users.
 */
function checkLocalRateLimit(type) {
  const today = new Date().toISOString().split('T')[0];
  const key = `kanoon_${type}_limit_${today}`;
  const count = parseInt(localStorage.getItem(key) || '0', 10);
  const limit = type === 'chat' ? 10 : 3; // Stricter limits for non-authenticated users

  if (count >= limit) {
    return { 
      allowed: false, 
      remaining: 0,
      message: 'Please sign in to continue using AskLex. Guest limit reached.'
    };
  }

  localStorage.setItem(key, (count + 1).toString());
  return { allowed: true, remaining: limit - count - 1 };
}

export const getRemainingQueries = async (userId) => {
  if (!userId) return { chat: 10, document: 3 };
  
  const today = new Date().toISOString().split('T')[0];
  const rateLimitRef = doc(db, 'users', userId, 'rateLimit', today);

  try {
    const rateLimitDoc = await getDoc(rateLimitRef);
    if (!rateLimitDoc.exists()) {
      return { chat: DAILY_LIMIT, document: DOCUMENT_LIMIT };
    }
    const data = rateLimitDoc.data();
    return {
      chat: Math.max(0, DAILY_LIMIT - (data.chatCount || 0)),
      document: Math.max(0, DOCUMENT_LIMIT - (data.docCount || 0))
    };
  } catch {
    return { chat: DAILY_LIMIT, document: DOCUMENT_LIMIT };
  }
};

export { DAILY_LIMIT, DOCUMENT_LIMIT };
