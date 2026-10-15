# Tasks: 006 — Interactive French Dictation Mode (« La Dictée DELF B2 »)

**Input**: Design documents from `specs/006-french-dictation-mode/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`)  
**Prerequisites**: All design documents approved; Constitution Gate Check: PASS  
**Tests**: Automated tests in `tests/run-all-tests.mjs` verifying sentence tokenization, mistake categorization, and accuracy scoring  

---

## Phase 1: Setup & Domain Types

**Purpose**: Core types, localization dictionaries, and service interface definitions required for dictation.

- [x] **T001** `[P]` Define dictation interfaces in `src/domain/types.ts`:
  - `DictationSentence`, `DictationMistakeCategory`, `DictationMistake`, `DictationEvaluation`, `DictationSession`, `DictationMode`.
- [x] **T002** `[P]` Add localization keys in `src/domain/translations.ts` across French (FR), English (EN), Chinese (ZH), and Vietnamese (VI) for all dictation UI labels, buttons, and error badge titles.

---

## Phase 2: User Story 1 & 2 - Audio Engine & Sentence Progression (Priority: P1) 🎯 MVP

**Goal**: Candidates can launch Dictation Mode on the active topic, listen to French speech synthesis sentence-by-sentence, control playback rate, and replay with `Ctrl + Space`.

### Tests for Audio Engine & Sentence Tokenizer
- [x] **T003** `[P]` `[US1]` Add automated test in `tests/run-all-tests.mjs` verifying that `splitFrenchSentences` correctly segments French text while shielding abbreviations (*M. le Maire*, *Mme.*, *etc.*).

### Implementation for Audio Engine & Sentence Progression
- [x] **T004** `[US1]` Implement `splitFrenchSentences(text: string): string[]` in `src/domain/dictationEngine.ts`.
- [x] **T005** `[US1]` Implement `src/services/speechSynthesisService.ts`:
  - French voice resolution (`lang.startsWith('fr')`).
  - Speak, pause, resume, cancel methods with customizable playback rate (`0.75x` and `1.0x`).
  - Event callbacks for utterance end and error handling.
- [x] **T006** `[US2]` Implement global keyboard listener for `Ctrl + Space` to trigger replay of the active sentence without moving focus.

**Checkpoint**: Sentence splitting works cleanly and speech synthesis speaks in French.

---

## Phase 3: User Story 3 - French Linguistic Diff & Error Diagnostics (Priority: P1) 🎯 MVP

**Goal**: Evaluate candidate's typed transcription against reference text, compute accuracy percentage ($0–100\%$), and classify errors into 4 pedagogical French categories.

### Tests for Evaluation Engine
- [x] **T007** `[P]` `[US3]` Add automated unit tests in `tests/run-all-tests.mjs` verifying:
  - Classification of accent errors (*evenement* vs *événement*).
  - Classification of grammatical homophones (*a* vs *à*, *c'est* vs *s'est*).
  - Classification of agreements (*décision* vs *décisions*, *pris* vs *prise*).
  - Accurate calculation of accuracy percentage ($0–100\%$).

### Implementation for Evaluation Engine
- [x] **T008** `[US3]` Implement `classifyDictationMistake(expected: string, user: string): DictationMistakeCategory` in `src/domain/dictationEngine.ts`:
  - Accents check: Unicode normalization (`NFD`).
  - Homophones check: Known French phonetic collision dictionary.
  - Accords check: Suffix inflection differences (`-s`, `-x`, `-e`, `-er`, `-é`, `-ez`, `-aient`).
  - Lexique fallback: Omissions, insertions, and general typos.
- [x] **T009** `[US3]` Implement `evaluateDictation(expectedText: string, userText: string): DictationEvaluation` in `src/domain/dictationEngine.ts`:
  - Compute word diff tokens.
  - Generate itemized list of `DictationMistake`.
  - Calculate `accuracy = Math.max(0, Math.round(((totalExpected - mistakes) / totalExpected) * 100))`.

**Checkpoint**: Core diagnostic engine accurately diagnoses French spelling and agreement errors with high precision.

---

## Phase 4: User Story 1, 2 & 4 - React UI Components (Priority: P1)

**Goal**: Build a distraction-free, fluid dictation workspace in the React application.

- [x] **T010** `[US1]` Create `src/components/DictationPane.tsx`:
  - Header with sentence progress bar (`Phrase X / Y`), speed selector (`0.75x` / `1.0x`), and audio controls (`▶ Écouter`, `⏸ Pause`, `🔁 Réécouter (Ctrl+Space)`).
  - Clean transcription textarea with real-time word counter.
  - Sentence navigation stepper (`◀ Précédent`, `Suivant ▶`).
  - Prominent `🎯 Corriger ma dictée` submission button.
- [x] **T011** `[US3]` Implement the Dictation Results view in `src/components/DictationPane.tsx`:
  - Accuracy score gauge with color coding (Green: $\ge 90\%$, Yellow: $75–89\%$, Red: $< 75\%$).
  - Mistake breakdown pills: 🔴 Accords, 🟡 Accents, 🔵 Homophones, 🟢 Lexique.
  - Interactive diff view showing additions/deletions side-by-side with original sentence.
- [x] **T012** `[US4]` Update `src/components/EditorPane.tsx` and `src/App.tsx`:
  - Add mode toggle button in editor header: **« 📝 Rédaction »** vs **« 🎧 Mode Dictée »**.
  - Dynamically supply reference text (either active prompt's B2 model or selected CEFR model from Feature 005).

---

## Phase 5: User Story 5 - Standalone Distribution Parity (`standalone.html`) (Priority: P1)

**Goal**: 100% feature parity in the single-file offline distribution [`standalone.html`](standalone.html).

- [x] **T013** `[P]` Update `standalone.html`:
  - Embed French sentence tokenizer `splitFrenchSentences` and error classifier `classifyDictationMistake`.
  - Add Dictation mode toggle tab in header / editor panel.
  - Implement Web Speech Synthesis audio controls with rate toggle and `Ctrl + Space` listener.
  - Implement dictation evaluation card with accuracy gauge and French error category pills.
  - Add translations for dictation in `TRANSLATIONS` dictionary (FR, EN, ZH, VI).

---

## Phase 6: Automated Test Suite & Browser Verification (Priority: P1)

**Goal**: Complete end-to-end verification across test runner and real browser environment.

- [x] **T014** Execute complete test suite and verify 100% pass rate:
  ```bash
  node tests/run-all-tests.mjs
  ```
- [x] **T015** Perform browser verification via browser subagent on `http://localhost:8080/standalone.html`:
  - Switch to **« Mode Dictée »**.
  - Test audio playback of sentence 1 in French.
  - Test `Ctrl + Space` replay shortcut.
  - Type sample transcriptions with intentional mistakes (`les decision on ete prise`).
  - Click **« Corriger ma dictée »** and verify that accuracy score and badges (Accents, Homophones, Accords) render cleanly.
