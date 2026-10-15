# Implementation Tasks: User-Defined Custom Topics in Test Simulation Mode

**Feature**: `005-custom-topic-input` | **Branch**: `005-custom-topic-input`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Setup & Data Helpers

**Purpose**: Create custom topic data storage module, French word counter, and validation logic.

- [X] T001 Implement `countFrenchWords(text)`, `validateCustomTopic(data)`, and LocalStorage operations (`getCustomTopics`, `saveCustomTopic`, `deleteCustomTopic`) in `src/data/documents/customTopicsStorage.js`
- [X] T002 Add CSS styling for inline collapsible form container (`.custom-topic-expandable`, `.custom-topic-expandable.open`), word counter badge tiers, and responsive form grid in `src/ui/styles/views.css`

---

## Phase 2: Foundational Unit Tests (TDD)

**Purpose**: Validate storage manipulation, token counting edge cases, and validation thresholds before UI integration.

> **CRITICAL**: Storage and word count utilities must pass unit tests before UI wiring.

- [X] T003 [P] Unit tests for `countFrenchWords`, validation rules (min 5 title chars, min 30 words), and LocalStorage CRUD in `tests/unit/CustomTopicsStorage.test.js`

---

## Phase 3: User Story 1 & 2 - Inline Expandable Form Component (Priority: P1) 🎯 MVP

**Goal**: Build `CustomTopicForm.js` providing an inline animated form with real-time word counting and topic submission.

**Independent Test**: Mount form, type content and observe word counter change dynamically from red (<30) to green (140-270); submit with valid inputs and confirm callback receives conformant `CustomTriggerDocument`.

### Tests for Component 🧪
- [X] T004 [P] [US2] Unit tests for `CustomTopicForm` component (field validation, word count badge styling, submission callback) in `tests/unit/CustomTopicForm.test.js`

### Implementation
- [X] T005 [P] [US1] [US2] Implement `CustomTopicForm` component in `src/ui/components/CustomTopicForm.js` with structured inputs (Title, Category chips, Source, Textarea, Problématique), dynamic word count indicator, and Cancel/Submit buttons

---

## Phase 4: User Story 3 & 4 - SelectionView Integration & Custom Library Tab (Priority: P1)

**Goal**: Integrate toggle button and expandable form into `SelectionView.js`, enabling candidates to start the exam immediately or filter custom topics under "✏️ Mes Sujets".

**Independent Test**: Click `✏️ Sujet personnalisé` in Test Mode; create a custom document; click start exam and verify immediate transition to Preparation Phase with the custom document loaded.

### Implementation
- [X] T006 [US1] Add `✏️ Sujet personnalisé` toggle button to the Hero section of `src/ui/views/SelectionView.js`
- [X] T007 [US1] [US3] Mount `CustomTopicForm` directly above the catalog grid with smooth toggle animation in `src/ui/views/SelectionView.js`
- [X] T008 [US4] Add dynamic `✏️ Mes Sujets` category filter tab in `src/ui/views/SelectionView.js` when user-created topics exist in `localStorage`
- [X] T009 [US3] Connect `CustomTopicForm.onSubmit` to `saveCustomTopic()` and invoke `this.onSelectDocument(customDoc)` to launch preparation phase

---

## Phase 5: Pedagogical Alignment - DocumentCard Badging & Debate Context (Priority: P2)

**Goal**: Distinguish custom documents with `🎨 Personnalisé` badges and inject custom problématique/thematics into examiner counter-questions.

- [X] T010 [US3] Update `src/ui/components/DocumentCard.js` to render a distinctive `🎨 Personnalisé` badge and a quick delete button for custom user topics
- [X] T011 [US3] Enhance `src/core/evaluation/DebateEngine.js` to weave `triggerDocument.problematique` and custom topic titles into the examiner's Turn 1 questioning

---

## Phase 6: User Story 5 - Multilingual Localization (Priority: P2)

**Goal**: Full localization of custom topic buttons, form labels, placeholders, and validation messages across French, English, Chinese, and Vietnamese.

- [X] T012 [P] [US5] Add custom topic translation keys to French dictionary in `src/core/i18n/locales/fr.js`
- [X] T013 [P] [US5] Add custom topic translation keys to English dictionary in `src/core/i18n/locales/en.js`
- [X] T014 [P] [US5] Add custom topic translation keys to Chinese dictionary in `src/core/i18n/locales/zh.js`
- [X] T015 [P] [US5] Add custom topic translation keys to Vietnamese dictionary in `src/core/i18n/locales/vi.js`

---

## Phase 7: Integration Testing & Verification

**Goal**: Verify end-to-end exam simulation flow with a user-defined custom topic.

- [X] T016 [P] Add integration test in `tests/integration/CustomTopicExamFlow.test.js` verifying complete progression: Custom Topic Creation → PrepView → MonologueView → DebateView (with contextual counter-question) → EvaluationView
- [X] T017 Run full automated test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`) ensuring 100% test pass rate
