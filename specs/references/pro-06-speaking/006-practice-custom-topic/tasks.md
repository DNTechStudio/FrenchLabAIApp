# Implementation Tasks: User-Defined Custom Topics in Practice Mode (Mode Entraînement)

**Feature**: `006-practice-custom-topic` | **Branch**: `006-practice-custom-topic`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Setup & Data Helpers

**Purpose**: Create storage helpers and validation logic for custom practice topics.

- [X] T001 Implement `validateCustomPracticePrompt(data)`, `getCustomPracticePrompts()`, `saveCustomPracticePrompt(prompt)`, `deleteCustomPracticePrompt(id)`, `getAllPracticePrompts()`, and `getRandomCombinedPracticePrompt()` in `src/data/practice/customPracticeStorage.js`
- [X] T002 Add CSS styling for inline collapsible practice topic container (`.custom-practice-expandable`, `.custom-practice-expandable.open`), category chips, and form layout in `src/ui/styles/practice.css`

---

## Phase 2: Foundational Unit Tests (TDD)

**Purpose**: Validate storage manipulation, validation thresholds, and prompt merging before UI integration.

> **CRITICAL**: Storage operations must pass unit tests before component integration.

- [X] T003 [P] Unit tests for `validateCustomPracticePrompt`, LocalStorage CRUD, and prompt pool combination in `tests/unit/CustomPracticeStorage.test.js`

---

## Phase 3: User Story 1 & 2 - Inline Form Component (Priority: P1) 🎯 MVP

**Goal**: Build `CustomPracticeTopicForm.js` providing an inline form for specifying custom topic title, thematic domain, reflection description, and suggested starter sentence.

**Independent Test**: Mount form, test input changes and validation error hints on short title (<5) or description (<10); submit valid form and verify callback receives conformant `CustomPracticePrompt`.

### Tests for Component 🧪
- [X] T004 [P] [US2] Unit tests for `CustomPracticeTopicForm` component in `tests/unit/CustomPracticeTopicForm.test.js`

### Implementation
- [X] T005 [P] [US1] [US2] Implement `CustomPracticeTopicForm` component in `src/ui/components/CustomPracticeTopicForm.js` with structured inputs (Title, Category chips, Description, Starter sentence) and Cancel/Apply actions

---

## Phase 4: User Story 3 & 4 - PracticeView Integration & Non-Destructive Update (Priority: P1)

**Goal**: Integrate toggle button and expandable form into `PracticeView.js`, updating the active topic card with a `🎨 Personnalisé` badge without resetting the recording console transcript.

**Independent Test**: In Practice Mode, type some words in the speech console; click `✏️ Sujet personnalisé`, enter a custom subject, and apply; verify active topic card updates to the custom subject with the `🎨 Personnalisé` badge while the console transcript remains intact.

### Implementation
- [X] T006 [US1] Add `✏️ Sujet personnalisé` toggle button to header action bar in `src/ui/views/PracticeView.js`
- [X] T007 [US1] Mount `CustomPracticeTopicForm` in a dedicated slot directly above the active topic card in `src/ui/views/PracticeView.js`
- [X] T008 [US3] Update topic card rendering in `src/ui/views/PracticeView.js` to render the `🎨 Personnalisé` badge when `this.currentTopic.isCustom` is true
- [X] T009 [US3] Connect `CustomPracticeTopicForm.onSubmit` to update `this.currentTopic`, persist session via `this.saveSession()`, and re-render only the topic card DOM node without re-rendering or wiping the recording console
- [X] T010 [US4] Connect `random-prompt-btn` to `getRandomCombinedPracticePrompt()` so custom practice topics rotate into the random selection

---

## Phase 5: User Story 5 - Multilingual Localization (Priority: P2)

**Goal**: Full localization of custom practice topic buttons, form labels, placeholders, and validation messages across French, English, Chinese, and Vietnamese.

- [X] T011 [P] [US5] Add custom practice topic translation keys to French dictionary in `src/core/i18n/locales/fr.js`
- [X] T012 [P] [US5] Add custom practice topic translation keys to English dictionary in `src/core/i18n/locales/en.js`
- [X] T013 [P] [US5] Add custom practice topic translation keys to Chinese dictionary in `src/core/i18n/locales/zh.js`
- [X] T014 [P] [US5] Add custom practice topic translation keys to Vietnamese dictionary in `src/core/i18n/locales/vi.js`

---

## Phase 6: Integration Testing & Verification

**Goal**: End-to-end automated integration testing and browser validation.

- [X] T015 [P] Add integration test in `tests/integration/CustomPracticeTopicFlow.test.js` verifying the complete flow: Custom Practice Topic creation → Session persistence → Transcript preservation → AI Speech Elevation with dual CEFR levels
- [X] T016 Run complete automated test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`) and ensure 100% passing tests
