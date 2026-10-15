/**
 * Dictation Engine for DELF B2 (« La Dictée »)
 * Provides French sentence segmentation, orthographic/morphosyntactic error classification,
 * and transcription accuracy evaluation.
 */

import { countFrenchWords } from './frenchWordCounter.ts';
import { computeWordDiff } from './diffEngine.ts';
import type {
  DictationSentence,
  DictationEvaluation,
  DictationMistake,
  DictationMistakeCategory,
} from './types.ts';

// Known French grammatical homophone clusters
const FRENCH_HOMOPHONE_CLUSTERS: string[][] = [
  ["c'est", "s'est", 'ces', 'ses', 'sais', 'sait'],
  ['a', 'à'],
  ['ou', 'où'],
  ['on', 'ont'],
  ['son', 'sont'],
  ['ce', 'se'],
  ['leur', 'leurs'],
  ['tout', 'tous'],
  ['la', 'là', "l'a", "l'as"],
  ['peu', 'peut', 'peux'],
  ['près', 'prêt'],
  ['mes', 'mais', 'met', 'mets'],
  ['dans', "d'en", 'dent'],
  ['sans', "s'en", 'cent', 'sang'],
];

/**
 * Remove diacritics / accents from a string for base comparison.
 */
export function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Clean punctuation and trim word for linguistic matching.
 */
export function cleanWord(str: string): string {
  return str
    .replace(/^[\s.,;:!?"'«»()—–-]+|[\s.,;:!?"'«»()—–-]+$/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Splits French text into sentences, protecting abbreviations like M., Mme., etc.
 */
export function splitFrenchSentences(text: string): DictationSentence[] {
  if (!text || !text.trim()) return [];

  // Protect common French abbreviations with unique placeholder tokens
  const protectedText = text
    .replace(/\bM\.\s+/g, 'M_DOT_SPACE_')
    .replace(/\bMme\.\s+/g, 'MME_DOT_SPACE_')
    .replace(/\bMlle\.\s+/g, 'MLLE_DOT_SPACE_')
    .replace(/\betc\.\s*(?=[,a-zà-ÿ])/g, 'ETC_DOT_SPACE_')
    .replace(/\bDr\.\s+/g, 'DR_DOT_SPACE_')
    .replace(/\bProf\.\s+/g, 'PROF_DOT_SPACE_')
    .replace(/\n+/g, ' BREAK_PARAGRAPH_ ');

  // Split on sentence-ending punctuation followed by whitespace or uppercase/quote
  const rawSentences = protectedText.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ÿ0-9«"–—]|BREAK_PARAGRAPH_|$)/);

  const sentences: DictationSentence[] = [];

  rawSentences.forEach((raw) => {
    // Restore abbreviations and paragraph breaks
    const cleaned = raw
      .replace(/M_DOT_SPACE_/g, 'M. ')
      .replace(/MME_DOT_SPACE_/g, 'Mme. ')
      .replace(/MLLE_DOT_SPACE_/g, 'Mlle. ')
      .replace(/ETC_DOT_SPACE_/g, 'etc. ')
      .replace(/DR_DOT_SPACE_/g, 'Dr. ')
      .replace(/PROF_DOT_SPACE_/g, 'Prof. ')
      .replace(/BREAK_PARAGRAPH_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length > 0) {
      sentences.push({
        index: sentences.length + 1,
        text: cleaned,
        wordCount: countFrenchWords(cleaned),
      });
    }
  });

  return sentences;
}

/**
 * Classifies a discrepancy between expected word and user word into a French linguistic category.
 */
export function classifyDictationMistake(
  expectedRaw: string,
  userRaw: string
): DictationMistakeCategory {
  const expected = cleanWord(expectedRaw);
  const user = cleanWord(userRaw);

  if (!expected || !user) {
    return 'lexique';
  }

  // 1. Homophone error: both words belong to the same phonetic confusion cluster (e.g. a/à, c'est/s'est, ou/où)
  for (const cluster of FRENCH_HOMOPHONE_CLUSTERS) {
    if (cluster.includes(expected) && cluster.includes(user)) {
      return 'homophones';
    }
  }

  // 2. Accent & Diacritic error: identical letters when diacritics stripped
  if (stripAccents(expected) === stripAccents(user) && expected !== user) {
    return 'accents';
  }

  // 3. Agreement & Morphosyntax error:
  // - Plural markers (-s, -x, -aux)
  // - Feminine markers (-e, -es)
  // - Participle vs infinitive / verbal suffix (-é, -ée, -és, -ées, -er, -ez)
  // - Verb conjugation agreement (-e vs -ent, -ait vs -aient, -ons vs -ont)
  const isPluralDiff =
    expected + 's' === user ||
    user + 's' === expected ||
    expected + 'x' === user ||
    user + 'x' === expected;

  const isFeminineDiff =
    expected + 'e' === user ||
    user + 'e' === expected ||
    expected + 'es' === user ||
    user + 'es' === expected;

  const isParticipleOrVerbDiff =
    /^(.*)(er|ez|é|ée|és|ées)$/.test(expected) &&
    /^(.*)(er|ez|é|ée|és|ées)$/.test(user) &&
    expected.replace(/(er|ez|é|ée|és|ées)$/, '') === user.replace(/(er|ez|é|ée|és|ées)$/, '');

  const isVerbEndingDiff =
    /^(.*)(e|ent|ait|aient|ons|ont|ais|ait)$/.test(expected) &&
    /^(.*)(e|ent|ait|aient|ons|ont|ais|ait)$/.test(user) &&
    expected.slice(0, 3) === user.slice(0, 3);

  if (isPluralDiff || isFeminineDiff || isParticipleOrVerbDiff || isVerbEndingDiff) {
    return 'accords';
  }

  // 4. Default fallback: lexical error or general misspelling
  return 'lexique';
}

/**
 * Human-readable pedagogical explanation for a categorized mistake.
 */
function getMistakeExplanation(
  category: DictationMistakeCategory,
  expected: string,
  user: string
): string {
  switch (category) {
    case 'accents':
      return `Attention aux accents : "${user}" au lieu de "${expected}". En français, les accents modifient la prononciation et la nature grammaticale.`;
    case 'homophones':
      return `Confusion d'homophones grammaticaux : "${user}" a été écrit à la place de "${expected}". Distinguez la nature grammaticale de ces mots de même sonorité.`;
    case 'accords':
      return `Erreur d'accord ou de morphosyntaxe : "${user}" au lieu de "${expected}". Vérifiez les accords en genre/nombre et les terminaisons verbales.`;
    case 'lexique':
      return `Écart lexical ou orthographique : "${user}" attendu "${expected}".`;
  }
}

/**
 * Evaluates full user transcription against expected reference text.
 */
export function evaluateDictation(
  referenceText: string,
  userText: string
): DictationEvaluation {
  const totalExpectedWords = countFrenchWords(referenceText);
  if (totalExpectedWords === 0) {
    return {
      accuracy: 100,
      totalExpectedWords: 0,
      correctWordsCount: 0,
      mistakesCount: 0,
      mistakes: [],
      diffTokens: [],
      evaluatedAt: Date.now(),
    };
  }

  const diffTokens = computeWordDiff(referenceText, userText);
  const mistakes: DictationMistake[] = [];

  let correctWordsCount = 0;

  // Walk diff tokens to pair up mistakes and count correct words
  for (let i = 0; i < diffTokens.length; i++) {
    const token = diffTokens[i];

    if (token.type === 'unchanged') {
      correctWordsCount += countFrenchWords(token.value);
    } else if (token.type === 'removed') {
      const expectedWords = token.value.trim().split(/\s+/).filter(Boolean);
      const nextToken = diffTokens[i + 1];

      if (nextToken && nextToken.type === 'added') {
        const userWords = nextToken.value.trim().split(/\s+/).filter(Boolean);
        const maxLen = Math.max(expectedWords.length, userWords.length);

        for (let j = 0; j < maxLen; j++) {
          const exp = expectedWords[j] || '';
          const usr = userWords[j] || '';

          if (exp && usr) {
            const cat = classifyDictationMistake(exp, usr);
            mistakes.push({
              id: `mistake-${mistakes.length + 1}`,
              category: cat,
              expectedWord: exp,
              userWord: usr,
              explanation: getMistakeExplanation(cat, exp, usr),
            });
          } else if (exp) {
            mistakes.push({
              id: `mistake-${mistakes.length + 1}`,
              category: 'lexique',
              expectedWord: exp,
              userWord: '∅ (mot omis)',
              explanation: `Le mot "${exp}" a été omis dans votre transcription.`,
            });
          }
        }
        i++; // skip next added token as it was paired
      } else {
        // Missing words without replacement
        expectedWords.forEach((exp) => {
          mistakes.push({
            id: `mistake-${mistakes.length + 1}`,
            category: 'lexique',
            expectedWord: exp,
            userWord: '∅ (mot omis)',
            explanation: `Le mot "${exp}" a été omis dans votre transcription.`,
          });
        });
      }
    }
  }

  const mistakesCount = mistakes.length;
  const accuracy = Math.max(
    0,
    Math.min(100, Math.round(((totalExpectedWords - mistakesCount) / totalExpectedWords) * 100))
  );

  return {
    accuracy,
    totalExpectedWords,
    correctWordsCount,
    mistakesCount,
    mistakes,
    diffTokens,
    evaluatedAt: Date.now(),
  };
}
