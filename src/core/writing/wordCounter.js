/**
 * French Word Counter with Authentic Orthographic & Tokenization Rules.
 * Respects official DELF B2 / DALF C1 production écrite criteria.
 */

// Exceptions for compound terms that count as a single word
export const COMPOUND_EXCEPTIONS = [
  'aujourd\'hui', 'c\'est-à-dire', 'rendez-vous', 'peut-être', 'sur-le-champ'
];

/**
 * Counts words in French text conforming to France Éducation international exam criteria:
 * - Apostrophized clitics (l', d', c', j', m', t', s', n', qu') count as separate words:
 *   "l'arbre" = 2 words, "d'accord" = 2 words, "c'est" = 2 words.
 * - Hyphenated compound nouns and fixed expressions count as 1 word:
 *   "socio-économique" = 1 word, "grand-père" = 1 word.
 * - Numbers written in digits (e.g. "250") count as 1 word.
 */
export function countFrenchWords(text) {
  if (!text || typeof text !== 'string') return 0;

  let normalized = text
    .replace(/[\u2018\u2019\u02BC]/g, "'") // Normalize apostrophes
    .replace(/[\u2013\u2014]/g, '-')     // Normalize dashes
    .trim();

  if (!normalized) return 0;

  // Protect designated compound exceptions with placeholder
  const protectedMap = new Map();
  COMPOUND_EXCEPTIONS.forEach((term, index) => {
    const placeholder = `__CPD_EXC_${index}__`;
    const regex = new RegExp(term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    if (regex.test(normalized)) {
      normalized = normalized.replace(regex, placeholder);
      protectedMap.set(placeholder, 1);
    }
  });

  // Separate elisions by replacing apostrophe with apostrophe + space
  // e.g., "l'homme" -> "l' homme", "d'un" -> "d' un"
  normalized = normalized.replace(/([a-zA-ZÀ-ÿ])'([a-zA-ZÀ-ÿ0-9])/g, "$1' $2");

  // Match words: sequences of letters (including French diacritics), hyphens within words, numbers, or protected compound placeholders
  const matches = normalized.match(/[a-zA-ZÀ-ÿ0-9]+(?:-[a-zA-ZÀ-ÿ0-9]+)*|__CPD_EXC_\d+__/g);
  return matches ? matches.length : 0;
}
