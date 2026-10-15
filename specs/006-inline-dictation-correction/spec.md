# Feature Specification: Inline Dictation Correction Panel (006-inline-dictation-correction)

**Feature Branch**: `006-inline-dictation-correction`  
**Created**: 2026-10-04  
**Status**: Specified & Ready for Review  

---

## 1. Overview & Problem Statement

Currently, when a student finishes transcribing a dictation exercise and clicks **« 🎯 Corriger ma dictée »**, the application completely replaces the entire dictation workspace with a standalone full-page results view (`renderResults()`).

### Problem:
- **Loss of Working Context**: The audio deck, sentence navigation, tabs (`Phrase X` vs `Texte intégral`), diacritics toolbar, and the user's editable transcription textarea disappear from view.
- **Inconvenient Comparison & Revision**: The student cannot view their original input alongside the correction diffs or replay specific audio sentences while studying their mistakes.
- **Jarring Transition**: Having a full-page swap disrupts the pedagogical workflow of listening, writing, reviewing corrections, and re-attempting immediately.

### Proposed Solution:
Render the **Correction & Evaluation Window** (`#dictation-correction-panel`) directly **underneath the user input text window, below the `🎯 Corriger ma dictée` action bar**, inside the same dictation master card:
1. The student keeps full visibility and interactive control over the audio deck and transcription textarea on top.
2. Clicking **« 🎯 Corriger ma dictée »** computes the evaluation and seamlessly displays the detailed diagnostic report right below the input box.
3. Automatically scrolls smoothly to the correction panel for immediate feedback.
4. Allows closing or re-evaluating anytime without resetting or losing input text.

---

## 2. User Scenarios & Acceptance Criteria

### Scenario 1: Inline Correction Rendering
- **Given**: The student has transcribed text for one or more sentences in Mode Dictée.
- **When**: The student clicks the **« 🎯 Corriger ma dictée »** button (or triggers submission).
- **Then**:
  - The upper section (Header, Audio Controls, Sentence Pills, Textarea, Accents Bar, Action Bar) **remains visible and fully interactive**.
  - A new container `#dictation-correction-panel` appears directly beneath the `.transcription-area-box` / `.deck-action-bar`.
  - The view smoothly scrolls to `#dictation-correction-panel` so the student can immediately inspect their diagnostic.

### Scenario 2: Interactive Correction Report Content
- **Given**: The `#dictation-correction-panel` is displayed.
- **Then** it contains:
  1. **Correction Header**:
     - Title: `🎯 Rapport de Correction` with CECRL level badge (e.g. `B2`).
     - Action buttons:
       - `[✕ Masquer la correction]` (collapses / hides the correction section without erasing input).
       - `[🔄 Réinitialiser]` (clears text inputs and evaluation, resets to Sentence 1).
  2. **Global Accuracy Summary**:
     - Large percentage badge (e.g. `85% Exactitude orthographique globale`).
     - Metric stat chips: `Mots justes` (e.g. 42/48), `Homophones` errors, `Accords` errors.
  3. **Bilan Pédagogique**:
     - Styled callout box with CEFR-aligned diagnostic advice (e.g. `Entraînement recommandé (B2)...`).
  4. **Detailed Per-Sentence Diff Breakdown**:
     - For each sentence (Phrase 1, Phrase 2, etc.):
       - Sentence title + accuracy score chip (`Précision : X%`).
       - Diff visual tokens:
         - **Correct words**: White clean typography.
         - **Replaced/Typo words**: Red strikethrough actual text + green bold expected word.
         - **Omitted words**: Amber italic badge `[omis: mot]`.
         - **Extra words**: Red badge `[en trop: mot]`.

### Scenario 3: Real-Time Re-evaluation & Seamless Editing
- **Given**: The correction panel is open.
- **When**: The student modifies their text in the textarea above or switches sentences.
- **Then**:
  - The student can click **« 🎯 Corriger ma dictée »** again at any time to re-evaluate with updated scores and diffs.
  - Or click **« ✕ Masquer la correction »** to hide the correction section.

---

## 3. UI Layout & Wireframe

```
┌────────────────────────────────────────────────────────────────────────┐
│ 🎧 French Lab AI • Mode Dictée                     [B2] [⚙ Voix] [✕]  │
├────────────────────────────────────────────────────────────────────────┤
│ [◀ Précédent (Ctrl+←)]   [► Écouter (Ctrl+Space)]   [Suivant ▶ (Ctrl+→)]│
│                       [🔁 Réécouter (Ctrl+R)]                          │
├────────────────────────────────────────────────────────────────────────┤
│  Tabs: [ Phrase 1 (active) ] [ Texte intégral ]                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Textarea (User types transcription here...)                        │ │
│ │                                                                    │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ Accents: [ é ] [ è ] [ ê ] [ à ] [ ç ] ...                             │
│ Counter: Mots transcrits : 24 (Attendu : ~25 mots)                     │
│ [ Effacer ]                           [ 🎯 Corriger ma dictée ]       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ ▼ WINDOW CORRECTION (Directly below user input window)                 │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ 🎯 Rapport de Correction  [B2]             [✕ Masquer] [🔄 Reset]   │ │
│ │                                                                    │ │
│ │  85%                                21/25         1          0     │ │
│ │  Exactitude orthographique       Mots justes  Homophones  Accords   │ │
│ │                                                                    │ │
│ │  ℹ Bilan pédagogique : Excellent niveau B2. Attention aux accords...│ │
│ │                                                                    │ │
│ │  Correction détaillée :                                            │ │
│ │  ┌──────────────────────────────────────────────────────────────┐  │ │
│ │  │ Phrase 1                                     Précision : 90% │  │ │
│ │  │ Bonjour tout le ~monnde~ monde et bienvenue au laboratoire.   │  │ │
│ │  └──────────────────────────────────────────────────────────────┘  │ │
│ │  ┌──────────────────────────────────────────────────────────────┐  │ │
│ │  │ Phrase 2                                     Précision : 80% │  │ │
│ │  │ ...                                                          │  │ │
│ │  └──────────────────────────────────────────────────────────────┘  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Specifications & Integration Points

### 4.1 Modifications in `src/ui/DictationView.js`
1. **Remove Full-Page Replacement in `render()`**:
   - Delete early return:
     ```js
     // REMOVE:
     // if (this.evaluation) {
     //   this.renderResults();
     //   return;
     // }
     ```
2. **Embed Correction Section in Template**:
   - Inside `.dictation-master-card`, immediately after `.transcription-area-box`:
     ```html
     <!-- 5. Evaluation / Correction Window -->
     ${this.evaluation ? this.renderCorrectionSection() : ''}
     ```
3. **Refactor `renderResults()` into `renderCorrectionSection()`**:
   - Returns HTML string representing `#dictation-correction-panel`.
   - Includes header with `[✕ Masquer la correction]` and `[🔄 Recommencer]`.
   - Includes summary stats, pedagogical note, and per-sentence token diff cards.
4. **Smooth Scroll on Evaluation**:
   - In the click listener for `#btn-evaluate-dictation`:
     ```js
     this.evaluation = evaluateDictation(this.currentExercise, this.sentenceInputs);
     this.render();
     const panel = this.container.querySelector('#dictation-correction-panel');
     if (panel) {
       panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
     ```
5. **Dismiss & Reset Listeners**:
   - `#btn-dismiss-correction`: Sets `this.evaluation = null` and re-renders (retaining input text).
   - `#btn-reset-dictation`: Clears inputs, sets `this.evaluation = null`, active sentence = 1, and re-renders.

### 4.2 Styling in `src/styles/dictation.css`
1. `#dictation-correction-panel`:
   - Top border / divider: `margin-top: 24px`, `padding-top: 24px`, `border-top: 1px solid rgba(255, 255, 255, 0.08)`.
   - Subtle background tint and glowing accent border to clearly distinguish the correction results from the input pane.
   - Smooth entrance animation (`animation: fadeInSlideUp 0.3s ease-out`).

---

## 5. Test Plan

1. **Automated Unit & Integration Tests (`tests/french-lab.test.js`)**:
   - Test that evaluation can be triggered and produces valid structured results without breaking input state.
   - Test that clearing evaluation hides the report while preserving `sentenceInputs`.
2. **Interactive UI Verification**:
   - Load exercise, transcribe sentences with intentional typos.
   - Click `🎯 Corriger ma dictée`.
   - Verify that the input textarea, sentence tabs, and audio controls stay in place at the top.
   - Verify that the correction window renders directly below `🎯 Corriger ma dictée`.
   - Verify that `Masquer la correction` collapses the panel without losing typed text.
   - Verify that clicking `🎯 Corriger ma dictée` again re-evaluates seamlessly.
