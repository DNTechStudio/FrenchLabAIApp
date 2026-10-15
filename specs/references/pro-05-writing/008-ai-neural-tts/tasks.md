# Task Breakdown: 008 — High-Fidelity AI Neural TTS Voice Engine for Dictation Mode

**Branch**: `008-ai-neural-tts` | **Date**: 2026-09-25 | **Spec**: [specs/008-ai-neural-tts/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/008-ai-neural-tts/spec.md) | **Plan**: [specs/008-ai-neural-tts/plan.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/008-ai-neural-tts/plan.md)

---

## Task List

- [ ] **Task 1: French Voice Catalog & Domain Types**
  - Define `FrenchVoiceDescriptor` and `FRENCH_VOICE_CATALOG` in `src/domain/constants.ts` (and standalone).
  - Include Google Cloud Neural2 (`fr-FR-Neural2-A`, `fr-FR-Neural2-B`), Studio (`fr-FR-Studio-B`), Journey (`fr-FR-Journey-F`), and OpenAI (`nova`, `onyx`).
  - Add TTS settings translations across FR, EN, ZH, VI in `src/domain/translations.ts`.

- [ ] **Task 2: Neural Speech Synthesis Engine with In-Memory Caching**
  - Implement `synthesizeGoogleCloudTTS(text, voiceId, apiKey, rate)` and `synthesizeOpenAITTS(text, voiceId, apiKey, rate)`.
  - Implement audio caching `Map<string, string>` keyed by voice and text.
  - Implement seamless fallback to local `window.speechSynthesis` on error/offline.
  - Expose `testVoiceSample(voiceId, apiKey)` for instant preview in settings.

- [ ] **Task 3: Settings Modal UI & Voice Customization**
  - Extend `SettingsModal.tsx` and `standalone.html` with **« Voix de la Dictée »** section.
  - Dropdown selecting voice engine: Local Web Speech vs Google Cloud Neural2 vs OpenAI.
  - Dropdown selecting specific French voice timbre.
  - API key inputs with secure storage in `localStorage`.
  - « 🔊 Tester » button to audition the voice before saving.

- [ ] **Task 4: Dictation Pane Voice Indicator Badge**
  - In `DictationPane.tsx` and `standalone.html`, show an active voice badge (e.g. `🎙️ Studio-B (IA)` or `🎙️ Local`).
  - Allow clicking the badge to open the voice settings modal directly.

- [ ] **Task 5: Parity, Automated Tests & Browser Verification**
  - Sync all logic and UI into `standalone.html`.
  - Add test suite 12 in `tests/run-all-tests.mjs` verifying:
    - Voice catalog validity and descriptors.
    - Caching mechanism and URL key generation.
    - Automatic fallback dispatch without unhandled errors.
  - Run `node tests/run-all-tests.mjs` ensuring 100% pass.
  - Verify UI and controls in the browser.
