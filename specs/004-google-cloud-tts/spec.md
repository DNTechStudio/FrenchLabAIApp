# Feature Specification: Google Cloud Text-to-Speech Integration

**Feature Branch**: `004-google-cloud-tts`  
**Created**: 2026-10-02  
**Status**: Specified & Aligned  

---

## 1. Overview & Vision

In **French Lab AI**, authentic French pronunciation, prosody, liaisons, and phonetic precision are paramount for learners preparing for DELF/DALF exams (A1 to C2).

While the browser-native **Web Speech API** provides zero-cost, offline dictation, its output quality varies drastically across operating systems and browsers (e.g. robotic voices on Windows Chrome, missing voices on Linux/Firefox).

This specification defines the integration of **Google Cloud Text-to-Speech (Neural2, Studio, Journey, and WaveNet)** as a premier, studio-grade speech engine for French Lab AI:
1. **Studio-Grade Neural Pronunciation**: Unlocks ultra-realistic French voices (`fr-FR-Neural2-A`, `fr-FR-Neural2-B`, `fr-FR-Studio-B`, `fr-FR-Journey-F`) with authentic French intonation and accurate phonetic liaisons.
2. **Unified API Key & Local Storage**: Users can configure their Google Cloud or Gemini API key directly in the app. The key is securely stored in client `localStorage` with zero server-side credential leakage.
3. **Zero-Latency In-Memory & IndexedDB Audio Caching**: Repeated sentences and dictation replays are cached automatically. Replaying a sentence incurs **0 API cost** and plays with **0ms network delay**.
4. **Seamless Dual-Engine Voice Selector**: The Voice Selector dropdown in Mode Dictée seamlessly unifies:
   - **Google Cloud AI Voices** (when API key is configured or active)
   - **Browser Web Speech Voices** (offline, free fallback)
5. **Full Dictation Controls Compatibility**: Full support for `Space` (Play/Pause/Resume), `Ctrl+Space` (Replay), and `Ctrl+←` / `Ctrl+→` (Navigate & auto-speak) across both engines.

---

## 2. Architecture & Voice Catalog

### 2.1 Google Cloud French Voice Catalog

| Voice ID | Display Name | Gender | Model Tier | Acoustic Character & DELF Use-Case |
| :--- | :--- | :---: | :---: | :--- |
| `fr-FR-Neural2-A` | Élise (Neural2-A) | 👩 Nữ | Neural2 | Giọng nữ trong trẻo, tự nhiên, nhịp điệu đàm thoại chuẩn mực |
| `fr-FR-Neural2-B` | Julien (Neural2-B) | 👨 Nam | Neural2 | Giọng nam đĩnh đạc, phát âm rõ ràng từng âm tiết, lý tưởng cho Dictée A1-B2 |
| `fr-FR-Studio-B` | Claire (Studio-B) | 👩 Nữ | Studio 🌟 | Giọng thu âm phát thanh chuẩn cao cấp, nối âm (*liaison*) hoàn hảo cho DALF C1-C2 |
| `fr-FR-Journey-F` | Antoine (Journey-F) | 👨 Nam | Journey 🔥 | Giọng nam giàu cảm xúc, ngữ điệu đối thoại tự nhiên như người bản xứ |
| `fr-FR-Wavenet-C` | Camille (WaveNet-C)| 👩 Nữ | WaveNet | Giọng DeepMind chuẩn mực, tốc độ ổn định |

### 2.2 Dual-Engine Routing Diagram

```
                             [ User presses Play / Space ]
                                           │
                                           ▼
                            ┌─────────────────────────────┐
                            │   Speech Engine Router      │
                            └──────────────┬──────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
      [ Engine: Google Cloud TTS ]                  [ Engine: Web Speech API ]
                    │                                             │
                    ▼                                             ▼
     ┌─────────────────────────────┐               ┌─────────────────────────────┐
     │ Check Audio Cache (Key/MD5) │               │ window.speechSynthesis      │
     └──────────────┬──────────────┘               │ (100% Offline, Free Fallback)│
                    │                              └─────────────────────────────┘
          ┌─────────┴─────────┐
          │ (Hit)             │ (Miss)
          ▼                   ▼
   [ Play from Cache ]  [ Call Google Cloud API ]
   (Zero Latency/Cost)  (POST /v1/text:synthesize)
                              │
                              ▼
                        [ Cache Audio ] ──> [ HTML5 Audio Playback ]
```

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 - Configuring Google Cloud API Key (Priority: P1)
**As a** learner or instructor wanting studio-quality French pronunciation,  
**I want to** paste my Google Cloud API key into an intuitive settings modal,  
**So that** the app unlocks the high-fidelity Google Cloud Neural2 and Studio voices.

**Acceptance Criteria**:
1. Clicking the Settings button or voice setup icon opens the **Configuration Voix & API** modal.
2. The user can enter a Google Cloud API Key (or reuse their Gemini API Key).
3. The key is validated with a **« 🔊 Tester la voix »** test phrase (*"Bonjour, voici un aperçu de ma voix pour votre dictée DELF-DALF."*).
4. The key is securely saved to `localStorage.getItem('frenchlab_google_api_key')`.
5. If the key is empty or invalid, the app gracefully falls back to Web Speech API without crashing.

---

### User Story 2 - Selecting Google Cloud Voice in Mode Dictée (Priority: P1)
**As a** candidate preparing for DALF C1/C2,  
**I want to** choose a Google Cloud voice (e.g. *Claire - Studio-B* or *Julien - Neural2-B*) from the Voice Selector dropdown,  
**So that** all dictation sentences are read with radio-broadcast clarity and authentic French liaisons.

**Acceptance Criteria**:
1. The **🎙️ Voix** dropdown in Mode Dictée groups voices into:
   - **Google Cloud AI (Studio & Neural)** (labeled with `🌟` and `✨`)
   - **Navigateur Web Speech** (labeled with `🗣️`)
2. Selecting a Google Cloud voice immediately sets it as active and persists the choice in `localStorage`.
3. The selected voice is used for all sentence playback (`Écouter`, `Suivant`, `Précédent`, `Réécouter`).

---

### User Story 3 - Instant Replay & Zero-Cost Audio Caching (Priority: P1)
**As a** student repeating a sentence multiple times,  
**I want** repeated listening (`Ctrl+Space` or `🔁 Réécouter`) to play instantly from local cache,  
**So that** audio playback is immediate (0ms delay) and consumes no additional API quota.

**Acceptance Criteria**:
1. When a sentence is synthesized via Google Cloud TTS, the synthesized audio buffer/URL is stored in an in-memory cache keyed by `voiceId:rate:text`.
2. Pressing `🔁 Réécouter` (or `Ctrl+Space`) plays the cached audio immediately without making a network request.
3. Audio memory cache supports up to 100 entries per session with least-recently-used eviction.

---

### User Story 4 - Full Play, Pause, Resume, and Shortcut Controls (Priority: P1)
**As a** dictation learner,  
**I want** `Space` to pause and resume Google Cloud audio, and `Ctrl+←`/`Ctrl+→` to navigate sentences,  
**So that** the playback experience feels as responsive and fluid as native audio.

**Acceptance Criteria**:
1. While Google Cloud audio is playing, pressing `Space` (or clicking `⏸ Pause`) pauses playback and turns the button green (`► Reprendre`).
2. Pressing `Space` while paused resumes playback seamlessly from the exact paused millisecond.
3. Pressing `Ctrl+→` stops current audio and speaks the next sentence using the selected Google Cloud voice.

---

## 4. REST API Integration Contract

### 4.1 Endpoint
`POST https://texttospeech.googleapis.com/v1/text:synthesize?key={API_KEY}`

### 4.2 Request Payload
```json
{
  "input": {
    "text": "Bonjour, bienvenue dans le laboratoire de français."
  },
  "voice": {
    "languageCode": "fr-FR",
    "name": "fr-FR-Neural2-A",
    "ssmlGender": "FEMALE"
  },
  "audioConfig": {
    "audioEncoding": "MP3",
    "speakingRate": 1.0,
    "pitch": 0.0
  }
}
```

### 4.3 Response Payload
```json
{
  "audioContent": "//NExAAAAANIAAAAAExBTUUzLjEwMC4..."
}
```
*The `audioContent` base64 string is converted to a Blob URL (`URL.createObjectURL(blob)`) and played through an `Audio` instance.*

---

## 5. Security & Privacy Constraints

1. **Client-Side Secret Storage**: API keys are saved strictly to the browser's `localStorage` and never transmitted to any third-party server other than `texttospeech.googleapis.com`.
2. **Network Error Resilience**: If a network request fails (e.g. invalid key, quota exceeded, or offline), the system automatically triggers a silent fallback to `speechSynthesizer.speakSentence()` via Web Speech API and notifies the user with a subtle toast.
