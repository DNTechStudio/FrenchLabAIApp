# Feature Specification: 008 — High-Fidelity AI Neural TTS Voice Engine for Dictation Mode

**Feature Branch**: `008-ai-neural-tts`  
**Created**: 2026-09-25  
**Status**: Draft  
**Input**: User request: `"/specify install voice option: Cách 2: Tích hợp AI Neural TTS Cao cấp (Chuẩn bản xứ 100% như người thật)"`

---

## 1. Overview & Pedagogical Rationale

In **Interactive French Dictation Mode** (« Mode Dictée »), candidate success depends profoundly on listening to authentic French phonetic subtleties:
- **Phonetic liaison and enchaînement** (*les_arbres*, *un_ami*, *nous_avons*).
- **Subtle vowel distinctions and nasal sounds** (*an* vs *on* vs *in*, *é* vs *è*, *du* vs *doux*).
- **Natural sentence cadence and prosody** (*groupe rythmique*, expressive question/imperative intonation).

While the native browser Web Speech API (`Google français`) provides an immediate, offline-ready fallback, its robotic rhythm and mechanical cadence cannot replicate the expressive richness, emotional depth, and native diction required for rigorous **DELF B2 / DALF C1-C2** examination preparation.

This feature integrates a **High-Fidelity AI Neural TTS Voice Engine** into DELF-DALF Lab Writing:
1. **Studio-Grade Neural French Voices**: Access to cutting-edge neural speech models (Google Cloud Neural2 / Studio / Journey voices and OpenAI TTS) delivering 100% native French diction with realistic breath, intonation, and flawless liaisons.
2. **Flexible Provider Selection in Settings**:
   - **Google Cloud TTS / Gemini Audio**: `fr-FR-Neural2-A` (Féminin - Doux & Expressif), `fr-FR-Neural2-B` (Masculin - Articulé), `fr-FR-Studio-B` (Studio de radiodiffusion), `fr-FR-Journey-F` (Conversationnel naturel).
   - **OpenAI TTS**: `tts-1` / `tts-1-hd` with expressive French timbre (`nova`, `onyx`, `alloy`).
   - **Navigateur Web Speech (Local)**: Preserved as a 100% free, zero-network fallback.
3. **Smart Audio Pre-Caching & Zero-Lag Replay**: Audio segments generated via neural API are cached in-memory/blob store, ensuring instant replaying on `Ctrl + Space` without redundant network roundtrips or API cost.
4. **Resilient Dual-Engine Fallback**: In the absence of an API key, during quota exhaustion, or upon network failure, the audio service seamlessly downgrades to the local browser speech synthesizer with zero learner interruption.

---

## 2. User Scenarios & Acceptance Criteria

### User Story 1 - Configure High-Fidelity AI Voice in Settings (Priority: P1) 🎯 MVP

As a French learner preparing for DELF-DALF exams, I want to choose a high-fidelity AI Neural voice in the settings modal and input my API key, so that my dictations sound like authentic native French speakers.

**Why this priority**: Empowers learners to unlock human-grade audio quality directly using their existing AI API keys.

**Independent Test**: Open Settings Modal → Go to « Voix de la Dictée (TTS) » → Select « Google Cloud Neural TTS » → Pick `fr-FR-Neural2-A` → Click « 🔊 Tester la voix » → Hear high-fidelity French speech test utterance.

**Acceptance Scenarios**:
1. **Given** the candidate opens the Settings Modal (`Paramètres IA`), **When** they view the new **« Voix de la Dictée (TTS) »** section, **Then** they can choose between:
   - `Navigateur Web Speech (Hors-ligne & Gratuit)`
   - `Google Cloud TTS Neural2 (Haute Fidélité)`
   - `OpenAI TTS (Voix Expressive)`
2. **Given** a Neural TTS provider is selected, **When** the candidate views the voice dropdown, **Then** appropriate native French voices are listed with descriptive timbre labels (e.g., `fr-FR-Neural2-A - Féminin (Naturel)`, `fr-FR-Studio-B - Studio (Haute Clarté)`).
3. **Given** an API key is entered, **When** the user clicks **« 🔊 Tester »**, **Then** a short French audio sample (*"Bonjour, voici un aperçu de ma voix pour votre dictée DELF."*) is synthesized and played.
4. **Given** the user saves settings, **Then** the voice provider, selected voice ID, and TTS credentials persist in `localStorage` under `delf_b2_storage_v1`.

---

### User Story 2 - Crystal-Clear Sentence & Full-Text Neural Dictation (Priority: P1) 🎯 MVP

As a candidate doing a dictation exercise, I want the « ▶ Écouter » and « 🔁 Réécouter » controls to play the high-fidelity neural audio for the active sentence, so that I can transcribe with maximum clarity.

**Why this priority**: The core dictation training loop; delivers immediate perceptible improvement in learner listening comfort.

**Independent Test**: Navigate to Mode Dictée with Neural TTS enabled, click « Écouter », verify the audio playback uses the neural audio stream rather than robotic browser TTS.

**Acceptance Scenarios**:
1. **Given** Neural TTS is configured with a valid API key, **When** the candidate clicks **« ▶ Écouter »** or **« 🔁 Réécouter »** (`Ctrl + Space`), **Then** the application streams or generates audio via the selected neural voice.
2. **Given** a sentence has been fetched once, **When** the candidate clicks **« 🔁 Réécouter »** (`Ctrl + Space`) or navigates back with `Ctrl + ←`, **Then** the cached audio blob plays instantaneously without making a new API request.
3. **Given** the candidate changes the speed selector (`0.75x` or `1.0x`), **Then** audio playback rate adjusts accordingly without audio distortion.
4. **Given** audio is currently playing, **When** the user clicks **« ⏸ Pause »**, **Then** audio playback pauses immediately; clicking **« ▶ Écouter »** resumes from the paused position.

---

### User Story 3 - Graceful Offline & Quota Fallback (Priority: P2)

As a candidate with unstable internet or depleted API quota, I want the application to automatically fall back to local browser speech synthesis without throwing modal errors, so that my study session is never interrupted.

**Why this priority**: Preserves Constitution Principle V (Offline Resilience & Zero Data Loss).

**Independent Test**: Simulate an API network error or invalid API key while playing dictation; verify audio still plays via `window.speechSynthesis` and a subtle non-blocking notification is displayed.

**Acceptance Scenarios**:
1. **Given** the candidate has selected Neural TTS but enters no API key or network is disconnected, **When** they trigger dictation playback, **Then** the application automatically uses local browser `SpeechSynthesis` (`fr-FR`) without throwing an unhandled exception.
2. **Given** an API call returns a 429 (quota exceeded) or 401 (invalid key), **Then** a discreet toast/notice alerts the user (*"Voix IA indisponible, bascule temporaire sur la voix locale"*), and playback continues via local voice.

---

### User Story 4 - Voice Engine Badge in Dictation Toolbar (Priority: P3)

As a candidate, I want to clearly see which voice engine is currently active in the dictation toolbar, so that I am aware of whether I am practicing with Neural Studio quality or local browser audio.

**Why this priority**: UX clarity and transparency.

**Acceptance Scenarios**:
1. **Given** the candidate is in Mode Dictée, **When** viewing the audio control header, **Then** a small voice indicator badge is visible (e.g., `🎙️ Neural2-A (IA)` or `🎙️ Local (Web Speech)`).
2. **Given** the candidate clicks on this badge, **Then** the Settings Modal opens directly focused on the TTS voice configuration.

---

## 3. Data Model & Architecture

### 3.1. Extended Settings Configuration (`UserSettings`)
```typescript
export interface UserSettings {
  provider: 'mock' | 'gemini';
  theme: 'dark' | 'light';
  language: 'fr' | 'en' | 'zh' | 'vi';
  selectedLevels: string[];
  apiKey?: string;
  // New TTS Voice Engine Configuration
  ttsConfig?: {
    engine: 'webspeech' | 'google-cloud' | 'openai';
    voiceId: string;       // e.g. 'fr-FR-Neural2-A', 'fr-FR-Studio-B', 'nova'
    googleApiKey?: string; // Optional separate key, or defaults to settings.apiKey
    openaiApiKey?: string;
    speed: number;         // 0.75 | 1.0
  };
}
```

### 3.2. French Neural Voice Catalog
```typescript
export interface FrenchVoiceDescriptor {
  id: string;
  name: string;
  gender: 'female' | 'male';
  provider: 'webspeech' | 'google-cloud' | 'openai';
  styleBadge: string; // e.g. 'Studio Pro', 'Naturel', 'Conversationnel'
  description: string;
}

export const FRENCH_VOICE_CATALOG: FrenchVoiceDescriptor[] = [
  // Local Web Speech
  { id: 'webspeech-default', name: 'Navigateur Web Speech', gender: 'female', provider: 'webspeech', styleBadge: 'Hors-ligne', description: 'Synthèse vocale intégrée au navigateur (Gratuit)' },
  // Google Cloud Neural TTS
  { id: 'fr-FR-Neural2-A', name: 'Élise (Neural2-A)', gender: 'female', provider: 'google-cloud', styleBadge: 'Naturel ✨', description: 'Voix féminine fluide, intonation riche et naturelle' },
  { id: 'fr-FR-Neural2-B', name: 'Julien (Neural2-B)', gender: 'male', provider: 'google-cloud', styleBadge: 'Posé 🎙️', description: 'Voix masculine articulée, débit clair pour la dictée' },
  { id: 'fr-FR-Studio-B', name: 'Claire (Studio-B)', gender: 'female', provider: 'google-cloud', styleBadge: 'Studio 🌟', description: 'Qualité radiodiffusion, liaisons parfaites et diction irréprochable' },
  { id: 'fr-FR-Journey-F', name: 'Antoine (Journey-F)', gender: 'male', provider: 'google-cloud', styleBadge: 'Expressif 🔥', description: 'Modèle nouvelle génération avec prosodie conversationnelle' },
  // OpenAI TTS
  { id: 'nova', name: 'Nova (OpenAI)', gender: 'female', provider: 'openai', styleBadge: 'Chaleureux 🎧', description: 'Voix naturelle, chaleureuse et captivante' },
  { id: 'onyx', name: 'Onyx (OpenAI)', gender: 'male', provider: 'openai', styleBadge: 'Profond 🎩', description: 'Voix masculine posée et réconfortante' },
];
```

### 3.3. Audio Cache Strategy
- Key: `${provider}_${voiceId}_${speed}_${hash(sentenceText)}`
- Storage: In-memory `Map<string, string>` containing `blob:` or `data:audio/mp3;base64` object URLs.
- Lifetime: Active session (with automatic cleanup on page unload to prevent memory leaks).

---

## 4. Quality Gates & Verification Contracts

1. **Gate 1 - Automated Test Suite**:
   - `node tests/run-all-tests.mjs` must test:
     - Voice catalog integrity and valid identifiers.
     - Audio caching logic (retrieval and hit count).
     - Fallback dispatch logic when network or credentials fail.
     - Standalone distribution parity (`standalone.html`).
2. **Gate 2 - Constitution Compliance**:
   - Principle II (Learner Delight): Zero latency audio replaying on `Ctrl + Space`.
   - Principle IV (Domain Separation): Modular `SpeechSynthesisService` decoupled from React components.
   - Principle V (Offline Resilience): Seamless fallback to browser voice if offline.
3. **Gate 3 - Visual & Audio Ergonomics**:
   - Browser subagent test verifying audio playback, voice preview in settings modal, and voice badge in dictation header.
