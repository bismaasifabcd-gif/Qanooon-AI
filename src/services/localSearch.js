/**
 * Local Law Search — Offline keyword matcher
 * Searches pre-stored law database when API is unavailable.
 */

import localLaws from '../data/localLaws';

const findLocalAnswer = (userMessage, language) => {
  const msg = userMessage.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  // Check each law category
  for (const [category, data] of Object.entries(localLaws)) {
    let score = 0;

    // Check how many keywords match
    for (const keyword of data.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        score++;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = data;
    }
  }

  // Return answer if at least 1 keyword matched
  if (highestScore > 0 && bestMatch) {
    return {
      found: true,
      answer: language === 'urdu' ? bestMatch.answer_ur : bestMatch.answer_en,
      law: bestMatch.law,
      section: bestMatch.section,
      severity: bestMatch.severity,
      isOffline: true
    };
  }

  return { found: false };
};

export default findLocalAnswer;
