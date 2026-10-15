# Technical Research & Architecture Decisions: DELF B2 Speaking Simulator

**Feature**: `001-delf-b2-speaking-simulator` | **Date**: 2026-09-27

---

## 1. Audio Capture, Waveform Visualization & Streaming

### Problem & Context
The simulator requires real-time microphone recording for the Monologue (5–7 minutes) and each Debate turn (1–2 minutes each), with a live visual waveform to reassure candidates that their microphone is properly capturing sound.

### Decision
- **Web Audio API (`AudioContext` + `AnalyserNode`)**: Connect a `MediaStreamAudioSourceNode` from `navigator.mediaDevices.getUserMedia({ audio: true })` to an `AnalyserNode` (`fftSize: 256` or `512`). A `requestAnimationFrame` loop queries `getByteTimeDomainData` or `getByteFrequencyData` to render a responsive, fluid canvas-based soundwave visualizer (>= 30-60 fps) with minimal CPU overhead.
- **`MediaRecorder` API**: Encapsulate recording into an `AudioRecorder` module exporting standard `audio/webm;codecs=opus` (or `audio/mp4` fallback for Safari iOS/macOS) Blob chunks.
- **Audio Mocking (`MockAudioContext`, `MockMediaRecorder`)**: Implement an injectable mock audio driver that produces synthetic silence/sine-wave blobs so the entire recording pipeline can be tested headless in CI/CD without hardware microphones (Constitution Principle III).

### Alternatives Considered
- *Third-party libraries (e.g. Wavesurfer.js)*: Rejected to satisfy Constitution Principle I & V (Library-First, zero bloated dependencies, full control over canvas styling and glassmorphic aesthetics).
- *AudioWorklet for custom DSP*: Overkill for a voice examination waveform; `AnalyserNode` + Canvas 2D is performant, universally supported, and lightweight.

---

## 2. Speech-to-Text (STT) & Speech Recognition Architecture

### Problem & Context
Candidate speech must be transcribed into French text accurately to extract arguments, fuel the AI Examiner's contextual follow-up questions, and highlight morphosyntax and lexical errors in the final diagnostic report.

### Decision
- **Hybrid Speech-to-Text Architecture**:
  1. **Primary / Interactive Real-Time Mode**: Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) with `lang: 'fr-FR'`, `continuous: true`, `interimResults: true`. Provides instant candidate transcription without external API latency or cost.
  2. **High-Accuracy Neural STT Fallback / Cloud Mode**: Adapter interface (`SpeechRecognitionAdapter`) capable of submitting recorded audio blobs to Gemini Audio API or Whisper API when API credentials are provided via `.env`.
  3. **Headless Test Mock (`MockSpeechRecognizer`)**: Emits deterministic test transcripts for canned speech fixtures to test turn-taking and rubric evaluation deterministically.

### Alternatives Considered
- *Whisper.wasm (Client-side in-browser)*: Large initial download (>40MB–140MB), slow inference on lower-spec mobile devices; unnecessary when Web Speech API is natively built into Chrome, Safari, and Edge.

---

## 3. Native French Text-to-Speech (TTS) & Examiner Vocalization

### Problem & Context
The AI Examiner must challenge the candidate in native, natural French with realistic exam room persona, pacing, and tone (Constitution Principle I & IV).

### Decision
- **Web Speech Synthesis API (`window.speechSynthesis`)**: Select high-quality native French neural voices (`fr-FR`, e.g., "Google français", "Thomas", "Audrey", "Amélie") with tuned parameters (`rate: 0.95`, `pitch: 1.0`) to emulate an authentic, measured DELF examiner tone.
- **Fail-Safe Closed Captions (Constitution Principle IV)**: The UI displays an interactive Examiner Speech bubble with high-fidelity closed captions. The candidate can toggle between "Exam Mode" (captions hidden until audio completes) and "Practice Mode" (captions visible synchronously). If voice playback is delayed or unavailable, captions automatically reveal so the candidate is never blocked.
- **Cloud TTS Adapter**: Extensible interface supporting Gemini TTS / Webhook audio for high-fidelity offline neural synthesis if configured.

### Alternatives Considered
- *Pre-recorded MP3 Examiner Audios*: Impossible for a dynamic debate phase where examiner questions are contextualized based on the candidate's actual speech arguments.

---

## 4. CEFR DELF B2 25-Point Evaluation Engine

### Problem & Context
The grading system must be strictly aligned with France Éducation international's official rubric, producing 5 distinct subscores totaling 25 points, detailed linguistic corrections, and actionable feedback (Constitution Principle II).

### Decision
- **Deterministic Rubric Schema (`DelfB2EvaluationEngine`)**:
  - Evaluation is computed against rigid criteria schemas:
    1. *Monologue suivi* (/9 points: Problématique /3, Prise de position & arguments /3, Cohérence & transitions /3)
    2. *Débat en interaction* (/6 points: Défense face aux objections /3, Réactivité & relance /3)
    3. *Compétence lexicale* (/4 points: Étendue et nuances)
    4. *Compétence morphosyntaxique* (/5 points: Complexité et précision)
    5. *Maîtrise phonologique* (/1 point: Intonation, fluidité, prononciation)
  - Passing thresholds: $\ge 12.5/25$ (Overall recommended pass), $< 5/25$ (Official eliminatory mark).
  - Schema-enforced structured JSON output with citation fields linking every deduction to exact quotes from the candidate transcript.
  - Built-in heuristic rule-based validator + LLM Prompt Engine (using Gemini API or OpenAI structured outputs) ensuring mathematical consistency (subscores strictly sum to totalScore).

### Alternatives Considered
- *Unstructured free-form LLM evaluation*: Rejected. Prone to score hallucination, inconsistent grading grids, and inability to parse reliable subscores.

---

## 5. State Persistence & Crash Resilience

### Problem & Context
If a candidate accidentally refreshes the page, navigates backward, or experiences a transient browser glitch during a 20-minute simulation, their trigger document, prep scratchpad, and audio recordings must not be lost (Constitution Principle IV).

### Decision
- **Structured Storage Repository (`SessionRepository`)**:
  - Metadata, current phase, timers, and text transcripts stored in `localStorage` under `delf_speaking_session_active`.
  - Binary audio blobs (Monologue recording and debate turn responses) persisted in `IndexedDB` (`delf_speaking_audio_store`).
  - Auto-save on every state transition, debounced text changes on scratchpad notes (every 500ms), and audio turn completion.
  - "Resume Active Session" prompt upon returning to the app if an unfinished exam session is detected.

---

## 6. Frontend Stack & UI Design System

### Problem & Context
Must follow Constitution Principle V: Pure Vanilla CSS with Design Tokens, modern dark mode with glassmorphic aesthetics, zero unnecessary bloatware.

### Decision
- **Technology Stack**:
  - **Core**: Vanilla HTML5, Modern TypeScript / JavaScript (ES2022+), built with Vite for rapid development and optimized builds.
  - **Styling**: Pure Vanilla CSS organized into:
    - `variables.css` (Design tokens: French blue/indigo accents `#2563EB`, `#1E1B4B`, neutral slates, borders, glass gradients, spacing, typography scales)
    - `components.css` (Waveform card, audio player, scratchpad drawer, debate chat stream, 25-point report cards)
    - `views.css` (Phased layouts: Selection, Preparation, Monologue, Debate, Results)
  - **Typography**: Google Fonts `Inter` (UI & Body), `Newsreader` or `Outfit` (Headings & Document Title).
  - **Aesthetics**: Glassmorphism cards with `backdrop-filter: blur(12px)`, subtle glowing pulse states on recording, smooth CSS transitions.
