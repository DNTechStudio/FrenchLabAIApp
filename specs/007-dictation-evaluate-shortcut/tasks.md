# Tasks: Dictation Evaluation Hotkey (007-dictation-evaluate-shortcut)

**Input**: Design documents from `specs/007-dictation-evaluate-shortcut/`  
**Prerequisites**: [spec.md](spec.md) (required), [plan.md](plan.md) (required)  
**Tests**: Automated tests in `tests/french-lab.test.js` (Test 22)  
**Target Platform**: Browser (Pure Vanilla JS ESM + Vanilla CSS)  

---

## Phase 1: CSS Styling for Submit Shortcut Badge

**Purpose**: Style the keyboard shortcut badge on the evaluation submit button to blend seamlessly with the indigo gradient.

- [x] T001 Add `.btn-submit-badge` rule in `src/styles/dictation.css` with semi-translucent background (`rgba(255, 255, 255, 0.22)`), border (`rgba(255, 255, 255, 0.35)`), crisp white text, and vertical alignment matching existing button typography.

**Checkpoint**: Shortcut badge styling is ready to be rendered inside `#btn-evaluate-dictation`.

---

## Phase 2: Component Logic & Hotkey Handling

**Purpose**: Implement unified `submitEvaluation()`, display the visual badge, update placeholders, and bind `(Ctrl/Cmd)+Enter`.

- [x] T002 Implement `submitEvaluation()` in `src/ui/DictationView.js`:
  - Synchronize `textarea.value` to `sentenceInputs` (in sentence tab) or split full text (in full text tab).
  - Save draft with `this.saveDraft()`.
  - Guard against empty input (`countFrenchWords === 0`).
  - Calculate `this.evaluation = evaluateDictation(...)`.
  - Trigger `this.render()` and smooth scroll to `#dictation-correction-panel`.
- [x] T003 Update click listener for `#btn-evaluate-dictation` in `src/ui/DictationView.js` to call `this.submitEvaluation()`.
- [x] T004 Update button HTML template in `src/ui/DictationView.js` to render `<kbd class="shortcut-badge btn-submit-badge">Ctrl+Enter</kbd>` inside `#btn-evaluate-dictation`.
- [x] T005 Update textarea placeholders in `src/ui/DictationView.js` for both sentence and full-text tabs to include `Ctrl+Enter: Corriger`.
- [x] T006 Add `(Ctrl/Cmd) + Enter` interceptor in `handleKeyDown(e)` in `src/ui/DictationView.js`:
  - Check `(e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.code === 'Enter')`.
  - Call `e.preventDefault()` and `e.stopPropagation()` to cancel default newline insertion.
  - Call `this.submitEvaluation()`.

**Checkpoint**: Pressing `Ctrl+Enter` or clicking the button with the badge triggers evaluation and scrolls to the correction panel.

---

## Phase 3: Automated Testing & Verification

**Purpose**: Validate hotkey event handling, empty input safeguards, and regression testing.

- [x] T007 Add Test 22 in `tests/french-lab.test.js`:
  - Test `Ctrl+Enter` keydown interception and `preventDefault()` call.
  - Test empty input guard preventing evaluation when text is blank.
  - Test successful evaluation dispatch when text is present.
- [x] T008 Execute `node tests/french-lab.test.js` and verify that all 22 tests pass cleanly (100% green).
- [x] T009 Interactive browser verification:
  - Textarea captures `Ctrl+Enter` and calls `submitEvaluation()`.
  - Empty text guard prevents premature grading.
  - Badge `Ctrl+Enter` is rendered inside `#btn-evaluate-dictation`.

---

## Task Dependencies & Flow

```
[Phase 1: CSS Styling (T001)] ──> [Phase 2: Logic & Key Handling (T002-T006)]
                                                │
                                                ▼
                                  [Phase 3: Tests & Verification (T007-T009)]
```
