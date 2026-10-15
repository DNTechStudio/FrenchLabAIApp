# Implementation Plan: Practice Mode with Dual-Level AI Speech Elevation

**Feature**: `003-practice-mode-ai-improvement` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

---

## 1. Summary

Implement **Practice Mode (Mode Entraînement)** alongside the existing **Test Mode (Mode Examen)**:
1. **App Mode Switcher**: Header segmented control allowing smooth switching between Exam Mode and Practice Mode without loss of session state.
2. **Spontaneous Practice Console**: Freeform oral practice on preset or custom prompts, with live French speech-to-text and editable transcript buffer.
3. **Dual CEFR Level Picker**: An interactive selector enforcing selection of **exactly two CEFR levels** from `[A1, A2, B1, B2, C1, C2]`.
4. **AI Speech Elevation Engine ("Improve with AI")**: Deterministic linguistic engine that transforms candidate speech into two calibrated CEFR level variations, highlighting upgraded vocabulary, grammatical structures, and connectors.
5. **Auditory Shadowing via TTS**: One-click audio playback using `VoiceSynthesizer` for shadowing practice.
6. **Multilingual Scaffolding**: Full localization of Practice Mode UI and upgrade rationales across French, English, Chinese, and Vietnamese.

---

## 2. Technical Context

- **Runtime**: Modern Native ES Modules (ES2022+ Strict Mode)
- **Dependencies**: Zero external npm runtime dependencies
- **Audio Engine**: Web Audio API (`AudioRecorder`) + Web Speech API (`SpeechRecognizer`, `VoiceSynthesizer`)
- **Persistence**: `localStorage` (`delf_speaking_active_mode`, `delf_speaking_practice_session`, `delf_speaking_selected_levels`)
- **Testing**: Node.js built-in test runner (`node:test`) with synthetic transcript mocks
- **Target Platform**: Evergreen Modern Browsers (Chrome, Edge, Firefox, Safari)

---

## 3. Constitution Check (v1.0.1)

| Principle | Architectural Requirement | Status |
| :--- | :--- | :--- |
| **I. Library-First & Modular Audio Engine** | `PracticeElevationEngine` and audio recording MUST be decoupled from UI views. | **PASS**: `PracticeElevationEngine` is pure core library logic with unit tests and explicit contract (`contracts/practice-engine.contract.json`). |
| **II. Strict CEFR Alignment & Deterministic Rubric** | Transformations MUST accurately reflect CEFR descriptors (A1–C2). | **PASS**: `CefrLevelDefinitions` defines precise linguistic boundaries for syntax, connectors, and lexical registers. |
| **III. Test-First & Audio Mocking (NON-NEGOTIABLE)** | TDD mandatory for elevation heuristics and level selection. | **PASS**: Unit tests in `tests/unit/PracticeElevationEngine.test.js` and `tests/unit/CefrDualLevelPicker.test.js`. |
| **IV. State Resilience & Fail-Safe Audio UX** | Practice transcripts and chosen levels MUST persist across reloads. | **PASS**: Stored in `localStorage` separately from Exam Mode session. |
| **V. Premium Aesthetics & Pure CSS Architecture** | Elegant glassmorphism, responsive comparison cards, no Tailwind. | **PASS**: Built with pure CSS custom properties and responsive multi-column layouts. |

---

## 4. Planned Project Structure

```text
src/
├── core/
│   ├── practice/
│   │   ├── CefrLevelDefinitions.js        # Rubric rules, connectors, and transformation tables (A1-C2)
│   │   └── PracticeElevationEngine.js     # AI speech elevation engine
│   └── i18n/locales/
│       ├── fr.js                          # Added practice mode strings
│       ├── en.js                          # Added practice mode strings
│       ├── zh.js                          # Added practice mode strings
│       └── vi.js                          # Added practice mode strings
├── data/
│   └── practice/
│       └── practicePrompts.js             # Curated themes & prompts for practice
├── ui/
│   ├── components/
│   │   ├── ModeSwitcher.js                # Header toggle: Exam vs Practice
│   │   ├── CefrDualLevelPicker.js         # Interactive selector for exactly 2 levels
│   │   ├── PracticeRecordingConsole.js    # Recording bar & transcript editor
│   │   └── ElevationComparisonCard.js     # Comparative 3-column / tab view with TTS
│   ├── styles/
│   │   └── practice.css                   # Specialized styles for comparison & level pills
│   └── views/
│       └── PracticeView.js                # Top-level view orchestrator for Practice Mode
tests/
├── unit/
│   ├── CefrDualLevelPicker.test.js        # Validates dual selection constraints
│   └── PracticeElevationEngine.test.js    # Validates level transformations (A1-C2)
└── integration/
    └── PracticeModeFlow.test.js           # End-to-end practice lifecycle test
```

---

## 5. Phase-by-Phase Execution Plan

### Phase 1: Core Domain & Elevation Engine
- Define `CefrLevelDefinitions.js` with lexical upgrade dictionaries, connector hierarchies, and syntactic templates for A1 through C2.
- Implement `PracticeElevationEngine.js` with `elevateSpeech({ originalTranscript, level1, level2, locale })`.
- Write unit tests in `tests/unit/PracticeElevationEngine.test.js`.

### Phase 2: Dual CEFR Level Picker & Curated Prompts
- Implement `CefrDualLevelPicker.js` enforcing maximum and exact selection of 2 levels.
- Add unit tests in `tests/unit/CefrDualLevelPicker.test.js`.
- Provide curated practice themes in `src/data/practice/practicePrompts.js`.

### Phase 3: Mode Switcher & Global Router Updates
- Create `ModeSwitcher.js` component for the header.
- Update `src/app.js` and `index.html` to toggle between `ExamFlowStateMachine` and `PracticeView`.
- Persist mode in `localStorage` (`delf_speaking_active_mode`).

### Phase 4: Practice Recording Console & Comparison Card
- Build `PracticeRecordingConsole.js` integrating `AudioRecorder` and `SpeechRecognizer` with manual transcript editing.
- Build `ElevationComparisonCard.js` displaying Original vs Level 1 vs Level 2 with highlight badges and TTS playback.
- Assemble `PracticeView.js`.

### Phase 5: Multilingual Localization & Polish
- Add localized strings for Practice Mode to `fr.js`, `en.js`, `zh.js`, and `vi.js`.
- Integrate `practice.css` into `index.html`.
- Run end-to-end test suite (`PracticeModeFlow.test.js`).
