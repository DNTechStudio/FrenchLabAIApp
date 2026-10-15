# Interface Contracts: Dictation Module (002-dictation-module)

## 1. Domain Service Contract: `DictationEngine`

Module location: `src/core/dictation/dictationEngine.js`

### Functions

#### `splitFrenchSentences(text: string): DictationSentence[]`
Splits raw French text into cleaned sentences, preserving French honorifics/abbreviations (`M.`, `Mme.`, `Mlle.`, `Dr.`, `Prof.`, `etc.`).

- **Input**: `text` (string)
- **Output**: Array of `{ index: number, text: string, wordCount: number }`
- **Error Handling**: Returns empty array if input is empty or null.

#### `classifyDictationMistake(expectedWord: string, actualWord: string): DictationMistakeCategory`
Classifies the discrepancy between two words according to French linguistic rules.

- **Returns**: `'homophone'` | `'agreement'` | `'accent'` | `'spelling'` | `'omission'` | `'insertion'`

#### `evaluateDictation(exercise: DictationExercise, transcriptions: Record<number, string>): DictationEvaluation`
Computes complete word-by-word diff, accuracy score, and mistake categorizations.

- **Returns**: `DictationEvaluation` object with overall score, sentence diffs, and pedagogical notes.

---

## 2. Speech Service Contract: `SpeechSynthesizer`

Module location: `src/core/speech/speechSynthesizer.js`

### Methods

#### `speakSentence(text: string, options: { rate?: number, lang?: string, onEnd?: () => void }): void`
Plays spoken French audio using the best available French voice.

#### `stop(): void`
Immediately stops any playing utterance.

#### `isAvailable(): boolean`
Returns true if speech synthesis is supported in the current runtime environment.

---

## 3. UI Controller Contract: `DictationView`

Module location: `src/ui/DictationView.js`

### Constructor
```javascript
new DictationView({ container: '#view-dictation' })
```

### Lifecycle Methods
- `render()`: Mounts or refreshes the view. Checks if a session is in-progress or completed.
- `renderCatalog()`: Renders the CEFR exercise picker and custom text tab.
- `renderSession()`: Renders the active playback toolbar, sentence stepper, transcription area, and accent bar.
- `renderResults(evaluation)`: Renders the score card, visual diff, mistake tags, and retry button.
- `saveDraft()`: Persists the active session state into `localStorage`.
- `loadDraft()`: Restores saved draft if available.
