# Tasks: Google Cloud Text-to-Speech Integration (004-google-cloud-tts)

**Input**: Design documents from `specs/004-google-cloud-tts/`  
**Prerequisites**: [spec.md](spec.md) (required), [plan.md](plan.md) (required)  
**Tests**: Automated tests in `tests/french-lab.test.js` (Test 19)  
**Target Platform**: Browser (Pure Vanilla JS ESM + HTML5 Audio / Web Audio)  

---

## Phase 1: Setup & Core Infrastructure

**Purpose**: Initialize service contracts and local storage interfaces for Google Cloud Text-to-Speech.

- [x] T001 [P] Define `GoogleCloudTtsService` skeleton and French voice catalog constants (`fr-FR-Neural2-A`, `fr-FR-Neural2-B`, `fr-FR-Studio-B`, `fr-FR-Journey-F`, `fr-FR-Wavenet-C`) in `src/core/speech/googleCloudTtsService.js`
- [x] T002 [P] Implement `getSavedGoogleApiKey()` and `saveGoogleApiKey(key)` storage helpers using `localStorage` in `src/core/speech/googleCloudTtsService.js`

**Checkpoint**: Core service skeleton and storage contracts ready.

---

## Phase 2: Foundational (Audio Caching & Engine Base)

**Purpose**: High-performance in-memory caching and base REST API client for Google Cloud TTS.

- [x] T003 Implement `AudioCacheManager` (in-memory Map with max 100 entries) to map `gcloud:${voiceId}:${rate}:${text}` to Blob Object URLs in `src/core/speech/googleCloudTtsService.js`
- [x] T004 Implement `synthesize({ text, voiceId, rate, apiKey })` sending `POST https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}` with base64 audio decoding in `src/core/speech/googleCloudTtsService.js`
- [x] T005 [P] Implement headless mock mode inside `googleCloudTtsService.js` for unit test environments where `fetch` or window audio is mocked

**Checkpoint**: Google Cloud audio synthesis and zero-cost caching engine operational.

---

## Phase 3: User Story 1 - Configuring API Key & Settings Modal (Priority: P1) 🎯 MVP

**Goal**: Users can enter, test, and save their Google Cloud / Gemini API key via a dedicated settings modal in Mode Dictée.

**Independent Test**: Opening the settings modal, entering an API key, clicking test voice, and verifying key persistence in `localStorage`.

- [x] T006 [US1] Add Settings button `⚙️` next to the Voice dropdown in `src/ui/DictationView.js`
- [x] T007 [US1] Implement `renderApiKeyModal()` with API key input, visibility toggle, test button, and save action in `src/ui/DictationView.js`
- [x] T008 [US1] Add CSS styles for `.btn-voice-settings`, `#voice-settings-modal-backdrop`, and modal inputs in `src/styles/dictation.css`
- [x] T009 [US1] Bind modal events: open, close, save API key, and test voice playback in `src/ui/DictationView.js`

**Checkpoint**: Users can configure and persist their Google Cloud API key directly from the UI.

---

## Phase 4: User Story 2 - Voice Selection & Dual-Engine Router (Priority: P1)

**Goal**: The Voice Selector dropdown dynamically groups Google Cloud AI voices (`Studio`, `Neural2`, `Journey`) and local Web Speech voices, automatically routing audio playback.

**Independent Test**: Selecting a Google Cloud voice from the dropdown, triggering playback, and verifying audio routes to Google Cloud TTS.

- [x] T010 [US2] Update `getFrenchVoices()` in `src/core/speech/speechSynthesizer.js` to combine both Google Cloud AI voices and local Web Speech voices with appropriate rank tiers
- [x] T011 [US2] Update `renderVoiceOptions()` in `src/ui/DictationView.js` to render `<optgroup label="✨ Google Cloud AI (Studio & Neural)">` and `<optgroup label="🗣️ Web Speech (Local & Hors-ligne)">`
- [x] T012 [US2] Update `setVoice(voiceId)` in `src/core/speech/speechSynthesizer.js` to persist active voice selection in `localStorage` (`frenchlab_dictation_voice`)

**Checkpoint**: Voice dropdown seamlessly displays and activates both Google Cloud and Web Speech voices.

---

## Phase 5: User Story 3 & 4 - Audio Playback, Controls & Shortcuts (Priority: P1)

**Goal**: Seamless Play, Pause, Resume, Replay, and sentence navigation (`Space`, `Ctrl+Space`, `Ctrl+←`, `Ctrl+→`) for Google Cloud audio.

**Independent Test**: Playing a Google Cloud sentence, pressing `Space` to pause and resume, pressing `Ctrl+Space` for instant cached replay, and pressing `Ctrl+→` to advance.

- [x] T013 [US3] Connect `SpeechSynthesizer.speakSentence()` to `googleCloudTtsService.synthesize()` when a Google Cloud voice is selected in `src/core/speech/speechSynthesizer.js`
- [x] T014 [US4] Manage HTML5 `Audio` element lifecycle in `speechSynthesizer.js` (`play()`, `pause()`, `currentTime` preservation for resume, and `ended` event)
- [x] T015 [US4] Synchronize UI button states (`updatePlayButtonUI`) for Google Cloud audio across `Écouter`, `⏸ Pause`, and `► Reprendre` in `src/ui/DictationView.js`
- [x] T016 [US4] Verify keyboard shortcuts (`Space`, `Ctrl+Space`, `Ctrl+←`, `Ctrl+→`) work identically for both Google Cloud audio and Web Speech

**Checkpoint**: Complete audio control workflow with zero-cost replay from cache and full shortcut support.

---

## Phase 6: Automated Testing & Verification

**Purpose**: Validate API payload construction, audio caching, and fallback behavior via automated test runner.

- [x] T017 Write Test 19 in `tests/french-lab.test.js` validating:
  - Google Cloud request payload formatting (`languageCode: 'fr-FR'`, `audioEncoding: 'MP3'`)
  - Audio cache hit on repeat playback (verifying 0 redundant network calls)
  - Automatic graceful fallback to Web Speech API when API key is missing
- [x] T018 Run test runner (`node tests/french-lab.test.js`) and ensure 19/19 tests PASS (100% green)
- [x] T019 End-to-end browser verification of the settings modal, voice selector grouping, and sentence audio playback

---

## Task Dependencies & Flow

```
[Phase 1: Setup] ──> [Phase 2: Audio Cache & Client] ──> [Phase 3: Settings Modal (US1)]
                                                          │
                                                          ▼
                                                    [Phase 4: Voice Dropdown (US2)]
                                                          │
                                                          ▼
                                                    [Phase 5: Playback & Shortcuts (US3/US4)]
                                                          │
                                                          ▼
                                                    [Phase 6: Automated Tests 19/19]
```
