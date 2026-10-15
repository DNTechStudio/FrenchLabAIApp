# Data Model: 006 — Interactive French Dictation Mode

**Feature**: `006-french-dictation-mode`  
**Date**: 2026-09-25  

---

## 1. Domain Entities & Type Definitions

```typescript
import { CEFRLevel, DiffToken } from './types';

/**
 * Supported dictation playback modes
 */
export type DictationMode = 'sentence' | 'continuous';

/**
 * Classification of French orthographic errors
 */
export type DictationMistakeCategory =
  | 'accords'      // Gender/number agreements, past participles, verb endings
  | 'accents'      // Missing, extra, or wrong diacritics (é, è, ê, à, ç)
  | 'homophones'   // Grammatical homophones (c'est/s'est, a/à, ou/où, ces/ses)
  | 'lexique';     // Omissions, insertions, or arbitrary typos

/**
 * Structured diagnostic note for a specific misspelled word
 */
export interface DictationMistake {
  id: string;
  category: DictationMistakeCategory;
  expectedWord: string;
  userWord: string;
  explanation: string;
}

/**
 * Tokenized sentence for stepwise dictation playback
 */
export interface DictationSentence {
  index: number;
  text: string;
  wordCount: number;
}

/**
 * Result of evaluating a candidate's dictation submission
 */
export interface DictationEvaluation {
  accuracy: number;            // 0 to 100 percentage
  totalExpectedWords: number;
  correctWordsCount: number;
  mistakesCount: number;
  mistakes: DictationMistake[];
  diffTokens: DiffToken[];     // Reuses existing diffEngine tokens for unified highlighting
  evaluatedAt: number;
}

/**
 * In-memory or persisted state of an active dictation session
 */
export interface DictationSession {
  promptId: string;
  targetLevel: CEFRLevel;
  referenceText: string;
  sentences: DictationSentence[];
  currentSentenceIndex: number;
  userInput: string;
  speed: number;               // 0.75 or 1.0
  mode: DictationMode;
  isPlaying: boolean;
  evaluation: DictationEvaluation | null;
}
```

---

## 2. Localization Dictionary Schema Additions

To support multilingual UI (FR, EN, ZH, VI):

```typescript
export interface DictationTranslations {
  tabTitle: string;            // "Mode Dictée" / "Dictation Mode"
  listenButton: string;        // "Écouter"
  pauseButton: string;         // "Pause"
  replayButton: string;        // "Réécouter (Ctrl+Space)"
  nextSentence: string;        // "Phrase suivante"
  prevSentence: string;        // "Phrase précédente"
  sentenceCounter: string;     // "Phrase {current} sur {total}"
  speedLabel: string;          // "Vitesse :"
  evaluateButton: string;      // "Corriger ma dictée"
  accuracyLabel: string;       // "Taux d'exactitude :"
  categories: {
    accords: string;           // "Accords & Grammaire"
    accents: string;           // "Accents & Diacritiques"
    homophones: string;        // "Homophones"
    lexique: string;           // "Lexique & Omissions"
  };
  emptyNotice: string;         // "Veuillez saisir votre texte avant de corriger"
}
```
