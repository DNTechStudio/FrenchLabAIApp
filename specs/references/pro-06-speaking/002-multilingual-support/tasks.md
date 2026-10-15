# Implementation Tasks: Multilingual Support (English, Chinese, Vietnamese)

**Feature**: `002-multilingual-support` | **Branch**: `002-multilingual-support`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Localization dictionaries, i18n core structure, and test fixtures.

- [X] T001 Create translation dictionaries directory structure at `src/core/i18n/locales/`
- [X] T002 [P] Create French base reference translation bundle in `src/core/i18n/locales/fr.js`
- [X] T003 [P] Create English translation bundle in `src/core/i18n/locales/en.js`
- [X] T004 [P] Create Chinese (Simplified) translation bundle in `src/core/i18n/locales/zh.js`
- [X] T005 [P] Create Vietnamese translation bundle in `src/core/i18n/locales/vi.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core `I18nManager` engine, event dispatching, and persistence.

> **CRITICAL**: Foundational tasks must complete before user story implementation can proceed.

- [X] T006 Implement `I18nManager` class supporting dot-notation keys, fallback to French, event dispatch, and LocalStorage persistence in `src/core/i18n/I18nManager.js`
- [X] T007 [P] Unit test for `I18nManager` translation resolution, fallback logic, and key parity in `tests/unit/I18nManager.test.js`

**Checkpoint**: Core i18n engine ready - UI language switching can begin.

---

## Phase 3: User Story 1 - Instant UI Language Switcher (Priority: P1) 🎯 MVP

**Goal**: Deliver a header language switcher allowing candidates to toggle between Français, English, 中文, and Tiếng Việt with instant UI updates across navigation, timers, and scratchpad.

**Independent Test**: Switch language from the header picker, verify all visible stepper steps, button texts, timer labels, and scratchpad tabs update immediately and persist across page reloads.

### Tests for User Story 1 🧪
- [X] T008 [P] [US1] Unit test for header language picker event handling and storage persistence in `tests/unit/LanguagePicker.test.js`

### Implementation for User Story 1
- [X] T009 [P] [US1] Implement `LanguagePicker` header dropdown component with flags (🇫🇷, 🇬🇧, 🇨🇳, 🇻🇳) in `src/ui/components/LanguagePicker.js`
- [X] T010 [US1] Integrate `LanguagePicker` and localized stepper labels into `src/app.js` and `index.html`
- [X] T011 [US1] Localize `PreparationView` and `ScratchpadDrawer` section labels with `i18n.t()` in `src/ui/views/PreparationView.js` and `src/ui/components/ScratchpadDrawer.js`
- [X] T012 [US1] Localize `SelectionView` filter tabs, hero text, and random draw button in `src/ui/views/SelectionView.js`
- [X] T013 [US1] Localize `MonologueView` and `DebateView` timer status badges and control buttons in `src/ui/views/MonologueView.js` and `src/ui/views/DebateView.js`

**Checkpoint**: User Story 1 (MVP) is fully functional with instant 4-language UI switching.

---

## Phase 4: User Story 2 - Multilingual Pedagogical Feedback & Diagnostic Explanations (Priority: P2)

**Goal**: Provide translated grammatical explanations, action plans, and B2/C1 connectors in the learner's chosen language on the evaluation report.

**Independent Test**: Complete an exam or trigger evaluation with Vietnamese/English/Chinese active, verify qualitative synthesis and error explanations display in the selected language.

### Tests for User Story 2 🧪
- [X] T014 [P] [US2] Unit test for localized pedagogical error explanations and action plans in `tests/unit/LocalizedEvaluation.test.js`

### Implementation for User Story 2
- [X] T015 [US2] Update `DelfB2EvaluationEngine` to output localized explanations and connector translations in `src/core/evaluation/DelfB2EvaluationEngine.js`
- [X] T016 [US2] Update `ReportView` to render localized pedagogical synthesis and connector cards in `src/ui/views/ReportView.js`

---

## Phase 5: User Story 3 - Bilingual Lexical Guidance for Trigger Documents (Priority: P3)

**Goal**: Provide an optional bilingual glossary of advanced French B2 expressions on trigger document cards.

**Independent Test**: Open a trigger document in the preparation phase, click "Glossaire", verify translations of key idioms match the active language.

### Implementation for User Story 3
- [X] T017 [P] [US3] Add bilingual vocabulary glossaries (EN, ZH, VI) to trigger documents in `src/data/documents/triggerDocuments.js`
- [X] T018 [US3] Add interactive glossary drawer toggle to `src/ui/components/DocumentCard.js`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T019 [P] Verify typography and font rendering for Vietnamese diacritics and Chinese characters in `src/ui/styles/variables.css`
- [X] T020 Run end-to-end validation scenarios documented in `specs/002-multilingual-support/quickstart.md`
