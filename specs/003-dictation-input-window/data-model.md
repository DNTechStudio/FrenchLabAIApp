# Data Model: Dictation User Input Window & AI Generator (003-dictation-input-window)

## 1. Entities & Data Structures

### 1.1 CustomDictationInput
Represents a user-pasted or AI-generated custom French dictation.

```typescript
interface CustomDictationInput {
  id: string;                      // e.g. 'custom-1718290000000'
  title: string;                   // User or AI-generated title
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;                // e.g. 'Personnalisé', 'Écologie', 'Société'
  fullText: string;                // Complete French passage
  source: 'copy-paste' | 'ai-generated';
  wordCount: number;               // Live French clitic word count
  sentenceCount: number;           // Count of segmented sentences
  createdAt: string;               // ISO-8601 timestamp
}
```

### 1.2 AIGeneratorRequest & Result
Parameters and output for the AI random text generator.

```typescript
interface AIGeneratorRequest {
  level: 'A1' | 'A2' | 'B1' | 'B2';
  topicCategory?: string;          // Optional specific theme or 'random'
  targetWordRange?: [number, number];
}

interface AIGeneratorResult {
  title: string;
  topic: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  category: string;
  fullText: string;
  keyGrammarPoints: string[];      // e.g. ['Passé composé', 'Accords pluriel', 'Homophones a/à']
}
```

---

## 2. Storage Schema (`localStorage`)

### Key: `frenchlab_custom_dictations`
An array of `CustomDictationInput` objects (stored as JSON string).
- Maximally retains the last 50 custom exercises.
- Accessible across browser sessions and included in `StorageManager.exportBackupJSON()`.
