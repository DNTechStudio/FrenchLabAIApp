# Implementation Plan: Google Cloud Text-to-Speech Integration (004-google-cloud-tts)

**Branch**: `004-google-cloud-tts` | **Date**: 2026-10-02 | **Spec**: [specs/004-google-cloud-tts/spec.md](spec.md)

---

## 1. Summary

This plan outlines the implementation of **Google Cloud Text-to-Speech** into the French Lab AI unified application.
It enables studio-quality French speech synthesis (`fr-FR-Neural2`, `fr-FR-Studio`, `fr-FR-Journey`) with:
1. **Unified Dual-Engine Audio Service**: Extends `SpeechSynthesizer` to dynamically route between Google Cloud TTS and browser-native Web Speech API.
2. **Smart Audio Cache**: Caches synthesized audio Blobs in an in-memory Map and local cache for zero-cost sentence replays.
3. **API Key & Voice Settings UI**: A sleek, dark-themed configuration modal accessible directly from the Top Bar.
4. **Seamless Keyboard & Playback Compatibility**: Ensures `Space`, `Ctrl+Space`, `Ctrl+Left`, and `Ctrl+Right` work identically with Google Cloud audio as they do with Web Speech.

---

## 2. Technical Context

- **Language/Version**: JavaScript (ESM, ECMAScript 2022, Node.js 18+ for test runner)
- **Dependencies**: Pure Vanilla JS + Web Audio/HTML5 Audio (zero external npm runtime dependencies)
- **External API**: Google Cloud Text-to-Speech REST API v1 (`https://texttospeech.googleapis.com/v1/text:synthesize`)
- **Storage**: `localStorage` (`frenchlab_google_api_key`, `frenchlab_tts_config`, `frenchlab_dictation_voice`)
- **Testing**: `node --test tests/french-lab.test.js` (unit tests for API payload construction, audio caching, and fallback)

---

## 3. Constitution Check

| Principle | Requirement | Compliance Status | Rationale |
|:---|:---|:---:|:---|
| **I. Sidebar-Workspace Architecture** | Persistent Left Sidebar; High-Fidelity Workspace Integration | **PASS** | Adds voice options to the existing Dictation top-bar without disrupting sidebar or navigation. |
| **II. Strict CEFR Alignment** | Authentic French prosody and phonetics A1-C2 | **PASS** | Google Cloud Studio and Neural2 voices provide authentic French liaisons and native rhythm. |
| **III. Test-First & Audio Mocking** | Headless testing; 100% test pass rate | **PASS** | API client is designed with headless mock fallbacks for CI/test environments. |
| **IV. Local Sovereignty & Offline Fallback** | Zero data loss; sovereign `localStorage`; offline resilience | **PASS** | Automatically falls back to local Web Speech API if offline or if no API key is provided. |
| **V. Premium Aesthetics & Pure Vanilla** | Visual Excellence matching design system | **PASS** | Config modal and voice selector use Midnight Indigo theme with glassmorphism styling. |

---

## 4. Architectural Component Design

### 4.1 Files to Create / Modify

1. **`src/core/speech/googleCloudTtsService.js` (NEW)**:
   - Encapsulates REST API calls to Google Cloud Text-to-Speech.
   - Handles audio base64 decoding, Blob URL creation, and in-memory LRU caching.
   - Provides `synthesize(text, options)` returning an audio URL and duration.

2. **`src/core/speech/speechSynthesizer.js` (UPDATE)**:
   - Integrates `googleCloudTtsService`.
   - Enhances `speakSentence()` to play via HTML5 Audio element when a Google Cloud voice is selected, while maintaining `isPaused`, `currentCharIndex`, and playback state.
   - Keeps `SpeechSynthesisUtterance` for local Web Speech voices.
   - Unifies `getFrenchVoices()` to include both Google Cloud Neural/Studio voices and local Web Speech voices.

3. **`src/ui/DictationView.js` (UPDATE)**:
   - Adds a Settings icon `⚙️` next to the Voice dropdown to open the API Key Modal.
   - Implements `renderApiKeyModal()` and event listeners for saving and testing the key.
   - Updates `renderVoiceOptions()` to group Google Cloud AI voices and Web Speech voices into `<optgroup>`s.

4. **`src/styles/dictation.css` (UPDATE)**:
   - Styles for the Settings button and API Key Configuration Modal.

5. **`tests/french-lab.test.js` (UPDATE)**:
   - Adds automated test 19 verifying Google Cloud TTS request payload formation, caching mechanism, and Web Speech fallback.

---

## 5. Implementation Phases

- **Phase 1**: Implement `googleCloudTtsService.js` with audio caching and mock test support.
- **Phase 2**: Update `speechSynthesizer.js` to support dual-engine audio playback (HTML5 Audio + WebSpeech).
- **Phase 3**: Update `DictationView.js` to render Google Cloud voices in the dropdown and add the API Key modal.
- **Phase 4**: Add automated test cases in `tests/french-lab.test.js` and verify full suite passes (19/19).
