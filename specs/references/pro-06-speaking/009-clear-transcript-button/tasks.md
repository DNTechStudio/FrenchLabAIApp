# Implementation Tasks: Clear Transcript Action & Placeholder Fix (Feature 009)

**Feature**: `009-clear-transcript-button` | **Branch**: `009-clear-transcript-button`  
**Spec**: [spec.md](spec.md)  

---

## Tasks

- [X] T001 Add `practice.transcript_placeholder`, `practice.transcript_edit_hint`, and `practice.clear_transcript_btn` to:
  - `src/core/i18n/locales/fr.js`
  - `src/core/i18n/locales/en.js`
  - `src/core/i18n/locales/vi.js`
  - `src/core/i18n/locales/zh.js`
- [X] T002 In `src/ui/components/PracticeRecordingConsole.js`:
  - Add `<button type="button" class="btn btn-secondary clear-transcript-btn">` to footer.
  - Implement `clearTranscript()` with automatic textarea focusing.
  - Update `updateWordCount()` to dynamically enable/disable the clear button.
  - Update `setTranscript()` to synchronize word count and clear button reactivity.
- [X] T003 Implement unit test in `tests/unit/PracticeRecordingConsole.test.js`:
  - Verify initialization, clearing, and multilingual localization.
- [X] T004 Run full automated test suite (`npm test`) -> 99/99 passing.
