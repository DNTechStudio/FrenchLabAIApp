# Data Model: Standalone French Dictation Lab Module (002-dictation-module)

## 1. Entities & Data Structures

### 1.1 DictationExercise
Represents a curated or custom French dictation exercise.

```typescript
interface DictationExercise {
  id: string;                      // Unique slug (e.g. 'delf-b2-tele-travail', 'custom-text-1')
  title: string;                   // Human readable title (e.g. 'L\'essor du télétravail en France')
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: 'DELF-DALF' | 'Vie Quotidienne' | 'Littérature' | 'Culture & Société' | 'Personnalisé';
  description: string;             // Short context / pedagogical aim
  fullText: string;                // Complete reference French text
  sentences: DictationSentence[];  // Segmented sentences with metadata
  author?: string;                 // Source or author attribution
  audioUrl?: string;               // Optional pre-recorded audio file (fallback to TTS)
  isCustom?: boolean;              // True if user-provided
}
```

### 1.2 DictationSentence
Represents a single segment within the dictation.

```typescript
interface DictationSentence {
  index: number;                   // 1-based index (1, 2, 3...)
  text: string;                    // Normalized French sentence text
  wordCount: number;               // Word count according to French clitic rules
  audioStartMs?: number;           // Timestamp offset if using single audio stream
  audioDurationMs?: number;        // Duration in milliseconds
}
```

### 1.3 DictationSessionState
Maintains the active in-progress attempt in memory and local storage.

```typescript
interface DictationSessionState {
  exerciseId: string;              // Reference to current DictationExercise
  activeSentenceIndex: number;     // 1-based index of currently focused sentence
  transcriptions: Record<number, string>; // Map of sentence index -> candidate's text
  speed: 1.0 | 0.8;                // Audio playback rate (Normal vs Slow)
  status: 'in-progress' | 'completed';
  lastUpdated: string;             // ISO-8601 timestamp
}
```

### 1.4 DictationEvaluation
Evaluation result generated after candidate submits transcription.

```typescript
interface DictationEvaluation {
  id: string;                      // Attempt ID
  exerciseId: string;
  timestamp: string;               // ISO-8601
  overallAccuracy: number;         // 0 - 100 percentage
  totalWordsExpected: number;
  totalWordsTranscribed: number;
  correctWordsCount: number;
  sentenceEvaluations: SentenceEvaluation[];
  mistakeSummary: Record<DictationMistakeCategory, number>;
  cefrFeedback: string;            // Pedagogical comment tailored to CEFR
}

interface SentenceEvaluation {
  sentenceIndex: number;
  expectedText: string;
  actualText: string;
  accuracy: number;                // 0 - 100
  diffTokens: DiffToken[];         // Word-level diff with operations: 'equal' | 'insert' | 'delete' | 'replace'
  mistakes: DictationMistake[];
}
```

### 1.5 DictationMistake & Categories
Linguistic classification of orthographic discrepancies.

```typescript
type DictationMistakeCategory =
  | 'homophone'                    // c'est / s'est, a / à, on / ont, etc.
  | 'agreement'                    // Accord en genre/nombre, participe passé
  | 'accent'                       // Diacritiques manquants ou erronés (é, è, ê, ç...)
  | 'spelling'                     // Erreur orthographique lexicale
  | 'omission'                     // Mot omis
  | 'insertion';                   // Mot ajouté par erreur

interface DictationMistake {
  sentenceIndex: number;
  wordIndex: number;
  expectedWord: string;
  actualWord: string;
  category: DictationMistakeCategory;
  explanation: string;             // Pedagogical rule explanation
}
```

---

## 2. Storage Schema (`localStorage`)

### Keys
- `frenchlab_active_dictation`: JSON string of `DictationSessionState` (preserves current draft across module navigation or browser refresh).
- `frenchlab_dictation_history`: JSON array of `DictationEvaluation` summaries (up to 50 most recent sessions for review & progress tracking).
- `frenchlab_custom_dictations`: JSON array of user-created `DictationExercise` records.
