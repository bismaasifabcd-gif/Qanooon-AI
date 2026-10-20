/**
 * Parses Gemini response text into structured card sections based on boundary tags.
 * Falls back gracefully to single-section text if parsing fails.
 */
const parseResponse = (rawText) => {
  const sections = {
    lawName: '',
    explanation: '',
    actions: [],
    punishment: '',
    severity: 'MEDIUM'
  };

  if (!rawText) return sections;

  // Extract each section using strict tag boundaries
  const lawMatch = rawText.match(/\[LAW_NAME\](.*?)\[EXPLANATION\]/s);
  const explMatch = rawText.match(/\[EXPLANATION\](.*?)\[ACTIONS\]/s);
  const actionsMatch = rawText.match(/\[ACTIONS\](.*?)\[PUNISHMENT\]/s);
  const punishMatch = rawText.match(/\[PUNISHMENT\](.*?)\[SEVERITY\]/s);
  const severityMatch = rawText.match(/\[SEVERITY\](.*?)$/s);

  if (lawMatch) {
    sections.lawName = lawMatch[1].trim();
  }
  if (explMatch) {
    sections.explanation = explMatch[1].trim();
  }
  
  if (actionsMatch) {
    sections.actions = actionsMatch[1]
      .trim()
      .split('\n')
      .filter(a => a.trim())
      .map(a => a.replace(/^\d+\.\s*/, '').trim()); // Strip leading "1. " list formatting
  }
  
  if (punishMatch) {
    sections.punishment = punishMatch[1].trim();
  }
  
  if (severityMatch) {
    const rawSev = severityMatch[1].trim().toUpperCase();
    if (rawSev.includes('HIGH')) {
      sections.severity = 'HIGH';
    } else if (rawSev.includes('LOW')) {
      sections.severity = 'LOW';
    } else {
      sections.severity = 'MEDIUM';
    }
  }

  // Graceful fallback if the parser returned empty sections (e.g. model output is free-form)
  if (!sections.lawName && !sections.explanation && sections.actions.length === 0) {
    sections.explanation = rawText;
    sections.lawName = 'General Pakistani Law';
    sections.actions = [
      'Consult a certified legal practitioner.',
      'Gather any documentation or evidence related to the event.',
      'Report any criminal activity to the local authorities.'
    ];
  }

  return sections;
};

export default parseResponse;
