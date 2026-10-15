# Feature Specification: Natural AI Voice Synthesis & Auditory Speed Control

**Feature Identifier**: `004-natural-voice-speed-control`  
**Status**: Draft / Proposed  
**Constitution Compliance**: v1.0.1  
**Target Delivery**: DELF-DALF Lab Speaking v1.3.0  

---

## 1. Executive Summary & Problem Statement

### 1.1 Context
In both **Test Mode** (examiner-led debate questions) and **Practice Mode** (auditory shadowing of AI-elevated A1–C2 speeches), the application uses text-to-speech (TTS) to provide acoustic models for candidates. 

### 1.2 Problem
1. **Robotic Default Voices**: Standard browser speech synthesis engines on certain platforms default to robotic or low-quality synthesis voices when multiple high-fidelity neural/natural voices are available on the operating system or browser (such as Microsoft Online Natural French voices on Edge/Chrome, Google Français, or Apple Enhanced French voices). This damages immersion and provides poor prosodic models for DELF/DALF oral exam candidates.
2. **Lack of Speed Flexibility**: Learners at different stages of CEFR preparation require different auditory playback speeds:
   - Beginners (A1–B1) require a slower speed (`0.75x` or `0.85x`) to clearly distinguish French liaisons, silent letters, and nasal vowels (`on`, `an`, `in`, `un`).
   - Intermediate/Advanced learners (B2–C2) require native conversational speed (`1.0x` to `1.2x`) to train for rapid real-time comprehension and spontaneous shadowing.
   - Currently, playback rate is fixed to an internal constant without user control.

### 1.3 Solution
1. **Natural AI Voice Prioritization & Selection**:
   - Upgrade `VoiceSynthesizer` to automatically scan and prioritize modern natural/neural French voices (`Natural`, `Online`, `Neural`, `Google français`, `Enhanced`, `Thomas`, `Audrey`, `Denise`, `Henri`).
   - Provide an optional **Voice Selector dropdown** in the audio controls enabling the user to choose their preferred voice timbre (e.g. Natural Female vs Natural Male voice).
2. **Interactive Playback Speed Control**:
   - Provide explicit, responsive speed selection controls (`0.75x`, `0.9x`, `1.0x`, `1.2x`) directly integrated into:
     - The **Elevation Comparison Card** (Practice Mode auditory shadowing).
     - The **Debate Phase** question replay (Test Mode).
   - Persist user speed preferences in `localStorage` (`delf_speaking_tts_speed`).
   - Dynamically adjust speech rate without interrupting the overall examination or practice flow.

---

## 2. User Personas & Scenarios

### Persona 1: Jean (B1 Learner Needing Phonic Clarity)
- *Goal*: Listening to the B1 elevated version of his speech to practice shadowing.
- *Need*: Selects `0.75x` playback speed so he can clearly dissect liaisons and articulation of new connectors (`à mon avis`, `cependant`).

### Persona 2: Clara (B2/C1 Candidate Training for Native Flow)
- *Goal*: Preparing for the fast-paced DELF B2 debate phase and DALF C1 argumentation.
- *Need*: Prefers a natural, high-fidelity neural voice sounding like an authentic French examiner at `1.0x` or `1.1x` speed to test her instant comprehension.

---

## 3. User Stories & Acceptance Criteria

### User Story 1: Natural French Voice Prioritization (Priority: P1 - MVP)
**As a** language candidate,  
**I want** the app to automatically detect and select the most natural, human-sounding French voice available in my browser,  
**So that** my listening comprehension and shadowing practice reflect authentic French prosody.

#### Acceptance Criteria:
- **AC1.1**: `VoiceSynthesizer` queries `speechSynthesis.getVoices()` with an intelligent heuristic ranking:
  1. Tier 1 (Ultra-Natural): Names containing `'Natural'`, `'Online (Natural)'`, `'Neural'` for `fr-FR` or `fr-*`.
  2. Tier 2 (High-Fidelity Platform): `'Google français'`, Apple `'Thomas (Enhanced)'`, `'Audrey'`, `'Aurelie'`.
  3. Tier 3 (Standard System French): Any voice with `lang.startsWith('fr')`.
- **AC1.2**: If voices are loaded asynchronously by the browser (`voiceschanged` event), the synthesizer updates its preferred voice dynamically without requiring a page reload.
- **AC1.3**: The synthesized speech maintains pitch and prosody without distortion.

---

### User Story 2: Interactive Playback Speed Controls (Priority: P1 - MVP)
**As a** learner,  
**I want to** adjust the speaking speed of the AI audio playback between `0.75x` and `1.25x`,  
**So that** I can slow down complex vocabulary or speed up for native-pace challenge.

#### Acceptance Criteria:
- **AC2.1**: A speed selector control is rendered adjacent to the "🔊 Écouter" (Listen/Shadowing) button in Practice Mode.
- **AC2.2**: The selector offers standard preset speeds: `0.75x (Lent)`, `0.9x`, `1.0x (Normal)`, `1.2x (Rapide)`.
- **AC2.3**: Selecting a speed immediately applies to the next playback, or updates current speech if restarted.
- **AC2.4**: The chosen speed is persisted in `localStorage` (`delf_speaking_tts_speed`) and restored on page refresh.

---

### User Story 3: Auditory Shadowing Integration in Practice Mode (Priority: P1 - MVP)
**As a** candidate reviewing an AI-elevated speech card,  
**I want to** listen to the elevated French text at my chosen speed and stop it anytime,  
**So that** I can repeat each sentence aloud (shadowing technique).

#### Acceptance Criteria:
- **AC3.1**: Each elevation card (Palier 1 and Palier 2) includes an independent or synchronized speed selector.
- **AC3.2**: When clicking "🔊 Écouter", the button toggles to "⏹️ Arrêter", and the audio plays at the selected speed.
- **AC3.3**: Clicking "⏹️ Arrêter" instantly stops speech synthesis.
- **AC3.4**: When the text finishes reading, the button automatically resets to "🔊 Écouter".

---

### User Story 4: Voice Timbre Selection (Priority: P2)
**As a** candidate,  
**I want to** choose between different available French voices (e.g. Male vs Female, or specific voice persona),  
**So that** I can practice hearing different speaker accents and tones.

#### Acceptance Criteria:
- **AC4.1**: `VoiceSynthesizer` exposes `getAvailableFrenchVoices()` returning a filtered list of deduplicated French voices.
- **AC4.2**: The user can pick their preferred voice from a dropdown or modal settings.
- **AC4.3**: Selection persists in `localStorage` (`delf_speaking_tts_voice_uri`).
- **AC4.4**: If the saved voice is unavailable, it gracefully falls back to the top-ranked natural voice.

---

### User Story 5: Multilingual UI Support (Priority: P2)
**As an** international user (FR, EN, ZH, VI),  
**I want** the voice speed labels and tooltips to be translated into my selected interface language,  
**So that** I can comfortably configure my listening settings.

#### Acceptance Criteria:
- **AC5.1**: Translation keys added for all 4 supported languages (`fr`, `en`, `zh`, `vi`):
  - `practice.speed_label` ("Vitesse de lecture" / "Playback speed" / "语速" / "Tốc độ đọc")
  - `practice.speed_slow` ("0.75x (Lent)" / "0.75x (Slow)" / "0.75x (较慢)" / "0.75x (Chậm)")
  - `practice.speed_normal` ("1.0x (Normal)" / "1.0x (Normal)" / "1.0x (正常)" / "1.0x (Bình thường)")
  - `practice.speed_fast` ("1.2x (Rapide)" / "1.2x (Fast)" / "1.2x (较快)" / "1.2x (Nhanh)")
  - `practice.voice_label` ("Voix IA" / "AI Voice" / "AI 语音" / "Giọng đọc AI")

---

## 4. Technical Specifications & Architecture

### 4.1 Voice Priority Hierarchy
```javascript
const NATURAL_VOICE_PATTERNS = [
  /online.*natural/i,
  /natural/i,
  /neural/i,
  /google français/i,
  /enhanced/i,
  /thomas/i,
  /audrey/i,
  /amelie/i,
  /denise/i,
  /henri/i
];
```

### 4.2 Speed Multiplier Matrix
| Preset | Rate Value | CEFR Intended Audience | Pedagogical Goal |
|---|---|---|---|
| **0.75x** | `0.75` | A1, A2, early B1 | Phonetic decomposition, liaison study |
| **0.9x** | `0.90` | B1, B2 | Structured argumentation, comfortable shadowing |
| **1.0x** | `1.00` | B2, C1 | Standard conversational pace |
| **1.2x** | `1.20` | C1, C2 | Rapid debate rebuttal, fluency challenge |

---

## 5. Non-Functional Requirements & Resilience

1. **Zero External Latency / Offline-First**: Uses optimized client-side Web Speech Synthesis voices first, ensuring no network round-trips for audio synthesis.
2. **Audio Leak Prevention**: Switching views, clicking retry, or closing drawers MUST cancel any pending or active speech utterances.
3. **Accessibility**: All buttons and speed selectors MUST include proper `aria-label` attributes and keyboard focus outlines.
4. **Performance**: Voice query caching to avoid redundant `getVoices()` DOM sweeps.

---

## 6. Verification & Test Plan

1. **Unit Tests (`tests/unit/VoiceSynthesizer.test.js`)**:
   - Voice ranking algorithm selects highest-tier natural voice when multiple voices exist.
   - Speed rate validation (`0.5x` to `2.0x` bounds clamping).
   - Dynamic voice change listener subscription.
2. **Unit Tests (`tests/unit/ElevationComparisonCard.test.js` or component tests)**:
   - Speed selector renders with persisted speed preference.
   - Changing speed selector updates playback options.
3. **Integration Tests (`tests/integration/PracticeModeFlow.test.js`)**:
   - End-to-end verification of auditory shadowing with custom speed settings.
   - Multilingual labels verification across FR, EN, ZH, VI.
