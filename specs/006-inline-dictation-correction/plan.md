# Implementation Plan: Inline Dictation Correction Panel (006-inline-dictation-correction)

**Branch**: `006-inline-dictation-correction`  
**Prerequisites**: [spec.md](spec.md) (required)  
**Target Platform**: Browser (Pure Vanilla JS ESM + Vanilla CSS)  

---

## 1. Technical Architecture & Modifications

### 1.1 UI Controller & Template Refactoring (`src/ui/DictationView.js`)
- **Remove Full-Page Swap**:
  - In `render()`: Remove the early return `if (this.evaluation) { this.renderResults(); return; }`.
- **Inline Placement in Main Card**:
  - Directly beneath `.transcription-area-box` in `.dictation-master-card`, conditionally inject:
    ```html
    ${this.evaluation ? this.renderCorrectionSection(this.evaluation) : ''}
    ```
- **New Method `renderCorrectionSection(ev)`**:
  - Extract and modernize the markup from `renderResults()` to fit cleanly inside the master card flow:
    - **Header**:
      - Left: `🎯 Rapport de Correction` + Level pill (`badge-level-pill`).
      - Right: Action buttons `[✕ Masquer]` (`#btn-hide-correction`) and `[🔄 Recommencer]` (`#btn-retry-dictation`).
    - **Score & Metric Bar**:
      - Overall accuracy % in prominent indigo/cyan gradient font.
      - 3 stat counters: `Mots justes`, `Homophones`, and `Accords`.
    - **Bilan Pédagogique**:
      - Styled callout box with CEFR-level diagnostic and actionable recommendations.
    - **Detailed Sentence Breakdown**:
      - For each sentence: Sentence header (`Phrase X - Précision : Y%`), followed by colored token diffs.
- **Event Binding & Smooth Scrolling**:
  - In `bindEvents()`:
    - In `#btn-evaluate-dictation` listener:
      - Compute `this.evaluation = evaluateDictation(this.currentExercise, this.sentenceInputs);`
      - Call `this.render();`
      - Query `#dictation-correction-panel` and trigger `panel.scrollIntoView({ behavior: 'smooth', block: 'start' });`
    - Bind `#btn-hide-correction`:
      - Set `this.evaluation = null;`
      - Call `this.render();` (preserving `this.sentenceInputs` and `this.fullTextInput`).
    - Bind `#btn-retry-dictation`:
      - Clear `this.evaluation = null;`
      - Clear `this.sentenceInputs = {};`
      - Clear `this.fullTextInput = '';`
      - Reset `this.activeSentenceIndex = 1;`
      - Call `this.render();`
- **Clean Up**:
  - Remove deprecated `renderResults()` method.

---

### 1.2 CSS Styling & Layout (`src/styles/dictation.css`)
- **Panel Container Styling (`#dictation-correction-panel`)**:
  - Margin & border divider: `margin-top: 24px`, `padding-top: 24px`, `border-top: 1px solid rgba(255, 255, 255, 0.1)`.
  - Display as flex column with gap `16px`.
  - Keyframe fade-in animation:
    ```css
    @keyframes fadeInCorrection {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    ```
- **Correction Header & Action Buttons**:
  - Flex layout with space-between.
  - Buttons styled with dark glassmorphic borders and hover transitions.
- **Diff Tokens Refinement**:
  - High-contrast, color-blind friendly badges for `.diff-token-correct`, `.diff-token-replace`, `.diff-token-missing`, `.diff-token-insertion`.

---

### 1.3 Automated Tests (`tests/french-lab.test.js`)
- Add **Test 20**:
  - Verify that `evaluateDictation` populates evaluation state while preserving user inputs.
  - Verify that clearing evaluation resets the report without losing the current sentence text.
  - Verify that re-evaluating with updated inputs produces updated accuracy metrics.
- Ensure all 20 tests pass (100% green).

---

## 2. Implementation Steps

1. **Step 1: CSS Design** (`src/styles/dictation.css`)
   - Add styles for `.dictation-correction-panel`, `.correction-header`, `.correction-stats`, and animations.
2. **Step 2: Component Logic** (`src/ui/DictationView.js`)
   - Implement `renderCorrectionSection(ev)`.
   - Update `render()` to include correction panel below `.transcription-area-box`.
   - Add smooth scrolling and action bindings (`#btn-hide-correction`, `#btn-retry-dictation`).
   - Remove legacy `renderResults()`.
3. **Step 3: Automated Testing** (`tests/french-lab.test.js`)
   - Add Test 20 validating the inline evaluation lifecycle and state persistence.
   - Run `node tests/french-lab.test.js`.
4. **Step 4: Interactive Validation**
   - Test typing, clicking `🎯 Corriger ma dictée`, checking smooth scroll, hiding correction, editing, and re-evaluating.

---

## 3. Risks & Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Scroll jump / disorientation** | Low | Use `behavior: 'smooth'` and `block: 'start'` when revealing `#dictation-correction-panel`. |
| **Input text loss when hiding correction** | High | `#btn-hide-correction` strictly only sets `this.evaluation = null`, leaving `sentenceInputs` untouched. |
| **Performance on long multi-sentence texts** | Low | Pure Vanilla DOM string interpolation renders in < 5ms without virtual DOM overhead. |
