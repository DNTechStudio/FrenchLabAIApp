# Implementation Tasks: Practice Mode with Dual-Level AI Speech Elevation

**Feature**: `003-practice-mode-ai-improvement` | **Branch**: `003-practice-mode-ai-improvement`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Setup & Data Fixtures

**Purpose**: Establish practice prompt collections, CSS styling tokens, and domain type constants.

- [X] T001 Create curated practice prompts repository covering 5 core French thematic domains (Travail, Écologie, Éducation, Société, Technologies) in `src/data/practice/practicePrompts.js`
- [X] T002 Create practice stylesheet with responsive grid layouts, glassmorphic comparison cards, and interactive level pills in `src/ui/styles/practice.css`
- [X] T003 Link `src/ui/styles/practice.css` in `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core CEFR linguistic descriptors and the deterministic AI Speech Elevation Engine.

> **CRITICAL**: Foundational tasks must complete before user story UI implementation can proceed.

- [X] T004 Implement CEFR linguistic levels matrix (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`) with syntactic rules, connectors, and lexical substitution tables in `src/core/practice/CefrLevelDefinitions.js`
- [X] T005 [P] Unit test for CEFR definitions and substitution dictionaries in `tests/unit/CefrLevelDefinitions.test.js`
- [X] T006 Implement `PracticeElevationEngine` supporting dual CEFR target elevation, connector enhancements, and multilingual commentary in `src/core/practice/PracticeElevationEngine.js`
- [X] T007 [P] Unit test for `PracticeElevationEngine` validating level-specific transformations (e.g. A1->B1, B1->B2, B2->C1, B2->C2) in `tests/unit/PracticeElevationEngine.test.js`

**Checkpoint**: Core elevation engine verified against contract — UI component integration can begin.

---

## Phase 3: User Story 1 - Global Mode Switcher (Priority: P1) 🎯 MVP

**Goal**: Seamless header toggle between Test Mode (Mode Examen) and Practice Mode (Mode Entraînement) with non-destructive session persistence.

**Independent Test**: Click between "Mode Examen" and "Mode Entraînement" in the header; verify that the active view and stepper switch immediately while preserving prior exam progress.

### Tests for User Story 1 🧪
- [X] T008 [P] [US1] Unit test for `ModeSwitcher` component state transitions and local storage persistence in `tests/unit/ModeSwitcher.test.js`

### Implementation for User Story 1
- [X] T009 [P] [US1] Implement `ModeSwitcher` segmented control component in `src/ui/components/ModeSwitcher.js`
- [X] T010 [US1] Mount `ModeSwitcher` into `index.html` header and wire mode routing in `src/app.js`

---

## Phase 4: User Story 2 & 3 - Spontaneous Speech Console & Dual CEFR Level Picker (Priority: P1) 🎯 MVP

**Goal**: Provide a recording console with real-time French speech-to-text, transcript editor, and interactive selector enforcing **exactly 2 CEFR levels** from A1–C2.

**Independent Test**: Record speech (or input text), verify transcript buffer; select 1 level (verify "Improve" button disabled), select 2 levels (verify active state), select a 3rd (verify limit of 2 enforced).

### Tests for User Stories 2 & 3 🧪
- [X] T011 [P] [US3] Unit test for `CefrDualLevelPicker` validating exact 2-level selection constraint in `tests/unit/CefrDualLevelPicker.test.js`

### Implementation for User Stories 2 & 3
- [X] T012 [P] [US3] Implement `CefrDualLevelPicker` component with interactive pills (A1–C2) and selection count badge in `src/ui/components/CefrDualLevelPicker.js`
- [X] T013 [P] [US2] Implement `PracticeRecordingConsole` with live microphone wave, audio controls, and editable transcript in `src/ui/components/PracticeRecordingConsole.js`

---

## Phase 5: User Story 4 - AI Speech Elevation & Comparative Display (Priority: P1) 🎯 MVP

**Goal**: Deliver side-by-side comparative cards showing original speech alongside the 2 elevated CEFR versions with lexical highlight tags and syntactic explanations.

**Independent Test**: Provide spoken transcript, select B1 and B2, click "Améliorer avec l'IA", verify 3 comparative columns render with highlighted differences and localized explanations.

### Implementation for User Story 4
- [X] T014 [US4] Implement `ElevationComparisonCard` component rendering Original vs Level 1 vs Level 2 with highlight badges in `src/ui/components/ElevationComparisonCard.js`
- [X] T015 [US4] Assemble `PracticeView` orchestrating prompt selection, recording console, level picker, and comparison display in `src/ui/views/PracticeView.js`

---

## Phase 6: User Story 5 - Auditory Shadowing via TTS (Priority: P2)

**Goal**: Allow candidates to listen to native French voice synthesis of the elevated speeches with level-calibrated reading velocity for oral repetition/shadowing.

**Independent Test**: Click "🔊 Écouter" on any elevated card; verify `VoiceSynthesizer` speaks French text with play/pause toggle.

### Implementation for User Story 5
- [X] T016 [US5] Integrate `VoiceSynthesizer` audio playback controls and active speech highlight into `src/ui/components/ElevationComparisonCard.js`

---

## Phase 7: Multilingual Localization, Polish & Verification

**Goal**: Complete translation across all 4 languages (FR, EN, ZH, VI) and execute end-to-end integration test.

- [X] T017 [P] Add Practice Mode translation keys to French dictionary in `src/core/i18n/locales/fr.js`
- [X] T018 [P] Add Practice Mode translation keys to English dictionary in `src/core/i18n/locales/en.js`
- [X] T019 [P] Add Practice Mode translation keys to Chinese dictionary in `src/core/i18n/locales/zh.js`
- [X] T020 [P] Add Practice Mode translation keys to Vietnamese dictionary in `src/core/i18n/locales/vi.js`
- [X] T021 [P] End-to-end integration test validating full practice flow (Speech -> Dual Levels -> AI Elevation -> TTS) in `tests/integration/PracticeModeFlow.test.js`
- [X] T022 Execute full test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`) and browser validation

