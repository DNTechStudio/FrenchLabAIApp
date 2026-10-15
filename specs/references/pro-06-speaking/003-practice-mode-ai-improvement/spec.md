# Feature Specification: Practice Mode with Dual-Level AI Speech Elevation

**Feature Identifier**: `003-practice-mode-ai-improvement`  
**Status**: Draft / Proposed  
**Constitution Compliance**: v1.0.1  
**Target Delivery**: DELF-DALF Lab Speaking v1.2.0  

---

## 1. Executive Summary & Problem Statement

### 1.1 Context
The existing application currently operates exclusively in **Test Mode** (official DELF B2 simulation: 10-minute preparation timer, strictly timed 5–7 minute monologue, examiner-led 3-turn interactive debate, and formal 25-point CEFR scorecard).

### 1.2 Problem
While Test Mode is ideal for pre-exam readiness checks, candidates need a flexible, low-pressure **Practice Mode** (Mode Entraînement) to hone specific speaking skills, experiment with varied topics, and directly understand how their spoken French can be progressively elevated across CEFR standards from A1 to C2.

### 1.3 Solution
Introduce an overarching **Mode Switcher** (Mode Examen 🎓 vs Mode Entraînement 🎙️) and a dedicated **Practice Mode Suite**:
1. **Freeform Spontaneous Speaking**: Record speech on user-defined or suggested French prompts with real-time Speech-to-Text (STT) and an editable transcript buffer.
2. **Dual CEFR Target Selector**: Candidates choose **any 2 CEFR levels** from `[A1, A2, B1, B2, C1, C2]` (e.g., compare a B1 baseline with a B2 target, or B2 with C1).
3. **AI Speech Elevation Engine ("Improve with AI")**: Generates dual CEFR-calibrated rewrites of the spoken transcript, displaying side-by-side syntactic enhancements, connector additions, lexical upgrades, and phonetic guidance.
4. **Auditory Shadowing (TTS)**: Built-in voice playback allowing the candidate to listen to the AI-elevated speeches and practice shadowing/repetition.
5. **Multilingual Pedagogy**: Explanations of why and how expressions were upgraded available in French, English, Chinese, and Vietnamese.

---

## 2. User Personas & Scenarios

### Persona 1: Sophie (B1 Learner Aiming for B2)
- *Goal*: Wants to speak spontaneously for 2 minutes on the topic of remote work, see her spoken text transcribed, and choose `[B1, B2]` to see how her simple sentences can be upgraded into complex B2 structures with concessive connectors (`bien que`, `quoique`).

### Persona 2: Minh (B2 Candidate Striving for C1 Distinction)
- *Goal*: Already speaks comfortable B2 French, but wants to elevate his vocabulary to DALF C1. He selects `[B2, C1]`, clicks "Improve with AI", and compares how his B2 argument is reframed into formal C1 academic rhetoric with stylistic inversions and nuanced subjunctive turns.

---

## 3. User Stories & Acceptance Criteria

### User Story 1: Global App Mode Switcher (Priority: P1 - MVP)
**As a** language learner,  
**I want to** toggle between "Test Mode" (Mode Examen) and "Practice Mode" (Mode Entraînement) in the top navigation bar,  
**So that** I can switch between official exam simulations and freeform speaking workouts without losing session context.

#### Acceptance Criteria:
- **AC1.1**: The header displays a prominent mode segmented control: `🎓 Mode Examen` | `🎙️ Mode Entraînement`.
- **AC1.2**: Switching modes updates the active view immediately:
  - Mode Examen displays the 5-step examination stepper (`Sujet -> Préparation -> Monologue -> Débat -> Bilan 25 pts`).
  - Mode Entraînement displays the practice workspace stepper (`1. Sujet & Enregistrement -> 2. Transcription & Niveaux -> 3. Amélioration IA`).
- **AC1.3**: The user's active mode preference persists in `localStorage` (`delf_speaking_active_mode`).
- **AC1.4**: If the user has an in-progress exam session, switching modes triggers a confirmation dialog to prevent accidental data loss.

---

### User Story 2: Spontaneous Voice Recording & Transcript Editor (Priority: P1 - MVP)
**As a** candidate in Practice Mode,  
**I want to** record my spoken response to a prompt or free topic and see it transcribed into text,  
**So that** I have an accurate transcript of what I said before requesting AI elevation.

#### Acceptance Criteria:
- **AC2.1**: The user can choose a pre-loaded topic from categories (Travail, Écologie, Éducation, Société) or input a custom prompt.
- **AC2.2**: The recording console provides `Start Recording`, `Pause`, `Resume`, and `Finish Recording` buttons with live volume indicator / pulse animation.
- **AC2.3**: Speech is transcribed in real-time via `SpeechRecognizer` (`fr-FR`).
- **AC2.4**: After finishing recording, the candidate can review and manually edit the transcript to fix any speech-to-text acoustic misrecognitions.

---

### User Story 3: Flexible CEFR Target Level Selection (Maximum 2 Levels) (Priority: P1 - MVP)
**As a** learner,  
**I want to** select up to two CEFR levels (maximum 2, choosing 1 or 2 levels) from `A1, A2, B1, B2, C1, C2`,  
**So that** the AI generates calibrated elevated versions of my speech corresponding to my chosen targets.

#### Acceptance Criteria:
- **AC3.1**: The UI presents 6 interactive level pills: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
- **AC3.2**: The user can select **maximum 2 levels** (selecting 1 level is valid, selecting 2 levels is valid).
- **AC3.3**: Selecting a 3rd level automatically deselects the earliest selected level to strictly enforce the maximum 2 limit.
- **AC3.4**: If 0 levels are selected, the "Improve with AI" (Améliorer avec l'IA) button remains disabled with a clear hint (e.g. *"Sélectionnez au moins 1 niveau (maximum 2)"*).
- **AC3.5**: Default selection is intelligently initialized to `[B1, B2]`. Users may deselect one to focus exclusively on a single level (e.g. `[B2]`).

---

### User Story 4: AI Speech Improvement & Comparative Elevation (Priority: P1 - MVP)
**As a** learner,  
**I want to** click "Improve with AI" and view side-by-side or tabbed comparative rewrites of my speech for the two chosen CEFR levels,  
**So that** I understand concrete lexical, syntactic, and discourse-level progressions.

#### Acceptance Criteria:
- **AC4.1**: Clicking "Améliorer avec l'IA" triggers the `PracticeElevationEngine`.
- **AC4.2**: The elevation view presents 3 comparative columns / tabs:
  1. **Transcription Originale** (User's verbatim speech).
  2. **Version Niveau 1** (e.g. B1: clear simple sentences, basic connectors, correct everyday vocabulary).
  3. **Version Niveau 2** (e.g. B2: nuanced connectors, nominalization, subjunctive triggers, thematic collocations).
- **AC4.3**: Each elevated version highlights:
  - **Lexical upgrades** (e.g. *"c'est un bon point"* → B2: *"cet aspect s'avère particulièrement probant"*).
  - **Syntactic transitions** (e.g. simple juxtaposed clauses → subordinated / concessive clauses).
  - **Pedagogical commentary** explaining the exact criteria that elevate the text from Level 1 to Level 2.
- **AC4.4**: Commentary is localized in the candidate's chosen language (FR, EN, ZH, VI).

---

### User Story 5: Auditory Shadowing & Voice Playback (Priority: P2)
**As a** learner,  
**I want to** listen to the elevated versions read aloud by the AI Voice Synthesizer,  
**So that** I can practice oral repetition, intonation, and speech shadowing.

#### Acceptance Criteria:
- **AC5.1**: Each elevated text card includes a `🔊 Écouter (Shadowing)` button.
- **AC5.2**: Clicking the button utilizes `VoiceSynthesizer` to synthesize the French text with natural pacing (rate: ~0.95x for A1–B1, ~1.0x for B2–C2).
- **AC5.3**: While playing, the button toggles to `⏸️ Pause` / `⏹️ Arrêter`, and the active reading text is visually highlighted.

---

## 4. Technical Specifications & Architecture

### 4.1 Component Breakdown
```
src/
├── core/
│   ├── practice/
│   │   ├── PracticeElevationEngine.js     # CEFR-calibrated speech transformation & rule heuristics
│   │   └── CefrLevelDefinitions.js        # Rubric & linguistic constraints for A1, A2, B1, B2, C1, C2
│   └── ...
├── ui/
│   ├── components/
│   │   ├── ModeSwitcher.js                # Header toggle: Exam Mode vs Practice Mode
│   │   ├── CefrDualLevelPicker.js         # Interactive selector for exactly 2 CEFR levels
│   │   ├── PracticeRecordingConsole.js    # Voice capture, live waveform, transcript editor
│   │   └── ElevationComparisonCard.js     # Side-by-side original vs Level 1 vs Level 2 cards
│   └── views/
│       └── PracticeView.js                # Main view orchestrating the Practice workflow
```

### 4.2 CEFR Progression Matrix (Heuristics Engine)
| Level | Syntax Complexity | Connectors | Lexical Register |
|---|---|---|---|
| **A1** | Simple SVO sentences, present tense | `et`, `mais`, `parce que` | Basic everyday survival words |
| **A2** | Coordinate clauses, passé composé, futur proche | `d'abord`, `ensuite`, `puis` | Common routine vocabulary |
| **B1** | Relative clauses (`qui`, `que`, `dont`), conditionnel | `donc`, `cependant`, `grâce à` | Varied personal opinion expressions |
| **B2** | Subjunctive, nominalization, passive/pronominal | `bien que`, `en revanche`, `ainsi que` | Abstract thematic B2 debate collocations |
| **C1** | Stylistic inversions, complex hypotheses, participles | `nonobstant`, `force est de constater`, `dès lors` | Nuanced academic & rhetorical French |
| **C2** | Literary nuances, idiomatic irony, effortless mastery | `quand bien même`, `pour peu que` | Sophisticated, highly idiomatic discourse |

---

## 5. Non-Functional & Quality Constraints

1. **Constitution Compliance (Principle I & III)**:
   - `PracticeElevationEngine` MUST be completely decoupled from DOM components and covered by standalone unit tests (`tests/unit/PracticeElevationEngine.test.js`).
   - Mock audio and transcript testing MUST be supported headlessly.
2. **Performance**:
   - Local AI elevation heuristics MUST compute and render in `< 300ms`.
   - Mode switching MUST execute instantly (`< 50ms`) without page reloads.
3. **Pure Modern Vanilla Architecture**:
   - Zero external npm runtime dependencies.
   - Pure Vanilla CSS variables and responsive glassmorphic cards.
4. **Multilingual Parity**:
   - All Practice Mode labels, buttons, and elevation commentary MUST be translated in `fr.js`, `en.js`, `zh.js`, and `vi.js`.

---

## 6. Verification & Acceptance Test Suite

1. **Unit Tests**:
   - `CefrDualLevelPicker.test.js`: Validates selection of exactly 2 levels; enforcement of limit.
   - `PracticeElevationEngine.test.js`: Validates level-specific text transformations across all level pairs (e.g. A2->B1, B1->B2, B2->C1).
2. **Integration Tests**:
   - `PracticeModeFlow.test.js`: Full cycle: enter Practice Mode -> record voice transcript -> select 2 levels -> generate elevation -> trigger TTS audio.
