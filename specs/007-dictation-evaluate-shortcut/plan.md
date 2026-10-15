# Implementation Plan: Dictation Evaluation Hotkey (007-dictation-evaluate-shortcut)

**Branch**: `007-dictation-evaluate-shortcut`  
**Prerequisites**: [spec.md](spec.md) (completed)  
**Target Platform**: Browser (Pure Vanilla JS ESM + Vanilla CSS)  

---

## 1. Technical Architecture & Modifications

### 1.1 UI Controller & Keyboard Navigation (`src/ui/DictationView.js`)

1. **Extract Evaluation Logic into `submitEvaluation()`**:
   - Instead of running inline inside `submitBtn.addEventListener('click', ...)`, create a dedicated method `submitEvaluation()`:
     ```javascript
     submitEvaluation() {
       const textarea = this.container?.querySelector('#dictation-textarea');
       if (textarea) {
         if (this.viewTab === 'sentence') {
           this.sentenceInputs[this.activeSentenceIndex] = textarea.value;
           this.fullTextInput = this.sentences.map((_, i) => this.sentenceInputs[i + 1] || '').filter(Boolean).join(' ');
         } else {
           this.fullTextInput = textarea.value;
           const parsed = splitFrenchSentences(this.fullTextInput);
           this.sentences.forEach((_, idx) => {
             if (parsed[idx]) {
               this.sentenceInputs[idx + 1] = parsed[idx].text;
             }
           });
         }
         this.saveDraft();
       }

       // Guard against empty submissions
       const currentVal = this.viewTab === 'sentence'
         ? (this.sentenceInputs[this.activeSentenceIndex] || (textarea ? textarea.value : ''))
         : (this.fullTextInput || (textarea ? textarea.value : ''));

       if (countFrenchWords(currentVal.trim()) === 0) {
         return;
       }

       this.evaluation = evaluateDictation(this.currentExercise, this.sentenceInputs);
       this.render();

       setTimeout(() => {
         const panel = this.container?.querySelector('#dictation-correction-panel');
         if (panel) {
           panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
         }
       }, 50);
     }
     ```
   - In `bindEvents()`: `submitBtn.addEventListener('click', () => this.submitEvaluation());`.

2. **Intercept `Ctrl+Enter` / `Cmd+Enter` in `handleKeyDown(e)`**:
   - Check if `(e.ctrlKey || e.metaKey)` and `(e.key === 'Enter' || e.code === 'Enter')`:
     ```javascript
     const isEnter = e.key === 'Enter' || e.code === 'Enter';
     if ((e.ctrlKey || e.metaKey) && isEnter) {
       e.preventDefault();
       e.stopPropagation();
       this.submitEvaluation();
       return;
     }
     ```
   - Note: This must execute even when the cursor is inside the `<textarea>` or `<input>`, preventing the default newline insertion.

3. **Template & Visual Badge Updates in `render()`**:
   - Append shortcut badge `<kbd class="shortcut-badge btn-submit-badge">Ctrl+Enter</kbd>` inside `#btn-evaluate-dictation`.
   - Update placeholder strings for both sentence tab and full-text tab to include `Ctrl+Enter: Corriger`:
     `\n(Ctrl+Space: Écouter/Pause • Ctrl+R: Réécouter • Ctrl+Enter: Corriger • Ctrl+← / Ctrl+→: Điều hướng)`

---

### 1.2 CSS Styling (`src/styles/dictation.css`)

- Add `.btn-submit-badge` style to seamlessly fit inside the gradient submit button:
  ```css
  .btn-submit-badge {
    background: rgba(255, 255, 255, 0.22);
    border: 1px solid rgba(255, 255, 255, 0.35);
    color: #ffffff;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 6px;
    display: inline-block;
    vertical-align: middle;
  }
  ```

---

### 1.3 Automated Tests (`tests/french-lab.test.js`)

- Add **Test 22**:
  - Test keyboard evaluation dispatch:
    - Instantiate or mock dictation view state with typed input.
    - Dispatch a synthetic `keydown` event with `ctrlKey: true` and `key: 'Enter'`.
    - Assert `e.preventDefault()` was called.
    - Assert `evaluation` result is produced.
  - Test empty input guard:
    - Dispatch `Ctrl+Enter` when textarea is empty.
    - Assert `evaluation` remains null/unchanged.
- Ensure all 22 tests pass cleanly (`22 passing`).

---

## 2. Implementation Steps

1. **Step 1: CSS Updates** (`src/styles/dictation.css`)
   - Add `.btn-submit-badge` rule.
2. **Step 2: Component Logic** (`src/ui/DictationView.js`)
   - Implement `submitEvaluation()`.
   - Update `#btn-evaluate-dictation` button markup with the `<kbd>` badge.
   - Update textarea placeholders.
   - Add `(Ctrl/Cmd) + Enter` key interceptor in `handleKeyDown(e)`.
3. **Step 3: Test Suite** (`tests/french-lab.test.js`)
   - Add Test 22 for keyboard evaluation and empty input guard.
   - Run `node tests/french-lab.test.js`.
4. **Step 4: Interactive Verification**
   - Verify on live browser at `http://localhost:3000/#dictation` by typing text and pressing `Ctrl+Enter`.

---

## 3. Risks & Mitigations

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Accidental newline in `<textarea>`** | Low | Call `e.preventDefault()` immediately before calling `submitEvaluation()`. |
| **Cross-platform Mac / Windows** | Low | Check `(e.ctrlKey || e.metaKey)` so both `Ctrl+Enter` (Win/Linux) and `Cmd+Enter` (macOS) work. |
| **Evaluating stale text** | Medium | `submitEvaluation()` explicitly synchronizes `textarea.value` into `this.sentenceInputs` before calling `evaluateDictation()`. |
