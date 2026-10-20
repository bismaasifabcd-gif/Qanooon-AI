/**
 * Key Manager — Automatic API Key Rotation
 * When one key's quota is exhausted, automatically switches to the next.
 * Supports Gemini keys with Grok as final fallback.
 */

const geminiKeys = [
  import.meta.env.VITE_GEMINI_KEY_1,
  import.meta.env.VITE_GEMINI_KEY_2,
  import.meta.env.VITE_GEMINI_KEY_3,
  import.meta.env.VITE_GEMINI_KEY_4,
  import.meta.env.VITE_GEMINI_KEY_5,
].filter(Boolean);

const grokKeys = [
  import.meta.env.VITE_GROK_KEY_1,
  import.meta.env.VITE_GROK_KEY_2,
].filter(Boolean);

// Track which keys are exhausted
const exhaustedKeys = new Set();

// Track reset times (quota resets daily)
const keyResetTimes = {};

/**
 * Get the next available key.
 * Returns:
 *   - string (gemini key) if available
 *   - { key, isGrok: true } if falling back to Grok
 *   - { key: null, waitMinutes } if all keys exhausted
 */
const getNextGeminiKey = () => {
  // Find first non-exhausted Gemini key
  for (const key of geminiKeys) {
    if (!exhaustedKeys.has(key)) {
      return key;
    }
  }

  // All Gemini keys exhausted — try Grok as fallback
  for (const key of grokKeys) {
    if (!exhaustedKeys.has(key)) {
      return { key, isGrok: true };
    }
  }

  // All keys exhausted — calculate wait time
  const resetTimes = Object.values(keyResetTimes);
  if (resetTimes.length === 0) {
    return { key: null, waitMinutes: 60 };
  }
  const now = Date.now();
  const earliestReset = Math.min(...resetTimes);
  const waitMinutes = Math.max(1, Math.ceil((earliestReset - now) / 60000));
  return { key: null, waitMinutes };
};

/**
 * Mark a key as exhausted and schedule its reset at midnight PKT.
 */
const markKeyExhausted = (key) => {
  exhaustedKeys.add(key);

  // Schedule reset at midnight Pakistan Standard Time (UTC+5)
  const now = new Date();
  const pktOffset = 5 * 60; // minutes
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const pktMinutes = utcMinutes + pktOffset;

  let msUntilMidnight;
  if (pktMinutes >= 1440) {
    // Already past midnight PKT (next day in PKT)
    msUntilMidnight = (2880 - pktMinutes) * 60 * 1000;
  } else {
    msUntilMidnight = (1440 - pktMinutes) * 60 * 1000;
  }

  const resetTime = Date.now() + msUntilMidnight;
  keyResetTimes[key] = resetTime;

  setTimeout(() => {
    exhaustedKeys.delete(key);
    delete keyResetTimes[key];
    console.log('[KeyManager] Key quota reset:', key.slice(0, 10) + '...');
  }, msUntilMidnight);

  console.log(`[KeyManager] Key exhausted: ${key.slice(0, 10)}... | Reset in ${Math.ceil(msUntilMidnight / 60000)} min`);
};

/**
 * Get status info for debugging
 */
const getKeyStatus = () => ({
  totalGemini: geminiKeys.length,
  totalGrok: grokKeys.length,
  exhaustedCount: exhaustedKeys.size,
  availableGemini: geminiKeys.filter(k => !exhaustedKeys.has(k)).length,
  availableGrok: grokKeys.filter(k => !exhaustedKeys.has(k)).length,
});

export { getNextGeminiKey, markKeyExhausted, getKeyStatus, exhaustedKeys, geminiKeys, grokKeys };
