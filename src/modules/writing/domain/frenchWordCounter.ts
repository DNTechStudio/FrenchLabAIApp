/**
 * Linguistic Word Counter for French DELF B2 Examinations
 *
 * Official France Éducation international / CIEP guidelines:
 * 1. An elision with an apostrophe counts as TWO words:
 *    - "c'est" -> 2 words ("c'" + "est")
 *    - "l'homme" -> 2 words ("l'" + "homme")
 *    - "j'ai" -> 2 words ("j'" + "ai")
 *    - "d'accord" -> 2 words ("d'" + "accord")
 * 2. Inversion pronouns in questions (-vous, -tu, -il, -on) count as separate words:
 *    - "allez-vous" -> 2 words ("allez" + "vous")
 * 3. Standard compound words connected by hyphens (without apostrophes) count as ONE word:
 *    - "peut-être" -> 1 word
 *    - "socio-économique" -> 1 word
 *    - "rendez-vous" -> 1 word
 * 4. Compound words with elisions count each elided particle:
 *    - "c'est-à-dire" -> "c'" (1) + "est-à-dire" (1) = 2 words
 * 5. Punctuation marks, numbers, and symbols do not inflate word counts.
 */

export type WordCountStatus = 'under_target' | 'nearing_target' | 'target_achieved';

// Known compound lexical units that contain hyphenated pronouns or particles
const COMPOUND_EXCEPTIONS = [
  'rendez-vous',
  'au-dessus',
  'au-dessous',
  'au-delà',
  'vis-à-vis',
  'arc-en-ciel',
];

export function countFrenchWords(text: string): number {
  if (!text || !text.trim()) {
    return 0;
  }

  // Normalize apostrophes: replace typographic/curly apostrophes (’ or ‘) with standard straight apostrophe (')
  let normalized = text.replace(/[’‘]/g, "'");

  // Protect specific compound exceptions before pronoun inversion splitting
  COMPOUND_EXCEPTIONS.forEach((compound, idx) => {
    const regex = new RegExp(`\\b${compound}\\b`, 'gi');
    normalized = normalized.replace(regex, `__compound_${idx}__`);
  });

  // Split elisions (apostrophes) into spaces
  normalized = normalized.replace(/[']/g, ' ');

  // Split verb-pronoun inversions (e.g., allez-vous, dit-il, a-t-il, voulez-vous)
  normalized = normalized.replace(/-(?:t-)?(je|tu|il|elle|on|nous|vous|ils|elles|ce)\b/gi, ' $1');

  // Restore protected compound exceptions
  COMPOUND_EXCEPTIONS.forEach((compound, idx) => {
    normalized = normalized.replace(new RegExp(`__compound_${idx}__`, 'g'), compound);
  });

  // Match all valid French lexical tokens (letters including French diacritics and optional internal hyphens)
  const matches = normalized.match(/[a-zA-ZÀ-ÿœŒæÆ]+(?:-[a-zA-ZÀ-ÿœŒæÆ]+)*/g);

  return matches ? matches.length : 0;
}

export function getWordCountStatus(currentCount: number, target = 250): WordCountStatus {
  if (currentCount >= target) {
    return 'target_achieved';
  }
  if (currentCount >= target * 0.8) {
    return 'nearing_target';
  }
  return 'under_target';
}
