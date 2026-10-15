# Implementation Tasks: Natural AI Voice Synthesis & Auditory Speed Control

**Feature**: `004-natural-voice-speed-control` | **Branch**: `004-natural-voice-speed-control`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Setup & Data Fixtures

**Purpose**: Establish speed presets, target audience mappings, CSS styling tokens, and local storage helpers.

- [X] T001 Create speed preset definitions and local storage persistence helpers (`SPEED_PRESETS`, `getSavedSpeed`, `saveSpeed`, `getSavedVoiceURI`, `saveVoiceURI`) in `src/core/speech/voicePresets.js`
- [X] T002 Add styling for speed controller pill buttons, active state glow, and compact layout in `src/ui/styles/practice.css`

---

## Phase 2: Foundational Core Engine (`VoiceSynthesizer.js`)

**Purpose**: Multi-tier natural voice ranking heuristic, asynchronous voice discovery, and speed rate clamping.

> **CRITICAL**: Core synthesizer enhancements must pass unit tests before UI integration.

- [X] T003 [P] Unit tests for natural voice ranking heuristic, speed clamping (`0.5x`–`2.0x`), and voice selection in `tests/unit/VoiceSynthesizer.test.js`
- [X] T004 Upgrade `src/core/speech/VoiceSynthesizer.js` with intelligent natural French voice ranking heuristic (Tier 1 Neural/Online Natural, Tier 2 Enhanced, Tier 3 Standard), `getAvailableFrenchVoices()`, and `setVoiceURI()`
- [X] T005 Support safe rate bounds clamping and active utterance cancellation on parameter change in `src/core/speech/VoiceSynthesizer.js`

**Checkpoint**: Core voice synthesis ranking and speed clamping verified against unit tests.

---

## Phase 3: User Story 2 & 3 - Auditory Speed Control UI in Practice Mode (Priority: P1) 🎯 MVP

**Goal**: Provide interactive speed selector pills (`0.75x`, `0.9x`, `1.0x`, `1.2x`) integrated into `ElevationComparisonCard.js` adjacent to the "🔊 Écouter" button.

**Independent Test**: Load an elevated speech card in Practice Mode; click `0.75x` and listen to slow-articulation speech; click `1.2x` and listen to rapid speech; refresh the page and verify speed preference persists.

### Tests for User Stories 2 & 3 🧪
- [X] T006 [P] [US2] Unit test for `SpeechSpeedController` component validating rate changes and localStorage persistence in `tests/unit/SpeechSpeedController.test.js`

### Implementation for User Stories 2 & 3
- [X] T007 [P] [US2] Implement `SpeechSpeedController` component with interactive segmented speed pills (`0.75x`, `0.9x`, `1.0x`, `1.2x`) and persistent change listener in `src/ui/components/SpeechSpeedController.js`
- [X] T008 [US3] Integrate `SpeechSpeedController` into `src/ui/components/ElevationComparisonCard.js` adjacent to the "🔊 Écouter" button on both Palier 1 and Palier 2 elevation cards

---

## Phase 4: User Story 1 & 4 - Natural Voice Timbre Selection (Priority: P2)

**Goal**: Allow candidates to view and choose between available natural French voices (e.g. Natural Female vs Natural Male) with instant audition.

**Independent Test**: Open voice selector, select a different French natural voice, click audition, and verify speech plays with the selected voice timbre.

### Implementation for User Story 4
- [X] T009 [US4] Add optional voice selector dropdown in `src/ui/components/ElevationComparisonCard.js` allowing users to toggle between available natural French voices

---

## Phase 5: User Story 5 - Multilingual Localization (Priority: P2)

**Goal**: Full localization of speed labels, badges, and tooltips across French, English, Chinese, and Vietnamese.

- [X] T010 [P] [US5] Add speed control translation keys to French dictionary in `src/core/i18n/locales/fr.js`
- [X] T011 [P] [US5] Add speed control translation keys to English dictionary in `src/core/i18n/locales/en.js`
- [X] T012 [P] [US5] Add speed control translation keys to Chinese dictionary in `src/core/i18n/locales/zh.js`
- [X] T013 [P] [US5] Add speed control translation keys to Vietnamese dictionary in `src/core/i18n/locales/vi.js`

---

## Phase 6: Integration Testing & Verification

**Goal**: End-to-end automated integration testing and browser validation.

- [X] T014 [P] Update integration test suite in `tests/integration/PracticeModeFlow.test.js` to verify auditory shadowing with custom playback speeds (`0.75x`, `1.0x`, `1.2x`) and multilingual labels
- [X] T015 Run complete automated test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`) and ensure 100% passing tests
