# Research & Technical Decisions: Standalone Dictation Module (002-dictation-module)

## 1. Architectural Strategy: Dedicated Native Vanilla JS View vs. IFrame

### Decision
Implement the new `DictationView` as a **native Vanilla JS / ESM component** (`src/ui/DictationView.js`), adhering directly to the architectural pattern of `ConversationView.js` and `DebateView.js`.

### Rationale
- **Performance & Responsiveness**: Native DOM rendering has 0ms iframe overhead, eliminates cross-frame postMessage latency, and ensures crisp visual synchronization with the Petrol Teal design system.
- **Constitutional Alignment**: Aligns with Constitution Principle V (*Pure Vanilla Architecture: ESM + Vanilla CSS*).
- **Code Reuse**: Directly ports and adapts the robust, tested dictation domain logic (`splitFrenchSentences`, `classifyDictationMistake`, `evaluateDictation`) from `src/modules/writing/domain/dictationEngine.ts` into a clean, reusable ESM module `src/core/dictation/dictationEngine.js`.

### Alternatives Considered
- *Reusing the Writing standalone iframe via query param (e.g. `standalone.html?mode=dictation`)*:
  - Rejected: The writing standalone bundle is 131KB and contains the full DELF B2 essay editor, diff viewer, and rubrics. Running it inside a dedicated Dictation tab creates tight coupling and restricts expansion to other CEFR levels (A1, A2, B1, C1, C2) and custom texts.

---

## 2. French Speech Synthesis (TTS): Offline vs. Cloud Neural

### Decision
Implement a **dual-mode audio service** (`src/core/speech/speechSynthesizer.js`):
1. **Primary / Offline Default**: Native Browser `window.speechSynthesis` with auto-selection of high-quality French voices (`fr-FR`, `fr-CA`, `Google français`, `Thomas`, `Amélie`, `Audrey`).
2. **Enhanced / Optional Cloud Neural**: Compatibility hook for Google Cloud Text-to-Speech (`fr-FR-Neural2-A`, `fr-FR-Neural2-B`, `fr-FR-Wavenet-C`) when an API key is provided in settings.
3. **Headless Audio Mocking**: Synthetic mock audio interface for automated headless testing (`node --test`), complying with Constitution Principle III.

### Rationale
- Zero-friction instant playback without requiring external internet or API keys for 95% of users.
- Candidate receives immediate audio playback on any modern desktop/mobile browser.

### Alternatives Considered
- *Requiring Cloud Neural TTS only*:
  - Rejected: Violates Principle IV (Offline & Standalone Operation with zero external backend dependencies).

---

## 3. French Diacritics & Ergonomics

### Decision
Provide an on-screen **French Character Bar** (`diacritic-toolbar`) directly above the active transcription input:
- Diacritics: `é`, `è`, `ê`, `ë`, `à`, `â`, `ù`, `û`, `î`, `ï`, `ô`, `ç`, `œ`, `æ`, `« »`
- Keyboard shortcuts: Arrow navigation (Ctrl+Left / Ctrl+Right for previous/next sentence), Space/Ctrl+Enter for play/replay sentence.

### Rationale
- Candidates around the world often do not have a French physical AZERTY keyboard. Missing an accent (e.g. *tâche* vs *tache*, *pêche* vs *peche*, *où* vs *ou*) results in orthographic point deductions.
- On-screen one-click insertion keeps typing fluid and accessible on QWERTY keyboards and mobile touchscreens.

---

## 4. CEFR Graded Library & Sentence Segmentation

### Decision
Create a pre-loaded catalog of curated French dictations across all 6 CECRL levels in `src/data/dictations.js`:
- **A1**: Everyday life (Greetings, numbers, dates, family - 20–35 words)
- **A2**: Short narratives, directions, simple past (Passé composé vs Imparfait - 40–60 words)
- **B1**: Travel, personal opinions, work situations, Subjonctif basics (70–100 words)
- **B2**: Formal correspondence, social debates, nuance, passive voice (110–160 words)
- **C1/C2**: Literary excerpts (Proust, Hugo, Camus), sophisticated vocabulary, rare agreements (180–250 words)
- **Mode « Texte Personnalisé »**: Users can paste any custom French text; the engine automatically executes `splitFrenchSentences()` and creates an instant interactive dictation.

### Rationale
- Matches the user requirement for full CEFR range and gives immediate value upon opening the module.
