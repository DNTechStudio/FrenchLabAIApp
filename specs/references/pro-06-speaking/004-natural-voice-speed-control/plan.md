# Implementation Plan: Natural AI Voice Synthesis & Auditory Speed Control

**Feature**: `004-natural-voice-speed-control` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

---

## 1. Summary

Implement natural-tier French voice prioritization and candidate-adjustable auditory playback speed controls across both **Practice Mode** (auditory shadowing of AI-elevated speeches) and **Test Mode** (examiner debate speech questions):
1. **Intelligent Natural French Voice Selector**: Update `VoiceSynthesizer` to automatically scan, rank, and select modern natural/neural French voices (`Online Natural`, `Neural`, `Google français`, `Enhanced`, `Thomas`, `Audrey`, `Denise`, `Henri`).
2. **Speed Controller Component & Presets**: Provide segmented controls for `0.75x (Lent)`, `0.9x`, `1.0x (Normal)`, `1.2x (Rapide)`.
3. **Auditory Shadowing Integration**: Embed speed selection directly into `ElevationComparisonCard.js` adjacent to the "🔊 Écouter" button.
4. **State Persistence**: Save user's preferred speed to `localStorage` (`delf_speaking_tts_speed`) so preferences survive reloads.
5. **Multilingual Localizations**: Translate speed labels and tooltips across French, English, Chinese, and Vietnamese.

---

## 2. Technical Context

- **Runtime**: Modern Native ES Modules (ES2022+ Strict Mode)
- **Dependencies**: Zero external npm runtime dependencies
- **Audio Engine**: Web Speech Synthesis API (`window.speechSynthesis`, `SpeechSynthesisUtterance`)
- **Persistence**: `localStorage` (`delf_speaking_tts_speed`, `delf_speaking_tts_voice_uri`)
- **Testing**: Node.js native test runner (`node:test`) with synthetic audio synthesis mocks
- **Target Browsers**: Google Chrome, Microsoft Edge, Safari, Firefox

---

## 3. Constitution Check (v1.0.1)

| Principle | Architectural Requirement | Status |
| :--- | :--- | :--- |
| **I. Library-First & Modular Audio Engine** | Voice ranking, speech rate calibration, and utterance lifecycle MUST remain in `VoiceSynthesizer.js`, decoupled from UI elements. | **PASS**: `VoiceSynthesizer` encapsulates voice prioritization, speed bounds checking (`0.5x`–`2.0x`), and lifecycle events (`onStart`, `onEnd`, `onError`). |
| **II. Strict CEFR Alignment & Deterministic Rubric** | Speed rates calibrated to CEFR pedagogical stages (slower for A1–B1 phonetics, standard for B2, fast for C1/C2). | **PASS**: Speeds `0.75x`, `0.9x`, `1.0x`, `1.2x` directly map to learner proficiency needs. |
| **III. Test-First & Audio Mocking (NON-NEGOTIABLE)** | Unit tests must verify voice ranking heuristics, speed bounds clamping, and callbacks without requiring real sound hardware. | **PASS**: Mockable synthesis interfaces in `tests/unit/VoiceSynthesizer.test.js`. |
| **IV. State Resilience & Fail-Safe Audio UX** | Chosen speed rate and voice preferences MUST persist in `localStorage` and gracefully fallback if unavailable. | **PASS**: Automated fallback hierarchy and storage recovery. |
| **V. Premium Aesthetics & Pure CSS Architecture** | Sleek glassmorphic segmented pills for speed selection matching app theme, pure CSS. | **PASS**: Styled with existing CSS design tokens without utility bloat. |

---

## 4. Planned Project Structure & Changes

```text
src/
├── core/
│   ├── speech/
│   │   ├── VoiceSynthesizer.js             # Add natural voice ranking heuristic, rate clamping, and voice getter
│   │   └── voicePresets.js                 # Speed preset definitions (0.75x, 0.9x, 1.0x, 1.2x)
│   └── i18n/locales/
│       ├── fr.js                           # Add speed and voice labels
│       ├── en.js                           # Add speed and voice labels
│       ├── zh.js                           # Add speed and voice labels
│       └── vi.js                           # Add speed and voice labels
├── ui/
│   ├── components/
│   │   └── ElevationComparisonCard.js      # Add speed selector pill group next to "🔊 Écouter"
│   └── styles/
│       └── practice.css                    # Add styling for speech speed selector pills
tests/
├── unit/
│   ├── VoiceSynthesizer.test.js            # Validate natural voice ranking & speed clamping
│   └── VoicePresets.test.js                # Validate speed presets and labels
└── integration/
    └── PracticeModeFlow.test.js            # Validate end-to-end auditory shadowing with custom speeds
```

---

## 5. Phase-by-Phase Execution Plan

### Phase 1: Core Engine Enhancement (`VoiceSynthesizer.js` & `voicePresets.js`)
- Implement `src/core/speech/voicePresets.js` with `SPEED_PRESETS` and storage helper (`getSavedSpeed()`, `saveSpeed(rate)`).
- Upgrade `src/core/speech/VoiceSynthesizer.js`:
  - Enhance `initVoices()` with multi-tier regular expression ranking prioritizing Neural/Natural voices.
  - Implement `getAvailableFrenchVoices()` returning prioritized candidates.
  - Clamp playback rate between `0.5` and `2.0` safely.
  - Support setting explicit `voiceURI`.
- Add unit tests in `tests/unit/VoiceSynthesizer.test.js`.

### Phase 2: Auditory Speed Control UI in Practice Mode (`ElevationComparisonCard.js`)
- Render compact speed selector pill buttons (`0.75x`, `0.9x`, `1.0x`, `1.2x`) next to the "🔊 Écouter" button on each elevation card.
- Synchronize active speed with `localStorage`.
- When candidate clicks "🔊 Écouter", pass the selected speed rate to `VoiceSynthesizer.speak(text, { rate })`.

### Phase 3: Test Mode Examiner Question Playback Speed (Optional Enhancements)
- Ensure debate view question playback inherits or supports preferred speech rate.

### Phase 4: Multilingual Localization
- Add keys in `fr.js`, `en.js`, `zh.js`, `vi.js`:
  - `practice.speed_label`, `practice.speed_slow`, `practice.speed_moderate`, `practice.speed_normal`, `practice.speed_fast`.

### Phase 5: Verification & End-to-End Testing
- Run full automated test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`).
- Verify manual audio shadowing across Chrome and Edge.
