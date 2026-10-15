# Implementation Tasks: French DELF B2 Oral Exam Simulator

**Feature**: `001-delf-b2-speaking-simulator` | **Branch**: `001-delf-b2-speaking-simulator`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, build tools, test runner, styling foundation, and test mocks.

- [X] T001 Initialize Vite + TypeScript project with `package.json`, `tsconfig.json`, and `vite.config.ts`
- [X] T002 [P] Configure Vitest test runner and headless browser DOM environment in `vitest.config.ts` and `tests/setup.ts`
- [X] T003 [P] Setup Vanilla CSS Design Tokens (French blue palette, dark mode, glassmorphism) in `src/ui/styles/variables.css` and `src/ui/styles/reset.css`
- [X] T004 [P] Create mock audio & speech fixtures (`MockAudioData.js`, `MockAudioRecorder.js`, `MockSpeechRecognizer.js`) in `tests/mocks/` for headless TDD

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data models, persistence repositories, audio store, exam timer, and central state machine.

> **CRITICAL**: Foundational tasks must complete before user story implementation can proceed.

- [X] T005 Implement TypeScript entities and domain types (`TriggerDocument`, `ExamSession`, `PreparationScratchpad`, `OralMonologue`, `DebateTurn`, `EvaluationReport`) in `src/types/index.js`
- [X] T006 [P] Implement `SessionRepository` with LocalStorage session persistence and crash recovery in `src/core/storage/SessionRepository.js`
- [X] T007 [P] Implement `AudioStore` with IndexedDB binary audio blob storage in `src/core/storage/AudioStore.js`
- [X] T008 [P] Implement `ExamTimer` supporting synchronized 10-min countdown and elapsed speaking timer with event listeners in `src/core/timer/ExamTimer.js`
- [X] T009 [P] Create curated trigger documents repository with authentic French debate texts across 5 B2 themes in `src/data/documents/triggerDocuments.js`
- [X] T010 Implement central `ExamFlowStateMachine` orchestrating phases (`SELECTION`, `PREPARATION`, `MONOLOGUE`, `DEBATE`, `EVALUATION`, `REPORT`) in `src/core/ExamFlowStateMachine.js`

**Checkpoint**: Foundational architecture ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Full Exam Simulation Journey (Priority: P1) 🎯 MVP

**Goal**: Deliver a complete end-to-end simulation loop: candidate selects a topic, prepares notes, records monologue with real-time waveform, participates in an AI examiner debate, and receives a 25-point CEFR B2 report.

**Independent Test**: Start session, record speech (or inject mock audio), complete debate turn-taking, and verify generation of a complete 25-point score report.

### Tests for User Story 1 (TDD Mandatory per Constitution Principle III) 🧪
- [X] T011 [P] [US1] Integration test for complete end-to-end exam simulation journey in `tests/integration/ExamFlowStateMachine.test.js`
- [X] T012 [P] [US1] Unit test for `DelfB2EvaluationEngine` 25-point scoring math and rubric schema validation in `tests/unit/DelfB2EvaluationEngine.test.js`

### Implementation for User Story 1
- [X] T013 [P] [US1] Implement `AudioRecorder` wrapping `MediaRecorder` with start, stop, pause, and blob output in `src/core/audio/AudioRecorder.js`
- [X] T014 [P] [US1] Implement `WaveformVisualizer` rendering `AnalyserNode` time-domain/frequency data onto HTML5 Canvas (>= 30 fps) in `src/core/audio/WaveformVisualizer.js`
- [X] T015 [P] [US1] Implement `SpeechRecognizer` wrapping Web Speech API (`fr-FR`) with continuous interim and final transcription in `src/core/speech/SpeechRecognizer.js`
- [X] T016 [P] [US1] Implement `VoiceSynthesizer` wrapping Web Speech Synthesis API (`fr-FR`) with neural voice selection in `src/core/speech/VoiceSynthesizer.js`
- [X] T017 [US1] Implement deterministic `DelfB2EvaluationEngine` scoring the 5 official rubric dimensions in `src/core/evaluation/DelfB2EvaluationEngine.js`
- [X] T018 [US1] Assemble main application shell, header, and stage view switcher in `src/app.js` and `index.html`

**Checkpoint**: User Story 1 is fully functional as a runnable MVP.

---

## Phase 4: User Story 2 - Trigger Document Selection & Preparation Scratchpad (Priority: P2)

**Goal**: Allow candidates to draw random topics or filter by category, and take structured notes in a digital scratchpad with a 10-minute prep countdown.

**Independent Test**: Draw random topic, enter notes in scratchpad sections, verify notes remain pinned/persisted across reloads and during monologue recording.

### Tests for User Story 2 🧪
- [X] T019 [P] [US2] Unit test for document repository filters and random draw algorithm in `tests/unit/TriggerDocuments.test.js`
- [X] T020 [P] [US2] Unit test for scratchpad auto-save and section serialization in `tests/unit/ScratchpadDrawer.test.js`

### Implementation for User Story 2
- [X] T021 [P] [US2] Implement `DocumentCard` component with category badges, source credit, and problematique guidance in `src/ui/components/DocumentCard.js`
- [X] T022 [P] [US2] Implement `SelectionView` with random draw shuffle animation and category tabs in `src/ui/views/SelectionView.js`
- [X] T023 [US2] Implement `ScratchpadDrawer` component with DELF B2 sections (Intro, Plan, Arguments, Conclusion) and 500ms debounced persistence in `src/ui/components/ScratchpadDrawer.js`
- [X] T024 [US2] Implement `PreparationView` integrating 10-minute countdown `ExamTimer`, `DocumentCard`, and `ScratchpadDrawer` in `src/ui/views/PreparationView.js`

**Checkpoint**: User Stories 1 and 2 operate seamlessly together with structured preparation notes.

---

## Phase 5: User Story 3 - Spoken Debate Phase with Context-Aware AI Examiner (Priority: P3)

**Goal**: AI Examiner actively challenges candidate claims with 3–5 spoken counter-arguments in French, supporting turn-taking and fail-safe closed captions.

**Independent Test**: Complete monologue, verify AI examiner produces contextual spoken counter-question within 4 seconds, record spoken rebuttal, complete 3 turns.

### Tests for User Story 3 🧪
- [X] T025 [P] [US3] Unit test for debate turn progression and counter-argument question generation in `tests/unit/DebateTurnChat.test.js`
- [X] T026 [P] [US3] Unit test for fail-safe caption fallback when voice playback encounters errors/delays in `tests/unit/VoiceSynthesizer.test.js`

### Implementation for User Story 3
- [X] T027 [P] [US3] Implement `DebateTurnChat` component showing turn badges (Turn 1/3), examiner audio wave avatar, and candidate reply controls in `src/ui/components/DebateTurnChat.js`
- [X] T028 [P] [US3] Implement debate counter-question generation logic and candidate thesis analyzer in `src/core/evaluation/DebateEngine.js`
- [X] T029 [US3] Implement `DebateView` integrating examiner vocalization, live rebuttal microphone recording, and captions toggle in `src/ui/views/DebateView.js`

**Checkpoint**: Interactive oral debate with spoken examiner turn-taking is fully operational.

---

## Phase 6: User Story 4 - Official 25-Point CEFR B2 Diagnostic Evaluation Report (Priority: P4)

**Goal**: Comprehensive diagnostic score sheet displaying all 5 official rubric sub-scores, annotated verbatim speech transcripts, grammar error explanations, lexical suggestions, and PDF/print export.

**Independent Test**: Conclude debate, verify all 5 rubric subscores sum to 25.0, inspect highlighted transcript error tooltips, trigger print view.

### Tests for User Story 4 🧪
- [X] T030 [P] [US4] Unit test for transcript error annotation and lexical connector extraction in `tests/unit/TranscriptAnnotator.test.js`
- [X] T031 [P] [US4] Unit test for report print stylesheet and session export in `tests/unit/ReportView.test.js`

### Implementation for User Story 4
- [X] T032 [P] [US4] Implement `ScoreCard` component displaying the 5 official DELF B2 rubric dimensions with visual meters in `src/ui/components/ScoreCard.js`
- [X] T033 [P] [US4] Implement `TranscriptAnnotator` component highlighting grammatical/morphosyntax errors with explanatory tooltips in `src/ui/components/TranscriptAnnotator.js`
- [X] T034 [US4] Implement `ReportView` with pass/fail badge, strengths/weaknesses synthesis, action plan, and print export in `src/ui/views/ReportView.js`

**Checkpoint**: All user stories complete with high-fidelity score reporting and pedagogical guidance.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, error resilience, responsive refinements, and end-to-end validation.

- [X] T035 [P] Implement responsive layout refinements and mobile/tablet viewport testing in `src/ui/styles/views.css`
- [X] T036 [P] Implement microphone permission error handling modal with browser-specific troubleshooting steps in `src/ui/components/MicPermissionModal.js`
- [X] T037 [P] Add keyboard accessibility shortcuts (Space to record/pause, Esc to dismiss modal) in `src/app.js`
- [X] T038 Run end-to-end validation scenarios documented in `specs/001-delf-b2-speaking-simulator/quickstart.md`
