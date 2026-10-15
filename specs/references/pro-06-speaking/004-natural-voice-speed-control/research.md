# Technical Research: Natural Voice Synthesis & Auditory Speed Control

**Feature**: `004-natural-voice-speed-control` | **Date**: 2026-09-28

---

## 1. Web Speech Synthesis Voice Ecosystem across Browsers

### 1.1 Voice Quality Tiers by Platform
Browser-provided text-to-speech voices vary significantly:

| Platform / Browser | Top French Voice Identifiers | Quality Profile | Asynchronous Loading |
|---|---|---|---|
| **Microsoft Edge (Windows/macOS)** | `Microsoft Denise Online (Natural) - French (France)`, `Microsoft Henri Online (Natural)` | **Ultra-Natural (Neural)**: Extremely fluent, human-like cadence, realistic breathing pauses | Emits `voiceschanged` shortly after page initialization |
| **Google Chrome (Desktop/Android)** | `Google français`, `fr-FR` network-backed voice | **High-Fidelity**: Clear, natural pronunciation, good liaison handling | Loaded asynchronously; `getVoices()` initially empty |
| **macOS / iOS Safari** | `Thomas (Enhanced)`, `Audrey (Enhanced)`, `Amelie` | **High-Fidelity**: Native Apple neural TTS engines | Pre-installed or on-demand download |
| **Mozilla Firefox** | OS native SAPI / speech-dispatcher voices | **Standard**: Varies by OS configuration | Loaded synchronously or on demand |

### 1.2 The Asynchronous Loading Pitfall
In Chromium and WebKit browsers, calling `window.speechSynthesis.getVoices()` synchronously during page load returns an empty array `[]`.
- **Solution**:
  1. Bind `window.speechSynthesis.onvoiceschanged`.
  2. Cache the ranked voice list upon the first `voiceschanged` event.
  3. Re-verify the active voice immediately before invoking `synth.speak(...)`.

---

## 2. Natural Voice Prioritization Heuristic

We classify voices into 4 priority bands based on regular expression testing on voice `name` and `voiceURI`:

```javascript
const VOICE_RANKING_PATTERNS = [
  // Tier 1: Modern Neural / Cloud-Natural voices (Edge Online Natural, Azure, Neural)
  { tier: 1, regex: /(online.*natural|natural.*french|neural)/i },
  
  // Tier 2: Enhanced platform engines (Google français, Apple Enhanced)
  { tier: 2, regex: /(google\s*français|enhanced|thomas|audrey|amelie|denise|henri)/i },
  
  // Tier 3: Standard designated French voices
  { tier: 3, regex: /^fr[-_]fr$/i },
  
  // Tier 4: Regional French (Canada, Belgium, Switzerland)
  { tier: 4, regex: /^fr/i }
];
```

---

## 3. Speed Rate Scaling & Browser Rate Limits

The W3C Web Speech API standard specifies `rate` as a float between `0.1` and `10.0`, with `1.0` as normal speed.
- However, rates outside `0.5` to `2.0` sound heavily distorted or cause audio buffer glitches on certain sound cards.
- Pedagogical optimum for language learning:
  - `0.75x`: Articulatory decomposition (phonetic shadowing for difficult liaisons and nasal sounds).
  - `0.90x`: Mildly relaxed pace for A2/B1 candidates.
  - `1.00x`: Native standard conversation rate for DELF B2.
  - `1.20x`: High-speed debate fluency training for DALF C1/C2.

---

## 4. State Persistence & Audio Lifecycle Management

1. **Storage Schema**:
   - `delf_speaking_tts_speed`: float string (`"0.75"`, `"0.90"`, `"1.0"`, `"1.2"`), default `"1.0"`.
   - `delf_speaking_tts_voice_uri`: string identifier (e.g., `"Microsoft Denise Online (Natural) - French (France)"`).
2. **Audio Cancellation Integrity**:
   - Starting a new audio playback automatically invokes `speechSynthesis.cancel()` or `VoiceSynthesizer.stop()`.
   - Closing modals, switching tabs, or clicking "Retry" calls `destroy()` / `stop()` immediately.
