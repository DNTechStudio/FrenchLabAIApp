# Tasks: 100% High-Fidelity UI Alignment for Standalone Dictation Module (002-dictation-module)

**Input**: Design artifacts from `specs/002-dictation-module/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)  
**Status**: All Tasks Implemented & Verified  

---

## Phase 1: Setup & Style Foundation

**Purpose**: Establish theme tokens, layout containers, and stylesheets for the 100% fidelity Mode Dictée design.

- [x] T001 Create `src/styles/dictation.css` with Midnight Indigo / Petrol Teal palette (`rgba(13, 27, 42, 0.95)`), card borders, progress fill bar, and shortcut kbd styling
- [x] T002 [P] Create `src/data/dictations.js` with initial CEFR-graded exercise library (A1 to C2)
- [x] T003 [P] Link `src/styles/dictation.css` inside `<head>` of `index.html`

---

## Phase 2: Foundational Domain & Audio Service

**Purpose**: Core engine and TTS services required by all user stories.

- [x] T004 Implement `src/core/dictation/dictationEngine.js` with `splitFrenchSentences()`, abbreviation protection, clitic word counting, and `stripAccents()`
- [x] T005 Implement French homophone classification and `classifyDictationMistake()` in `src/core/dictation/dictationEngine.js`
- [x] T006 Implement word-by-word diffing and `evaluateDictation()` in `src/core/dictation/dictationEngine.js`
- [x] T007 [P] Implement `src/core/speech/speechSynthesizer.js` with native `window.speechSynthesis` French voice selection and rate controls (`0.75x` vs `1.0x`)
- [x] T008 Add unit tests for `dictationEngine` in `tests/french-lab.test.js` (sentence splitting, homophones, word diff, accuracy scoring)

**Checkpoint**: Core domain engine and unit tests passing 100% headlessly via `node --test tests/french-lab.test.js`.

---

## Phase 3: User Story 1 - 100% Fidelity UI Card & Layout Structure (Priority: P1) 🎯 MVP

**Goal**: Deliver the exact visual hierarchy matching the user's reference screenshot: Master Card, Header, Audio Deck Card, and Tabbed Input.

**Independent Test**: Load Dictation -> verify top header, audio deck with progress bar, previous/play/replay/next controls, tabs, dark textarea, and action buttons match the screenshot.

### Tests for User Story 1
- [x] T009 [US1] Add router navigation unit tests in `tests/french-lab.test.js` verifying `'dictation'` is a recognized view ID

### Implementation for User Story 1
- [x] T010 [US1] Add `<section id="view-dictation" class="workspace-view" aria-label="Module Atelier de Dictée"></section>` into `#main-workspace` in `index.html`
- [x] T011 [US1] Register `dictation: 'view-dictation'` mapping in `src/core/router.js`
- [x] T012 [US1] Add the **« Dictation »** nav item to `src/ui/SidebarView.js` directly below `DELF-DALF Writing`
- [x] T013 [US1] Render top header bar in `src/ui/DictationView.js` with `← Rédaction`, `🎧 Mode Dictée`, `B1` pill, `🎙️ Web Speech`, and speed pills `0.75x` & `1.0x`
- [x] T014 [US1] Wire `DictationView` into `src/app.js` (initialization and router switch event)

**Checkpoint**: Sidebar navigation smoothly loads the master card with exact header components.

---

## Phase 4: User Story 2 - Audio Playback Deck & Keyboard Shortcuts (Priority: P1)

**Goal**: Provide audio controls with linear progress bar, prominent `► Écouter` center button, `🔁 Réécouter`, `◀ Précédent`, `Suivant ▶`, and keyboard shortcuts.

**Independent Test**: Click `► Écouter` (or press `Ctrl+Space`) -> French audio plays -> button displays `⏸ Pause` -> press `Ctrl+Right` -> advances to Phrase 2 -> progress bar fills to 50%.

### Implementation for User Story 2
- [x] T015 [US2] Implement audio deck card (`dictation-deck-card`) with `Phrase X sur Y` and linear progress fill bar in `src/ui/DictationView.js`
- [x] T016 [US2] Implement controls row with `◀ Précédent [Ctrl+←]`, glowing purple center `► Écouter` button, `🔁 Réécouter [Ctrl+Space]`, and centered `Suivant ▶ [Ctrl+→]` in `src/ui/DictationView.js`
- [x] T017 [US2] Connect `speechSynthesizer.js` to play French audio at `0.75x` or `1.0x` speed
- [x] T018 [US2] Implement global keyboard shortcuts (`Ctrl+Space`, `Ctrl+←`, `Ctrl+→`) inside the textarea

**Checkpoint**: Full audio playback and keyboard-driven navigation functional.

---

## Phase 5: User Story 3 - Transcription Area, Accents & Word Counter (Priority: P2)

**Goal**: Provide view mode tabs (`Phrase 1` vs `Texte intégral`), dark inset textarea with exact italic placeholder, accent buttons helper row, live word counter, and `Effacer`.

**Independent Test**: Switch between `Phrase 1` and `Texte intégral` tabs -> type French words -> click accent button -> character inserts at cursor -> word counter updates live -> click `Effacer` -> clears active input.

### Implementation for User Story 3
- [x] T019 [US3] Implement tab buttons (`Phrase X` vs `Texte intégral`) with active indigo styling in `src/ui/DictationView.js`
- [x] T020 [US3] Implement dark inset textarea with exact placeholder in `src/ui/DictationView.js`
- [x] T021 [US3] Implement French diacritic accent buttons row (`é`, `è`, `ê`, `ë`, `à`, `â`, `ù`, `û`, `î`, `ï`, `ô`, `ç`, `œ`, `æ`, `« »`) with caret-insertion logic
- [x] T022 [US3] Implement real-time word counter `Mots transcrits : X (Attendu : ~Y mots)` and `Effacer` action in `src/ui/DictationView.js`

**Checkpoint**: Transcription input area matches screenshot with responsive typing and word counting.

---

## Phase 6: User Story 4 - Evaluation & Linguistic Diagnostics (Priority: P2)

**Goal**: Deterministic correction with word-level diff, homophone and accord error categorization, and pedagogical feedback.

**Independent Test**: Click `🎯 Corriger ma dictée` -> displays overall score %, total words correct, mistake categories (Homophones, Accords), and sentence-by-sentence visual diff (red strikethrough vs green text).

### Tests for User Story 4
- [x] T023 [US4] Add evaluation accuracy and mistake categorization tests in `tests/french-lab.test.js`

### Implementation for User Story 4
- [x] T024 [US4] Implement gradient submission button `🎯 Corriger ma dictée` with disabled state when empty in `src/ui/DictationView.js`
- [x] T025 [US4] Implement Diagnostic Report card with score %, mistake summary badges, and pedagogical feedback in `src/ui/DictationView.js`
- [x] T026 [US4] Implement sentence-by-sentence word diff rendering with color-coded errors and omissions in `src/ui/DictationView.js`
- [x] T027 [US4] Implement `🔄 Recommencer` and `← Rédaction` buttons to return to practice mode

**Checkpoint**: Complete evaluation loop displays detailed French linguistic feedback.

---

## Phase 7: User Story 5 - Persistence & Exercise Catalog (Priority: P3)

**Goal**: Autosave active draft and allow switching between CEFR level exercises (A1 to C2).

**Independent Test**: Type in textarea -> switch module -> return to Dictation -> draft is preserved. Click level badge `B1` or `← Rédaction` -> opens exercise selector modal.

### Implementation for User Story 5
- [x] T028 [US5] Implement draft autosaving to `localStorage` (`frenchlab_active_dictation`) on every input keystroke
- [x] T029 [US5] Implement draft restoration in `src/ui/DictationView.js` upon initialization
- [x] T030 [US5] Implement exercise selection modal when clicking `← Rédaction` or the level badge in `src/ui/DictationView.js`
- [x] T031 [US5] Ensure sovereign persistence integrates with `StorageManager` backup export

**Checkpoint**: Zero data loss across module switches; user can practice across all CEFR levels.

---

## Phase 8: Polish & Verification

**Purpose**: Visual review, responsive testing, and automated test suite validation.

- [x] T032 Verify visual styling against reference screenshot (contrast, padding, shadows, colors)
- [x] T033 Run automated test suite: `node --test tests/french-lab.test.js` (10/10 passing)
- [x] T034 Verify live application on `http://localhost:3000` (200 OK)
