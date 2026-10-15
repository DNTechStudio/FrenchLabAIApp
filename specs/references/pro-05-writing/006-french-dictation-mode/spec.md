# Feature Specification: 006 — Interactive French Dictation Mode (« La Dictée DELF B2 »)

**Feature Branch**: `006-french-dictation-mode`  
**Created**: 2026-09-25  
**Status**: Draft  
**Input**: User request: `"soạn prompt để chạy lệnh specify cho idea 1: La Dictée DELF B2"`  

---

## 1. Overview & Pedagogical Rationale

In the DELF B2 examination, the criterion **« Morphosyntaxe et orthographe »** accounts for a substantial portion of the candidate's score (typically 5 to 6 points out of 25). Candidates frequently lose marks not due to poor ideas, but through silent, persistent orthographic weaknesses:
- **Participle agreements** (*accords du participe passé avec être/avoir*)
- **Subjunctive verb endings** (*que nous fassions, qu'il voie*)
- **Missing or erroneous diacritics / accents** (*événement, tâche vs tache, où vs ou*)
- **Grammatical homophones** (*c'est / s'est / ces / ses*, *a / à*, *on / ont*, *leur / leurs*)

**La Dictée** (listening and writing down dictated French text) is widely recognized as the premier pedagogical exercise in French language acquisition to cultivate hyper-vigilance regarding orthographic precision and morphosyntactic agreements.

This feature introduces an **Interactive French Dictation Mode** (« La Dictée ») into the Writing DELF B2 application:
1. **Audio Synthesis (100% Offline & Free)**: Powered by the browser's native `SpeechSynthesis` Web API with French voice selection (`lang: 'fr-FR'`), requiring no external services, no audio downloads, and no server costs.
2. **Context-Aware Training Content**: Candidates can practice dictation directly on:
   - Official DELF B2 model letters and essays.
   - Any autonomous AI-generated model essay (from Feature 005) across CEFR levels `A1` to `C2` (default `B2`).
3. **Structured Dictation Progression**:
   - **Sentence-by-Sentence Mode** (*Phrase par phrase*): Dictates one sentence at a time with repeat and auto-advance.
   - **Continuous Exam Mode** (*Texte intégral*): Reads the full text with natural pauses.
4. **Instant French Linguistic Diagnostic**: Upon submission, the typed text is evaluated against the reference text using the existing `diffEngine`, scoring overall accuracy (0–100%) and classifying mistakes into 4 pedagogical categories:
   - 🔴 **Accords & Grammaire** (*Grammar & Agreement*)
   - 🟡 **Accents & Diacritiques** (*Diacritics & Accents*)
   - 🔵 **Homophones Grammaticaux** (*Grammatical Homophones*)
   - 🟢 **Lexique & Ponctuation** (*Vocabulary & Punctuation*)

---

## 2. User Scenarios & Acceptance Criteria *(mandatory)*

### User Story 1 - One-Click Dictation Launch on Active Topic / Model Answer (Priority: P1) 🎯 MVP

As a DELF B2 candidate, I want to switch to "Dictée" mode on the active topic or AI-generated model essay, so that I can listen to a spoken version and transcribe it to test my spelling and grammatical reflexes.

**Why this priority**: Core value proposition; creates an immediate active listening-and-writing practice loop.

**Independent Test**: Select any exam prompt or generate an AI model essay, click « Mode Dictée », listen to sentence 1, type it in the dictation input field, and verify audio plays without errors.

**Acceptance Scenarios**:
1. **Given** the candidate is on the workspace, **When** they click the **« 🎧 Mode Dictée »** tab/button, **Then** the interface transitions smoothly into Dictation Mode while preserving the active prompt and reference text.
2. **Given** the candidate is in Dictation Mode, **When** they click **« ▶ Écouter »** (or press `Ctrl + Space`), **Then** the browser plays the first sentence in French (`fr-FR`) using `window.speechSynthesis`.
3. **Given** audio is playing, **When** the candidate clicks **« ⏸ Pause »**, **Then** speech synthesis pauses immediately.
4. **Given** speech synthesis is active, **When** the candidate adjusts the speed toggle (`0.75x` or `1.0x`), **Then** subsequent utterances play at the selected rate.

---

### User Story 2 - Audio Playback Controls & Sentence Navigation (Priority: P1) 🎯 MVP

As a learner, I want clear audio playback controls including replay, next sentence, and speed adjustments, so that I can practice at my own rhythm without losing focus.

**Why this priority**: Listening comprehension and typing speeds vary significantly among candidates. Keyboard ergonomics (`Ctrl + Space`) are essential for fluid transcription.

**Independent Test**: Load dictation mode, press `Ctrl + Space` to replay the current sentence, type the transcribed sentence, click « Suivant » to advance to sentence 2.

**Acceptance Scenarios**:
1. **Given** the candidate is typing in the dictation box, **When** they press `Ctrl + Space`, **Then** the current active sentence replays without resetting the cursor or clearing input text.
2. **Given** Sentence-by-Sentence mode is active, **When** the candidate clicks **« ⏭ Phrase suivante »**, **Then** the index increments, the next sentence audio triggers, and the sentence counter displays `Phrase X / Y`.
3. **Given** the last sentence has been dictated, **When** the candidate completes typing, **Then** a prominent **« 🎯 Corriger ma dictée »** evaluation button is enabled.

---

### User Story 3 - French Linguistic Diff & Error Diagnostics (Priority: P1) 🎯 MVP

As an exam candidate, when I finish transcribing the dictation, I want immediate visual feedback showing my errors categorized by French linguistic rules (accents, agreements, homophones), so that I know exactly where I lose marks.

**Why this priority**: Raw diffs (red/green) alone are insufficient for pedagogical growth; candidates must understand *why* a word was misspelled according to DELF scoring rubrics.

**Independent Test**: Dictate a sentence containing `"les décisions ont été prises"` and type `"les decision on ete prise"`. Submit dictation; verify the report highlights:
- `decision ➔ décision` as an Accent error.
- `on ➔ ont` as a Homophone error.
- `ete ➔ été` as an Accent error.
- `prise ➔ prises` as an Accord/Grammar error.

**Acceptance Scenarios**:
1. **Given** the candidate clicks « Corriger ma dictée », **Then** the system computes the word-level diff against the reference text and displays an **Accuracy Score** (Taux d'exactitude: `0%` to `100%`).
2. **Given** discrepancies exist, **Then** errors are categorized into 4 distinct badge types:
   - 🔴 **Accords & Grammaire**: mismatch in plural `-s`/`-x`, feminine `-e`, past participle agreement, or verb conjugation.
   - 🟡 **Accents & Diacritiques**: exact letter match ignoring diacritics (`e` vs `é/è/ê`, `c` vs `ç`, `a` vs `à`).
   - 🔵 **Homophones Grammaticaux**: confusion between known French homophone pairs (`c'est/s'est`, `a/à`, `ou/où`, `ces/ses`, `ce/se`, `on/ont`, `leur/leurs`).
   - 🟢 **Lexique & Ponctuation**: omitted words, inserted words, or lexical typos.
3. **Given** the evaluation view is rendered, **Then** the candidate can toggle between viewing the full comparative diff and an itemized breakdown of errors with pedagogical advice.

---

### User Story 4 - Multi-CEFR Level Dictation Support (Priority: P2)

As an A2 or B1 learner aspiring to reach B2, I want to practice dictation on simpler texts (A1–B1) or advanced texts (B2–C1), so that I can gradually build up my transcription stamina.

**Why this priority**: Leverages the multi-level CEFR model generation from Feature 004 & 005.

**Acceptance Scenarios**:
1. **Given** the candidate selects a CEFR level tab (e.g. `B1` or `B2`), **When** dictation mode opens, **Then** the reference text automatically matches the model text for that selected level.
2. **Given** an A2 text is chosen, **Then** sentence lengths and sentence count are shorter and calibrated for elementary learners.

---

### User Story 5 - Standalone Distribution Parity (`standalone.html`) (Priority: P1)

As a user running the offline single-file `standalone.html`, I want the full dictation feature to work completely offline with identical UI, speech synthesis, and error categorization.

**Why this priority**: Adheres strictly to Constitution Principle V and the zero-dependency architecture.

**Acceptance Scenarios**:
1. **Given** `standalone.html` loaded in Chrome or Edge without internet connection, **When** the user clicks « Mode Dictée », **Then** speech synthesis speaks using local browser voices and diff evaluation runs 100% locally.

---

## 3. Edge Cases & Boundary Conditions

1. **Browser Speech Synthesis Unsupported or Permission Blocked**:
   - *Behavior*: Check `'speechSynthesis' in window`. If unavailable, display a friendly notice: *"La synthèse vocale n'est pas disponible sur ce navigateur. Veuillez utiliser Google Chrome, Microsoft Edge ou Safari."*
2. **Voices Not Yet Loaded on Initial Page Render**:
   - *Behavior*: `speechSynthesis.getVoices()` is asynchronous in Chromium. Bind to `speechSynthesis.onvoiceschanged` and select the first voice with `lang.startsWith('fr')`. Fallback to default voice with `lang = 'fr-FR'`.
3. **Empty Dictation Submission**:
   - *Behavior*: If candidate submits with 0 words typed, display prompt: *"Veuillez saisir votre transcription avant de lancer la correction."* Accuracy = 0%.
4. **Punctuation & Case Differences**:
   - *Behavior*: Capital letters at the start of sentences are gently marked as minor capitalization notes, not counted as total word misses. Standard punctuation marks (`.`, `,`, `?`, `!`, `:`) are stripped when evaluating root word accuracy.
5. **Speech Interruption on Tab Switch / Unmount**:
   - *Behavior*: When switching tabs, prompts, or exiting Dictation Mode, immediately call `window.speechSynthesis.cancel()` to prevent lingering background audio.

---

## 4. Requirements Checklist

- [x] **FR-001**: Implement browser-native Web Speech Synthesis with French voice fallback (`fr-FR`).
- [x] **FR-002**: Sentence tokenizer for French text supporting standard abbreviations (*M.*, *Mme.*, *etc.*) without incorrect splits.
- [x] **FR-003**: Dedicated Dictation workspace pane with audio controls (`Play`, `Pause`, `Replay`, `Speed: 0.75x / 1.0x`).
- [x] **FR-004**: Keyboard shortcut: `Ctrl + Space` to replay active sentence.
- [x] **FR-005**: Word-level evaluation engine comparing user input to reference sentence/text.
- [x] **FR-006**: French-specific error classifier (Accords, Accents, Homophones, Lexique).
- [x] **FR-007**: Accuracy calculation formula: $\text{Accuracy} = \max\left(0, \frac{\text{Correct Words} - \text{Errors}}{\text{Total Words}}\right) \times 100\%$.
- [x] **FR-008**: 100% parity in `standalone.html`.
- [x] **FR-009**: Automated unit tests in `tests/run-all-tests.mjs`.
