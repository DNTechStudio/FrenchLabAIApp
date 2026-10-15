# Feature Specification: Dictation Evaluation Hotkey (007-dictation-evaluate-shortcut)

**Feature Branch**: `007-dictation-evaluate-shortcut`  
**Created**: 2026-10-05  
**Status**: Specified & Ready for Review  

---

## 1. Overview & Problem Statement

Currently in **Mode Dictée** (`DictationView`):
- Navigation and audio controls have ergonomic shortcuts:
  - `Ctrl+Space`: Écouter / Pause
  - `Ctrl+R`: Réécouter (replay from start)
  - `Ctrl+←`: Phrase précédente
  - `Ctrl+→`: Phrase suivante
- However, triggering **« 🎯 Corriger ma dictée »** requires the learner to take their hands off the keyboard, grab the mouse, and click the submit button.
- For smooth keyboard-only dictation practice, students expect a standard submission hotkey: **`Ctrl+Enter`** (or **`Cmd+Enter`** on macOS).

### Proposed Enhancement:
1. **Global/Textarea Hotkey (`Ctrl+Enter` / `Cmd+Enter`)**:
   - When pressed anywhere inside the dictation module (specifically when focused in the transcription `<textarea>`), trigger the evaluation immediately.
   - Prevent default behavior (`e.preventDefault()`, `e.stopPropagation()`) so a newline is not inserted into the textarea.
   - Ensure the latest text in `<textarea>` is synchronized into `sentenceInputs` / `fullTextInput` before grading (preventing stale evaluation).
   - Guard against empty submissions: If word count is 0 (or button disabled), do nothing or provide subtle feedback, avoiding empty grading.
2. **Visual Affordance & UI Consistency**:
   - Add a `<kbd class="shortcut-badge">Ctrl+Enter</kbd>` badge to `#btn-evaluate-dictation`.
   - Update the textarea placeholder helper text to include `Ctrl+Enter: Corriger`.
3. **Smooth Scroll**:
   - Keep the smooth auto-scroll to the inline `#dictation-correction-panel` as introduced in feature `006`.

---

## 2. User Scenarios & Acceptance Criteria

### Scenario 1: Quick Keyboard Submission from Textarea
- **Given**: The student is typing their transcription in the active sentence or full-text textarea in Mode Dictée.
- **When**: The student presses `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (macOS).
- **Then**:
  - The default newline insertion in `<textarea>` is prevented.
  - The typed text in the textarea is synchronized immediately.
  - The evaluation is executed (`evaluateDictation`).
  - The `#dictation-correction-panel` appears inline below the button.
  - The page scrolls smoothly to the correction report.

### Scenario 2: Visual Badge on Button & Placeholder Hint
- **Given**: Mode Dictée is loaded.
- **Then**:
  - The button `#btn-evaluate-dictation` displays:
    - Target emoji: `🎯`
    - Label: `Corriger ma dictée`
    - Visual badge: `<kbd class="shortcut-badge">Ctrl+Enter</kbd>`
  - The `<textarea>` placeholder contains:
    `(Ctrl+Space: Écouter/Pause • Ctrl+R: Réécouter • Ctrl+Enter: Corriger • Ctrl+← / Ctrl+→: Điều hướng)`

### Scenario 3: Guard on Empty Input
- **Given**: The textarea is completely empty (`typedWordCount === 0`).
- **When**: The student presses `Ctrl+Enter`.
- **Then**:
  - No evaluation is triggered.
  - The application remains stable in its current state without throwing errors.

---

## 3. Technical Specifications

### 3.1 `DictationView.js` Changes
1. **Button Template (`#btn-evaluate-dictation`)**:
   ```html
   <button class="btn-deck-submit" id="btn-evaluate-dictation" ${typedWordCount === 0 ? 'disabled' : ''}>
     <span>🎯</span>
     <span>Corriger ma dictée</span>
     <kbd class="shortcut-badge btn-submit-badge">Ctrl+Enter</kbd>
   </button>
   ```

2. **Textarea Placeholder**:
   Update both single sentence and full text placeholders:
   ```text
   (Ctrl+Space: Écouter/Pause • Ctrl+R: Réécouter • Ctrl+Enter: Corriger • Ctrl+← / Ctrl+→: Điều hướng)
   ```

3. **Dedicated Method `submitEvaluation()`**:
   Extract evaluation logic from the click listener into a reusable method:
   ```javascript
   submitEvaluation() {
     const textarea = this.container.querySelector('#dictation-textarea');
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

     const totalWords = countFrenchWords(this.viewTab === 'sentence' ? (textarea ? textarea.value : '') : this.fullTextInput);
     if (totalWords === 0) return;

     this.evaluation = evaluateDictation(this.currentExercise, this.sentenceInputs);
     this.render();
     setTimeout(() => {
       const panel = this.container.querySelector('#dictation-correction-panel');
       if (panel) {
         panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
       }
     }, 50);
   }
   ```

4. **Keyboard Interceptor in `handleKeyDown(e)`**:
   Add interceptor for `(e.ctrlKey || e.metaKey) && (e.key === 'Enter' || e.code === 'Enter')`:
   ```javascript
   const isEnter = e.key === 'Enter' || e.code === 'Enter';
   if ((e.ctrlKey || e.metaKey) && isEnter) {
     e.preventDefault();
     e.stopPropagation();
     this.submitEvaluation();
     return;
   }
   ```

### 3.2 Styling in `src/styles/dictation.css`
Add styling for `.btn-submit-badge`:
```css
.btn-submit-badge {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  font-size: 0.68rem;
  margin-left: 4px;
}
```

---

## 4. Test Strategy

1. **Unit & Integration Test (`tests/french-lab.test.js`)**:
   - **Test 22**: Simulate `Ctrl+Enter` keydown event on `DictationView`.
     - Verify `preventDefault()` is called.
     - Verify `evaluation` is produced.
     - Verify empty input does not trigger evaluation.
2. **Interactive Live Verification**:
   - Type transcription in live browser at `http://localhost:3000/#dictation`.
   - Press `Ctrl+Enter`.
   - Verify inline correction panel appears smoothly below the input box without needing mouse interaction.
