# Implementation Plan: French DELF B2 Oral Exam Simulator

**Branch**: `001-delf-b2-speaking-simulator` | **Date**: 2026-09-27 | **Spec**: [specs/001-delf-b2-speaking-simulator/spec.md](spec.md)

**Input**: Feature specification from `specs/001-delf-b2-speaking-simulator/spec.md`

---

## Summary

Build an interactive, modern web application simulating the official French DELF B2 oral exam (Production Orale). The solution implements an end-to-end exam simulation journey:
1. **Trigger Document Selection & Preparation**: Curated authentic DELF B2 texts with random draw, a synchronized 10-minute countdown, and a structured digital scratchpad.
2. **Part 1 (Monologue Suivi)**: Web Audio recording with live Canvas-based real-time waveform visualizer (>= 30 fps) and elapsed speaking timer (5–7 min window).
3. **Part 2 (Spoken Debate)**: AI Examiner vocalizing contextual counter-questions in native French (`fr-FR` neural TTS) based on the candidate's speech, with 3–5 interactive turns and fail-safe closed captions.
4. **Evaluation Engine**: Automated 25-point scoring strictly aligned with France Éducation international's grid (Monologue /9, Débat /6, Lexique /4, Morphosyntaxe /5, Phonologie /1) providing annotated transcripts, grammar corrections, and lexical enrichment suggestions.
5. **State Resilience**: LocalStorage and IndexedDB persistence ensuring candidates never lose exam progress or audio upon reload.

---

## Technical Context

**Language/Version**: Modern TypeScript / ES2022+ (Strict mode)

**Primary Dependencies**:
- Core: Vanilla TypeScript / HTML5
- Build Tool / Dev Server: Vite (minimal, zero unnecessary runtime dependencies)
- Audio Processing: Web Audio API (`AudioContext`, `AnalyserNode`), `MediaRecorder` API
- Speech Recognition: Web Speech Recognition API (`webkitSpeechRecognition`) with cloud STT adapter
- Speech Synthesis: Web Speech Synthesis API (`window.speechSynthesis`) with cloud TTS fallback
- Styling: Pure Vanilla CSS with centralized CSS variables / Design Tokens (No Tailwind)

**Storage**:
- Session Metadata, Phase State & Scratchpad: `localStorage` (`delf_speaking_session_active`)
- Binary Audio Recordings (Monologue & Debate Turns): `IndexedDB` (`delf_speaking_audio_store`)

**Testing**:
- Test Runner: Vitest
- Mock Audio Pipeline: `MockAudioContext`, `MockMediaRecorder`, `MockSpeechRecognizer` for headless CI testing (Constitution Principle III)
- Contract & Rubric Validation: Automated unit test suite verifying 25-point mathematical consistency

**Target Platform**: Modern Evergreen Browsers (Chrome, Edge, Safari, Firefox) on Desktop & Tablet

**Project Type**: Client-Side Single Page Web Application (SPA) with optional cloud AI proxy adapter

**Performance Goals**:
- Initial Load & Document Ready: < 3 seconds
- Audio Waveform Rendering: >= 30 fps (60 fps target) with zero audio stutter
- Examiner Audio Playback Initialization: < 4 seconds after turn submission
- Evaluation Report Generation: < 15 seconds

**Constraints**:
- Responsive & Accessible: WCAG AA compliant contrast ratios and keyboard navigability
- Offline & Local Resilience: Exam session and scratchpad notes preserved across browser reloads
- Privacy-Safe: Microphone permissions requested strictly on-demand; zero persistent credential leakage

**Scale/Scope**:
- Complete DELF B2 Oral Simulator (Prep, Monologue, 3–5 turn Debate, Scoring & Export)
- Curated repository of 15+ authentic trigger documents across standard CEFR themes

---

## Constitution Check

*GATE: Verified against [.specify/memory/constitution.md](../../.specify/memory/constitution.md) (v1.0.0)*

| Principle | Requirement | Compliance Status & Design Architecture |
| :--- | :--- | :--- |
| **I. Library-First & Modular Audio Engine** | Modular, decoupled packages with explicit contracts | **PASS**: Audio capture (`AudioRecorder`), waveform visualizer (`WaveformVisualizer`), STT (`SpeechRecognizer`), TTS (`VoiceSynthesizer`), and timer (`ExamTimer`) are encapsulated in `src/core/` with standalone contracts in `contracts/audio-engine.contract.json`. |
| **II. Strict CEFR Alignment & Deterministic Rubric** | Official 25-pt France Éducation international grid | **PASS**: The `DelfB2EvaluationEngine` strictly enforces the 5 official subscores (Monologue /9, Débat /6, Lexique /4, Morphosyntaxe /5, Phonologie /1 = 25 pts) and quotes transcript evidence. |
| **III. Test-First & Audio Mocking (NON-NEGOTIABLE)** | TDD mandatory; mock audio & transcripts for CI | **PASS**: `MockAudioStream` and `MockSpeechRecognizer` test fixtures allow 100% of state transitions and rubric scoring tests to run headless without physical hardware. |
| **IV. State Resilience & Fail-Safe Audio UX** | Session persistence; live waveform; closed captions fallback | **PASS**: Auto-save to LocalStorage + IndexedDB; real-time Canvas soundwave; interactive examiner speech bubble with fail-safe captions. |
| **V. Premium Aesthetics & Pure CSS Architecture** | Dark mode, French typography, pure Vanilla CSS tokens | **PASS**: Zero CSS framework bloat. Modular CSS stylesheets (`variables.css`, `components.css`, `views.css`) using CSS custom properties, glassmorphism, and elegant styling. |

**Evaluation Gate**: All gates passed. Zero unjustified violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-delf-b2-speaking-simulator/
├── plan.md              # This implementation plan
├── research.md          # Technical research & architecture decisions (Phase 0)
├── data-model.md        # Entities, schemas, and state machine (Phase 1)
├── quickstart.md        # End-to-end validation scenarios (Phase 1)
├── contracts/           # API and library interface contracts (Phase 1)
│   ├── audio-engine.contract.json
│   ├── evaluation-engine.contract.json
│   └── storage.contract.json
└── tasks.md             # Implementation tasks (/speckit.tasks command - Phase 2)
```

### Source Code Layout

```text
src/
├── core/
│   ├── audio/
│   │   ├── AudioRecorder.ts         # MediaRecorder wrapper with event dispatch
│   │   ├── WaveformVisualizer.ts    # AnalyserNode to Canvas 2D renderer
│   │   └── MockAudioRecorder.ts     # Synthetic audio stream mock for testing
│   ├── speech/
│   │   ├── SpeechRecognizer.ts      # Web Speech STT wrapper (fr-FR)
│   │   ├── VoiceSynthesizer.ts      # Web Speech Synthesis TTS wrapper
│   │   └── MockSpeechRecognizer.ts  # Canned STT test provider
│   ├── evaluation/
│   │   ├── DelfB2EvaluationEngine.ts# 25-point scoring & rubric calculator
│   │   ├── RubricValidator.ts       # Mathematical and schema validation
│   │   └── Prompts.ts               # Pedagogical evaluation prompt templates
│   ├── storage/
│   │   ├── SessionRepository.ts     # LocalStorage state management
│   │   └── AudioStore.ts            # IndexedDB audio blob storage
│   └── timer/
│       └── ExamTimer.ts             # Countdown (prep) & elapsed (speaking) timer
├── data/
│   └── documents/
│       ├── triggerDocuments.ts      # Curated repository of DELF B2 prompts
│       └── categories.ts            # Thematic categories metadata
├── ui/
│   ├── components/
│   │   ├── DocumentCard.ts          # Trigger document reader with metadata
│   │   ├── ScratchpadDrawer.ts      # 10-minute prep structured notepad
│   │   ├── WaveformCanvas.ts        # Real-time reactive audio visualizer
│   │   ├── DebateTurnChat.ts        # Examiner question & student rebuttal flow
│   │   ├── ScoreCard.ts             # 25-point rubric score breakdown display
│   │   └── TranscriptAnnotator.ts   # Verbatim transcript with error highlights
│   ├── views/
│   │   ├── SelectionView.ts         # Topic browser and random draw
│   │   ├── PreparationView.ts       # 10-min countdown and scratchpad view
│   │   ├── MonologueView.ts         # Live recording & speaking window view
│   │   ├── DebateView.ts            # Interactive AI examiner exchange view
│   │   └── ReportView.ts            # Final CEFR B2 diagnostic score report
│   └── styles/
│       ├── variables.css            # French blue/indigo tokens, dark mode palette
│       ├── reset.css                # Base reset & typography rules
│       ├── components.css           # Glassmorphic cards, waveform, buttons, chat
│       └── views.css                # Phased container layouts & responsive grid
├── app.ts                           # Main application orchestrator & state machine
└── index.html                       # Entry HTML file with semantic structure

tests/
├── unit/
│   ├── DelfB2EvaluationEngine.test.ts # 25-point calculation & rubric rules
│   ├── ExamTimer.test.ts              # Countdown and elapsed timer events
│   └── SessionRepository.test.ts      # Persistence and state recovery
├── mocks/
│   ├── MockAudioData.ts               # Test audio blobs and waveforms
│   └── MockExaminerDebate.ts          # Sample candidate monologues & debate turns
└── integration/
    └── ExamFlowStateMachine.test.ts   # Full prep -> monologue -> debate -> report flow
```

**Structure Decision**: A clean, single-project client-side architecture leveraging TypeScript and Vanilla CSS. The modular `src/core/` engine directly implements Constitution Principle I (Library-First), allowing the core audio, speech, and scoring logic to be tested independently in `tests/` without UI coupling.

---

## Complexity Tracking

> **Constitution Compliance**: 100% compliant. No violations; zero complexity exceptions required.
