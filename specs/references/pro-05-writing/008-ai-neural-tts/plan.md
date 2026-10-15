# Implementation Plan: 008 — High-Fidelity AI Neural TTS Voice Engine for Dictation Mode

**Branch**: `008-ai-neural-tts` | **Date**: 2026-09-25 | **Spec**: [specs/008-ai-neural-tts/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/008-ai-neural-tts/spec.md)

---

## 1. Summary

Upgrade the speech synthesis pipeline of **DELF-DALF Lab Writing** from standard browser speech synthesis (`Google français`) to an **AI Neural TTS Engine** delivering authentic native French speech with studio quality, expressive prosody, and natural liaisons:
1. **Multi-Provider Architecture**:
   - **Google Cloud Text-to-Speech API**: Neural2 and Studio French models (`fr-FR-Neural2-A`, `fr-FR-Neural2-B`, `fr-FR-Studio-B`, `fr-FR-Journey-F`).
   - **OpenAI TTS API**: High-expressivity models (`tts-1` / `tts-1-hd` with `nova`, `onyx`, `alloy`).
   - **Local Web Speech API**: Retained as 100% free, offline-ready fallback.
2. **In-Memory Audio Caching**: Caches synthesized audio blobs per sentence to guarantee instant, zero-latency replaying with `Ctrl + Space` without generating extra API cost.
3. **Settings Integration**: Dedicated configuration panel in `SettingsModal` (`Voix de la Dictée`) with voice preview button.
4. **Resilient Downgrade**: If an API key is missing or invalid, or when offline, automatically fallback to local voice synthesis without interrupting the candidate's dictation.
5. **Dual-Distribution Parity**: Full parity across React SPA and `standalone.html`.

---

## 2. Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022  
**Primary Dependencies**: React 18/19, Lucide Icons (`Volume2`, `Mic`, `Sparkles`, `Radio`, `CheckCircle2`)  
**Network APIs**:
- Google Cloud Text-to-Speech REST API (`https://texttospeech.googleapis.com/v1/text:synthesize?key=...`)
- OpenAI Audio Speech REST API (`https://api.openai.com/v1/audio/speech`)
- Browser `Audio` element / `window.speechSynthesis`  
**Storage**: `localStorage` (`delf_b2_storage_v1`) for voice preferences and keys  
**Testing**: `node:test` runner (`node tests/run-all-tests.mjs`)  

---

## 3. Constitution Gate Check

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Strict typing, single responsibility | Service-based architecture with `SpeechSynthesisService` dispatching to `NeuralTtsProvider` | **PASS** |
| **II. Exceptional UX & Learner Delight** | Zero data loss, human-grade voice | Studio-grade native French pronunciation; zero lag audio replay on `Ctrl + Space` | **PASS** |
| **III. Test-First & Automated Verification** | Automated tests before merge | Unit tests for voice catalogs, audio cache, and fallback mechanics | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decoupled audio logic | Audio services abstracted behind a clean uniform interface | **PASS** |
| **V. Performance & Offline Resilience** | Resilient offline fallback | Seamless automatic fallback to local Web Speech API when offline or unauthenticated | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## 4. Implementation Steps

1. **Step 1 - Domain Data & Voice Catalog**:
   - Define `FrenchVoiceDescriptor` and `FRENCH_VOICE_CATALOG` in `src/domain/constants.ts` and `standalone.html`.
   - Add multilingual translation strings for TTS settings (`ttsVoiceTitle`, `ttsVoiceEngine`, `ttsTestSample`, etc.) in all 4 languages (FR, EN, ZH, VI).
2. **Step 2 - SpeechSynthesisService Neural Support & Caching**:
   - Implement audio caching `Map<string, string>`.
   - Implement `speakNeural(text, voiceId, apiKey, rate)`.
   - Implement fallback handler when API call fails.
3. **Step 3 - UI Settings & Voice Selector**:
   - Add TTS voice configuration section to `SettingsModal.tsx` and `standalone.html`.
   - Add « 🔊 Tester la voix » preview button.
4. **Step 4 - Dictation Pane Voice Badge & Integration**:
   - Display active voice badge in `DictationPane.tsx` and `standalone.html`.
5. **Step 5 - Automated Tests & Browser Verification**:
   - Extend `tests/run-all-tests.mjs` with suite 12.
   - Run browser subagent verification.
