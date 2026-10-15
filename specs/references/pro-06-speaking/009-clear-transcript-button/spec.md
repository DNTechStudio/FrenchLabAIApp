# Feature Specification: Clear Transcript Action in Practice Recording Console

**Feature**: `009-clear-transcript-button`  
**Target Release**: v1.8.0  
**Status**: SPECIFIED  
**Author**: Antigravity  

---

## 1. Executive Summary & Problem Statement

In **Mode Entraînement** (Freeform Practice Mode), the candidate's spoken speech or written draft is captured inside the `PracticeRecordingConsole` (`.practice-transcript-box`).

Currently:
1. **No Quick Clear Action**: When a candidate wants to discard their current speech, re-record a new take from scratch, or clear an AI-suggested text, there is no one-click clear button. The learner has to manually click into the textarea, press `Ctrl+A`, and press `Backspace` / `Delete`.
2. **Missing I18n Placeholder**: The placeholder currently renders the raw key string `practice.transcript_placeholder` on screen because the key is missing from translation dictionaries.

### Proposed Solution
1. Add an intuitive, dedicated **« 🗑️ Effacer le texte » (Clear text)** button in the footer bar of the `PracticeRecordingConsole` adjacent to the word counter.
2. Clicking the button immediately clears the transcript, resets the word count badge to `0 mot(s)`, triggers `onTranscriptChange('')`, saves the updated session state, and focuses the textarea.
3. Fix the missing translation key `practice.transcript_placeholder` and localize all new strings across French, English, Vietnamese, and Chinese.

---

## 2. User Stories & Acceptance Criteria

### User Story 1 (P1): One-Click Clear Action
> **As a** language learner in Practice Mode,  
> **I want** a dedicated button to clear all text from the speech transcript box,  
> **So that** I can quickly start a fresh recording or draft without tedious manual deletion.

- **Acceptance Criteria**:
  - `US1.1`: A clear button labeled `🗑️ Effacer le texte` (localized) is rendered in the footer of `PracticeRecordingConsole`.
  - `US1.2`: Clicking the button clears the textarea value immediately.
  - `US1.3`: The internal state `this.transcript` is set to `''`.
  - `US1.4`: The word counter updates instantaneously to `0 mot(s)`.
  - `US1.5`: `onTranscriptChange('')` callback is fired to update the parent view and persist the change to `localStorage`.
  - `US1.6`: The textarea automatically receives focus so the user can immediately type or record.

---

### User Story 2 (P2): Reactive State & Visual Styling
> **As a** learner,  
> **I want** the clear button to visually reflect whether there is any text to clear,  
> **So that** the interface feels polished and prevents unnecessary clicks.

- **Acceptance Criteria**:
  - `US2.1`: When the transcript is empty, the button is disabled (or semi-transparent with `opacity: 0.5` and `cursor: not-allowed`).
  - `US2.2`: As soon as text is entered (via typing or voice dictation), the button becomes fully active and interactive.
  - `US2.3`: The button matches the design system (secondary button styling with glassmorphism hover effects).

---

### User Story 3 (P2): Complete Multilingual Localization & Placeholder Bugfix
> **As an** international candidate,  
> **I want** proper translations for the placeholder and clear button across all 4 supported languages (FR, EN, VI, ZH),  
> **So that** I don't see raw translation keys like `practice.transcript_placeholder`.

- **Acceptance Criteria**:
  - `US3.1`: Define `practice.clear_transcript_btn` in:
    - FR: `"Effacer le texte"`
    - EN: `"Clear text"`
    - VI: `"Xóa văn bản"`
    - ZH: `"清空文本"`
  - `US3.2`: Define `practice.transcript_placeholder` in:
    - FR: `"Parlez dans votre micro ou écrivez ici votre texte en français..."`
    - EN: `"Speak into your microphone or type your French text here..."`
    - VI: `"Nói vào micro hoặc nhập bài nói tiếng Pháp của bạn tại đây..."`
    - ZH: `"对着麦克风口述或在此直接输入您的法语文本..."`
  - `US3.3`: Define `practice.transcript_edit_hint` in:
    - FR: `"Vous pouvez modifier manuellement ce texte avant l'analyse."`
    - EN: `"You can manually edit this text before analysis."`
    - VI: `"Bạn có thể chỉnh sửa thủ công văn bản này trước khi phân tích."`
    - ZH: `"您可以在 AI 分析前手动编辑此文本。"`

---

## 3. Visual Layout

```
┌───────────────────────────────────────────────────────────────────┐
│ 🎤 Votre intervention orale & Transcription     Prêt à enregistrer│
├───────────────────────────────────────────────────────────────────┤
│ [ 🎙️ Commencer l’enregistrement ]        🗣️ Langue : Français ▾   │
├───────────────────────────────────────────────────────────────────┤
│ ℹ️ Reconnaissance vocale prête (fr-FR)...                         │
├───────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────┐ │
│ │ Parlez dans votre micro ou écrivez ici votre texte...        │ │
│ │                                                               │ │
│ └───────────────────────────────────────────────────────────────┘ │
│ ✏️ Vous pouvez modifier ce texte...    [ 🗑️ Effacer ]  0 mot(s)   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Implementation Scope

1. **`src/ui/components/PracticeRecordingConsole.js`**:
   - Add `<button type="button" class="btn btn-secondary clear-transcript-btn">` in the footer row.
   - Implement `clearTranscript()` method.
   - Update `updateWordCount()` to also toggle the disabled/enabled state of `.clear-transcript-btn`.
   - Update `setTranscript(text)` to reflect in the button state.
2. **Translations (`src/core/i18n/locales/*.js`)**:
   - Add `practice.clear_transcript_btn`, `practice.transcript_placeholder`, `practice.transcript_edit_hint` across `fr.js`, `en.js`, `vi.js`, `zh.js`.
3. **Automated Tests**:
   - Unit test for `clearTranscript()` in `tests/unit/PracticeRecordingConsole.test.js` or `tests/integration/PracticeModeFlow.test.js`.
