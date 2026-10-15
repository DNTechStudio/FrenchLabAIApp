# Tasks: Inline Dictation Correction Panel (006-inline-dictation-correction)

**Input**: Design documents from `specs/006-inline-dictation-correction/`  
**Prerequisites**: [spec.md](spec.md) (required), [plan.md](plan.md) (required)  
**Tests**: Automated tests in `tests/french-lab.test.js` (Test 20)  
**Target Platform**: Browser (Pure Vanilla JS ESM + Vanilla CSS)  

---

## Phase 1: CSS Styling for Inline Correction Panel

**Purpose**: Define visual styling, divider border, and animations for the inline correction panel.

- [x] T001 Add `.dictation-correction-panel` container styles in `src/styles/dictation.css` including `border-top`, `margin-top: 24px`, `padding-top: 24px`, and `@keyframes fadeInCorrection` entrance animation.
- [x] T002 Add styling in `src/styles/dictation.css` for `.correction-header`, `.btn-correction-action` (`#btn-hide-correction`, `#btn-retry-dictation`), score summary card, and responsive mobile adjustments.

**Checkpoint**: CSS rules for `#dictation-correction-panel` are declared and ready for rendering.

---

## Phase 2: Component Logic & Inline Rendering

**Purpose**: Render the correction panel directly underneath the user input area within the same dictation master card.

- [x] T003 Implement `renderCorrectionSection(ev)` method in `src/ui/DictationView.js`:
  - Renders `#dictation-correction-panel` with header (title, CEFR badge, `[✕ Masquer]` and `[🔄 Recommencer]` buttons).
  - Renders global accuracy score & 3 metric chips (`Mots justes`, `Homophones`, `Accords`).
  - Renders Bilan pédagogique callout box.
  - Renders per-sentence detailed breakdown with color-coded token diffs.
- [x] T004 Update `render()` in `src/ui/DictationView.js`:
  - Remove early full-page return `if (this.evaluation) { this.renderResults(); return; }`.
  - Inject `${this.evaluation ? this.renderCorrectionSection(this.evaluation) : ''}` directly inside `.dictation-master-card` beneath `.transcription-area-box`.
- [x] T005 Update `#btn-evaluate-dictation` click handler in `src/ui/DictationView.js`:
  - Compute `this.evaluation = evaluateDictation(...)`.
  - Call `this.render()`.
  - Execute `panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on `#dictation-correction-panel`.
- [x] T006 Add event listeners in `src/ui/DictationView.js`:
  - Bind `#btn-hide-correction` to set `this.evaluation = null` and call `this.render()` without erasing typed text.
  - Bind `#btn-retry-dictation` to reset inputs and evaluation, returning to sentence 1.
- [x] T007 Remove legacy `renderResults()` method from `src/ui/DictationView.js`.

**Checkpoint**: Clicking `🎯 Corriger ma dictée` smoothly displays the correction panel underneath the input textarea without leaving the master card.

---

## Phase 3: Automated Testing & Verification

**Purpose**: Ensure lifecycle integrity, state preservation, and zero regression.

- [x] T008 Add Test 20 in `tests/french-lab.test.js`:
  - Assert that evaluation produces structured results while preserving user input text.
  - Assert that dismissing/hiding correction sets evaluation to null without deleting user input.
  - Assert that updating text and re-evaluating recalculates scores immediately.
- [x] T009 Run automated test runner (`node tests/french-lab.test.js`) and confirm all 20 tests pass (100% green).
- [x] T010 Validate live browser behavior on `http://localhost:3000/#dictation`:
  - Type sample transcription, click `🎯 Corriger ma dictée`.
  - Confirm input textarea and controls remain visible on top.
  - Confirm correction report appears below and is readable.
  - Confirm clicking `✕ Masquer` hides the report and keeps the text intact.

---

## Task Dependencies & Flow

```
[Phase 1: CSS Styling (T001-T002)] ──> [Phase 2: Inline Rendering Logic (T003-T007)]
                                                    │
                                                    ▼
                                      [Phase 3: Tests & Verification (T008-T010)]
```
