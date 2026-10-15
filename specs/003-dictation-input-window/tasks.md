# Tasks: Dictation Sample Text Window & AI Generator (003-dictation-input-window)

**Input**: Design artifacts from `specs/003-dictation-input-window/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`)  
**Status**: Ready for Implementation  

---

## Phase 1: Setup & Styling Foundation

**Purpose**: Add stylesheet rules for the embedded `.dictation-sample-window` card between the top bar and audio deck.

- [x] T001 Update `src/styles/dictation.css` with `.dictation-sample-window` glassmorphic styles, window header, level chip toolbar, text view formatting, in-place edit textarea, and metadata footer

---

## Phase 2: Foundational AI Generator & Services (Complete)

**Purpose**: Core generative engine and calibration tests required by the text window.

- [x] T002 Implement `src/core/dictation/aiTextGenerator.js` with sovereign generative templates across CEFR levels A1, A2, B1, B2 and 6 thematic categories
- [x] T003 Validate text generation calibration and clitic word counting via `node --test tests/french-lab.test.js` (13/13 passing)

---

## Phase 3: User Story 1 - Always-Visible Sample Text Window Display (Priority: P1)

**Goal**: Render the dedicated Sample Text Window card directly below `.dictation-top-bar` and above `.dictation-deck-card`, displaying the current passage being read for dictation.

**Independent Test**: Navigate to `#dictation` -> verify `.dictation-sample-window` card is rendered between the top bar and audio deck with title, passage text, and metadata footer.

### Implementation for User Story 1
- [x] T004 Implement `renderSampleTextWindow()` in `src/ui/DictationView.js` placing the card directly above `.dictation-deck-card`
- [x] T005 Display the current exercise text with quotation styling, theme, word count (`countFrenchWords`), sentence count (`splitFrenchSentences`), and grammar points

---

## Phase 4: User Story 2 - In-Place Copy/Paste & Custom Text Editing (Priority: P1)

**Goal**: Allow users to click `📋 Coller un texte` to edit or paste custom French text directly into the Text Window, immediately synchronizing the dictation audio and transcription deck.

**Independent Test**: Click `📋 Coller un texte` -> paste custom text -> click `✔ Valider` -> verify text displays in window and Audio Deck resets to Phrase 1 with correct sentence count and audio synthesis.

### Implementation for User Story 2
- [x] T006 Add `isWindowEditing` state and toggle handler in `src/ui/DictationView.js`
- [x] T007 Render in-place edit textarea with real-time `countFrenchWords()` and `splitFrenchSentences()` counter, `✔ Valider`, and `Annuler` buttons
- [x] T008 Implement `handleWindowPasteSubmit()` in `src/ui/DictationView.js` to update `this.currentExercise`, re-segment sentences, update audio player, and save to `localStorage` (`frenchlab_custom_dictations`)

---

## Phase 5: User Story 3 - AI Random Topic & Calibrated Generation by Level (Priority: P1)

**Goal**: Allow users to click `✨ Générer IA` or `🎲 Aléatoire` to generate level-calibrated French passages directly into the Text Window.

**Independent Test**: Select level B1 -> click `✨ Générer IA` -> an authentic B1 passage immediately replaces the text window content and synchronizes the audio deck at Phrase 1.

### Implementation for User Story 3
- [x] T009 Add `✨ Générer IA` and `🎲 Aléatoire` buttons to the Text Window toolbar in `src/ui/DictationView.js`
- [x] T010 Wire click events to call `AITextGenerator.generateText({ level: this.currentExercise.level })` and update the active dictation
- [x] T011 Wire `🎲 Aléatoire` to call `AITextGenerator.getRandomTopic()` and populate a surprise topic across categories

---

## Phase 6: User Story 4 - Level Selection Chips in Text Window (Priority: P1)

**Goal**: Add interactive level selector chips (A1, A2, B1, B2) directly inside the Text Window header for 1-click level switching.

**Independent Test**: Click `A2` chip in Text Window -> an A2 passage loads into the Text Window and the audio deck synchronizes immediately.

### Implementation for User Story 4
- [x] T012 Render level selector chips (A1, A2, B1, B2) with active highlight inside the Text Window toolbar
- [x] T013 Bind click events on level chips to switch exercises or generate fresh text for the clicked level

---

## Phase 7: Polish & Automated Verification

**Purpose**: Verify keyboard ergonomics, audio speech synchronization, and run automated test suite.

- [x] T014 Run automated test suite: `node --test tests/french-lab.test.js`
- [x] T015 Verify in local browser at `http://localhost:3000/#dictation` that the Text Window seamlessly coexists with the audio deck and transcription deck without layout bugs
