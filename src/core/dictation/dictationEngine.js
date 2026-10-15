/**
 * French Dictation Engine (002-dictation-module)
 * Sentence segmentation, clitic word counting, French homophone clusters,
 * word-by-word diffing, and deterministic error classification.
 */

import { countFrenchWords } from '../writing/wordCounter.js';

// Comprehensive French Grammatical Homophone Clusters
export const FRENCH_HOMOPHONE_CLUSTERS = [
  ["c'est", "s'est", 'ces', 'ses', 'sais', 'sait'],
  ['a', 'à'],
  ['ou', 'où'],
  ['on', 'ont'],
  ['son', 'sont'],
  ['ce', 'se'],
  ['leur', 'leurs'],
  ['tout', 'tous', 'toute', 'toutes'],
  ['la', 'là', "l'a", "l'as"],
  ['peu', 'peut', 'peux'],
  ['près', 'prêt', 'prêts'],
  ['mes', 'mais', 'met', 'mets'],
  ['dans', "d'en", 'dent', 'dents'],
  ['sans', "s'en", 'cent', 'cents', 'sang'],
  ['du', 'dû'],
  ['sur', 'sûr', 'sûrs'],
  ['ni', 'n\'y', 'nid']
];

/**
 * Strips diacritics / accents from a string for base character comparison.
 */
export function stripAccents(str) {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalizes punctuation and trims word for linguistic token comparison.
 */
export function cleanWord(str) {
  if (!str) return '';
  return str
    .replace(/^[\s.,;:!?"'«»()—–-]+|[\s.,;:!?"'«»()—–-]+$/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Segments raw French text into cleaned sentences, shielding French honorifics & abbreviations.
 */
export function splitFrenchSentences(text) {
  if (!text || !text.trim()) return [];

  // Shield abbreviations with temporary tokens
  const protectedText = text
    .replace(/\bM\.\s+/g, 'M_DOT_SPACE_')
    .replace(/\bMme\.\s+/g, 'MME_DOT_SPACE_')
    .replace(/\bMlle\.\s+/g, 'MLLE_DOT_SPACE_')
    .replace(/\betc\.\s*(?=[,a-zà-ÿ])/gi, 'ETC_DOT_SPACE_')
    .replace(/\bDr\.\s+/g, 'DR_DOT_SPACE_')
    .replace(/\bProf\.\s+/g, 'PROF_DOT_SPACE_')
    .replace(/\n+/g, ' BREAK_PARAGRAPH_ ');

  // Split on sentence-ending punctuation (. ! ?) followed by space or uppercase
  const rawSentences = protectedText.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ÿ0-9«"–—]|BREAK_PARAGRAPH_|$)/);
  const sentences = [];

  rawSentences.forEach((raw) => {
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
        wordCount: countFrenchWords(cleaned)
      });
    }
  });

  return sentences;
}

/**
 * Checks if two words belong to the same grammatical homophone cluster.
 */
export function isHomophone(word1, word2) {
  const c1 = cleanWord(word1);
  const c2 = cleanWord(word2);
  if (c1 === c2) return false;

  return FRENCH_HOMOPHONE_CLUSTERS.some(cluster =>
    cluster.includes(c1) && cluster.includes(c2)
  );
}

/**
 * Classifies the difference between an expected French word and candidate word.
 */
export function classifyDictationMistake(expected, actual) {
  if (!actual || !actual.trim()) {
    return {
      category: 'omission',
      label: 'Mot manquant',
      explanation: `Le mot attendu « ${expected} » a été omis.`
    };
  }

  if (!expected || !expected.trim()) {
    return {
      category: 'insertion',
      label: 'Mot superflu',
      explanation: `Le mot « ${actual} » a été ajouté par erreur.`
    };
  }

  const expClean = cleanWord(expected);
  const actClean = cleanWord(actual);

  if (expClean === actClean) {
    // Exact or punctuation difference only
    return null;
  }

  // 1. Homophone Grammatical
  if (isHomophone(expected, actual)) {
    return {
      category: 'homophone',
      label: 'Homophone grammatical',
      explanation: `Confusion fréquente entre homophones : « ${expected} » vs « ${actual} » (vérifiez la classe grammaticale).`
    };
  }

  // 2. Accents / Diacritiques (stripAccents matches)
  if (stripAccents(expClean) === stripAccents(actClean)) {
    return {
      category: 'accent',
      label: 'Accents & Cédilles',
      explanation: `Erreur d'accentuation ou de cédille sur « ${expected} » (écrit « ${actual} »).`
    };
  }

  // 3. Accords en genre / nombre (plural -s, -x, feminine -e, -ée, -és, -ées)
  const isAgreementVariant =
    actClean === expClean + 's' || expClean === actClean + 's' ||
    actClean === expClean + 'e' || expClean === actClean + 'e' ||
    actClean === expClean + 'es' || expClean === actClean + 'es' ||
    actClean === expClean + 'x' || expClean === actClean + 'x' ||
    (expClean.endsWith('é') && (actClean === expClean + 'e' || actClean === expClean + 's' || actClean === expClean + 'es')) ||
    (actClean.endsWith('é') && (expClean === actClean + 'e' || expClean === actClean + 's' || expClean === actClean + 'es'));

  if (isAgreementVariant) {
    return {
      category: 'agreement',
      label: 'Accord genre / nombre',
      explanation: `Défaut d'accord grammatical en genre ou en nombre : attendu « ${expected} », saisi « ${actual} ».`
    };
  }

  // 4. Lexical Spelling
  return {
    category: 'spelling',
    label: 'Orthographe lexicale',
    explanation: `Graphie inexacte : attendu « ${expected} », saisi « ${actual} ».`
  };
}

/**
 * Computes word-level diff between expected sentence and user transcription.
 */
export function computeSentenceDiff(expectedText, actualText) {
  const expWords = (expectedText || '').trim().split(/\s+/).filter(Boolean);
  const actWords = (actualText || '').trim().split(/\s+/).filter(Boolean);

  const tokens = [];
  const mistakes = [];
  let correctCount = 0;

  const maxLen = Math.max(expWords.length, actWords.length);

  for (let i = 0; i < maxLen; i++) {
    const exp = expWords[i] || '';
    const act = actWords[i] || '';

    if (exp && act && cleanWord(exp) === cleanWord(act)) {
      tokens.push({ type: 'equal', word: exp });
      correctCount++;
    } else if (exp && act) {
      const mistake = classifyDictationMistake(exp, act);
      tokens.push({
        type: 'replace',
        actual: act,
        expected: exp,
        mistake
      });
      if (mistake) mistakes.push(mistake);
    } else if (exp && !act) {
      const mistake = classifyDictationMistake(exp, '');
      tokens.push({
        type: 'missing',
        expected: exp,
        mistake
      });
      if (mistake) mistakes.push(mistake);
    } else if (!exp && act) {
      const mistake = classifyDictationMistake('', act);
      tokens.push({
        type: 'insertion',
        actual: act,
        mistake
      });
      if (mistake) mistakes.push(mistake);
    }
  }

  const accuracy = expWords.length > 0
    ? Math.max(0, Math.round((correctCount / expWords.length) * 100))
    : 0;

  return {
    expectedText,
    actualText,
    accuracy,
    tokens,
    mistakes,
    wordsExpected: expWords.length,
    wordsCorrect: correctCount
  };
}

/**
 * Evaluates full dictation across all sentences.
 */
export function evaluateDictation(exercise, transcriptions = {}) {
  // Normalize sentences to always be an array of { index, text, wordCount }
  let rawSentences = [];
  if (exercise.sentences && exercise.sentences.length > 0) {
    rawSentences = exercise.sentences;
  } else if (exercise.fullText) {
    rawSentences = splitFrenchSentences(exercise.fullText);
  }

  const sentences = rawSentences.map((sent, idx) => {
    if (typeof sent === 'string') {
      return {
        index: idx + 1,
        text: sent,
        wordCount: countFrenchWords(sent)
      };
    }
    return {
      index: sent.index !== undefined ? sent.index : idx + 1,
      text: sent.text || '',
      wordCount: sent.wordCount || countFrenchWords(sent.text || '')
    };
  });

  let totalExpected = 0;
  let totalCorrect = 0;
  const sentenceResults = [];
  const mistakeSummary = {
    homophone: 0,
    agreement: 0,
    accent: 0,
    spelling: 0,
    omission: 0,
    insertion: 0
  };

  sentences.forEach((sent) => {
    const userText = transcriptions[sent.index] || '';
    const diff = computeSentenceDiff(sent.text, userText);

    totalExpected += diff.wordsExpected;
    totalCorrect += diff.wordsCorrect;
    sentenceResults.push(diff);

    diff.mistakes.forEach((m) => {
      if (m && mistakeSummary[m.category] !== undefined) {
        mistakeSummary[m.category]++;
      }
    });
  });

  const overallAccuracy = totalExpected > 0
    ? Math.max(0, Math.round((totalCorrect / totalExpected) * 100))
    : 0;

  // Pedagogical CEFR Assessment
  let cefrFeedback = '';
  if (overallAccuracy >= 95) {
    cefrFeedback = 'Excellente maîtrise orthographique (Niveau C1 - C2). Les accords complexes et homophones sont parfaitement intégrés.';
  } else if (overallAccuracy >= 80) {
    cefrFeedback = 'Très bonne performance (Niveau B2 solide). Les structures clés sont comprises ; veillez aux accords secondaires et accents.';
  } else if (overallAccuracy >= 65) {
    cefrFeedback = 'Niveau B1 acquis. Des confusions subsistent sur certains homophones grammaticaux et terminaisons verbales.';
  } else {
    cefrFeedback = 'Entraînement recommandé (A2 - B1). Concentrez-vous sur les règles fondamentales des homophones et du pluriel.';
  }

  return {
    exerciseId: exercise.id,
    timestamp: new Date().toISOString(),
    overallAccuracy,
    totalExpected,
    totalCorrect,
    sentenceResults,
    mistakeSummary,
    cefrFeedback
  };
}
