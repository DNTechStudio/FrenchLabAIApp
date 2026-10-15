# Feature Specification: Inline AI Speech Elevation Display (Affichage Continu d'Élévation IA)

**Feature**: `008-inline-elevation-display`  
**Target Release**: v1.7.0  
**Status**: SPECIFIED  
**Author**: Antigravity  

---

## 1. Executive Summary & Problem Statement

Currently, when a candidate in **Mode Entraînement Libre** (Practice Mode) clicks the primary action button **« ✨ Améliorer avec l’IA »** (`#trigger-elevation-btn`), the entire view container is cleared (`this.container.innerHTML = ''`) and replaced entirely by the `ElevationComparisonCard`. 

While this displayed the comparison columns (Candidate speech vs Level 1 vs Level 2), it introduced severe pedagogical and user experience drawbacks:
1. **Loss of Context**: The learner lost sight of the active topic card, their recording console, their real-time transcription history, and the CEFR level picker.
2. **Friction in Iterative Practice**: To try another phrase, record again, modify their transcript, or select different target CEFR levels, the learner was forced to find and click the `🔄 Nouvel entraînement` button to reload the initial workspace, losing their immediate visual flow.

### Proposed Solution
Render all AI-generated elevation comparison content **inline directly below the primary « ✨ Améliorer avec l’IA » action button**, without replacing or hiding the practice workspace. The topic, recording console, transcript editor, and CEFR dual-level picker remain visible and accessible at all times above the generated evaluation windows.

---

## 2. User Stories & Acceptance Criteria

### User Story 1 (P1): Continuous Inline Elevation Result Display
> **As a** DELF/DALF candidate practicing oral speech,  
> **I want** the comparative CEFR elevation windows to appear directly below the "Améliorer avec l'IA" button on the same page,  
> **So that** I don't lose my workspace (topic, microphone console, transcript, and level picker) and don't need to click "Nouvel entraînement" to continue practicing.

- **Acceptance Criteria**:
  - `US1.1`: Clicking `« ✨ Améliorer avec l’IA »` does **not** wipe out the practice workspace (`renderWorkspaceDOM` remains mounted).
  - `US1.2`: The elevation comparison card (`ElevationComparisonCard`) is rendered directly into a dedicated slot (`.elevation-result-slot`) positioned immediately following the primary action button.
  - `US1.3`: Upon generation, the window smoothly scrolls to the results container (`scrollIntoView({ behavior: 'smooth', block: 'start' })`) so the learner immediately sees the generated variants.
  - `US1.4`: The CEFR elevation windows maintain strictly ascending proficiency order (`A1 -> A2 -> B1 -> B2 -> C1 -> C2`).

---

### User Story 2 (P1): Real-time Iterative Re-elevation Without Page Reload
> **As a** learner,  
> **I want to** adjust my spoken transcript or change my CEFR level selection at the top of the page and click "Améliorer avec l'IA" again,  
> **So that** the comparison windows update in-place without navigating away or losing my current draft.

- **Acceptance Criteria**:
  - `US2.1`: The candidate can edit the transcript in `PracticeRecordingConsole` or click a new CEFR level in `CefrDualLevelPicker` at any time.
  - `US2.2`: Clicking `« ✨ Améliorer avec l’IA »` re-runs the elevation engine and replaces the contents of `.elevation-result-slot` with the fresh analysis.
  - `US2.3`: If the candidate clicks `Changer de sujet` or creates a custom prompt, the workspace updates dynamically while preserving responsiveness.

---

### User Story 3 (P2): Adaptation of the Header Action in Comparison Card
> **As a** learner,  
> **I want** the comparison header to reflect the inline workflow,  
> **So that** there is no confusing "Nouvel entraînement" button that feels like a full page reload.

- **Acceptance Criteria**:
  - `US3.1`: The candidate is **no longer required** to click `Nouvel entraînement` to return to the practice console.
  - `US3.2`: The top-right action in `ElevationComparisonCard` is updated to a non-disruptive convenience action: `🔄 Effacer le résultat` (which clears the result slot and scrolls smoothly back to the recording console) or `⬆️ Haut de page` (scroll to top).
  - `US3.3`: TTS voice selector and speed controllers (`0.75x`, `0.9x`, `1.0x`, `1.2x`) remain fully operational inside each CEFR elevation column.

---

### User Story 4 (P2): Session Persistence & Re-hydration
> **As a** learner reloading or reopening the app in Practice Mode,  
> **I want** my saved session to restore both the workspace and the generated elevation results,  
> **So that** I don't lose my progress if the browser tab refreshes.

- **Acceptance Criteria**:
  - `US4.1`: When `PracticeView.render()` is invoked with an existing `elevationResult` in localStorage, the workspace is mounted first, followed immediately by the inline elevation comparison card in `.elevation-result-slot`.
  - `US4.2`: If no `elevationResult` exists yet, `.elevation-result-slot` remains empty and clean without taking up excessive vertical whitespace.

---

## 3. Visual Layout Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ [Header]: Mode Entraînement Libre | Changer de sujet | Sujet │
├──────────────────────────────────────────────────────────────┤
│ [Active Topic Card] / [Custom Topic Form]                   │
│  « Le télétravail : opportunité ou menace ? »                │
├──────────────────────────────────────────────────────────────┤
│ [PracticeRecordingConsole]: Micro, Minuteur, Transcription   │
│  [Audio Visualizer] [Dictaphone Input / Text Editor]         │
├──────────────────────────────────────────────────────────────┤
│ [CefrDualLevelPicker]: [A1] [A2] [B1*] [B2*] [C1] [C2]       │
├──────────────────────────────────────────────────────────────┤
│ [Primary Action Button]:                                     │
│          ✨ Améliorer avec l’IA →                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ═══════════ [INLINE ELEVATION RESULT SLOT] ══════════════   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ✨ Analyse & Amélioration IA (B1 vs B2)    [Voix] [⬆️] │  │
│  ├─────────────┬──────────────────────────┬───────────────┤  │
│  │ Version     │ Palier B1 (Adaptée)      │ Palier B2     │  │
│  │ Brute       │ 🔊 Écouter [1.0x]        │ 🔊 [1.0x]     │  │
│  │ (Candidat)  │ Connecteurs: À mon avis  │ Bien que...   │  │
│  └─────────────┴──────────────────────────┴───────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Implementation Scope

1. **`src/ui/views/PracticeView.js`**:
   - In `renderWorkspaceDOM()`: Add a container element `<div class="elevation-result-slot"></div>` directly beneath the trigger button area.
   - In `handleTriggerElevation()`: Rather than replacing `this.container.innerHTML`, target `this.container.querySelector('.elevation-result-slot')`.
   - Update `renderElevationResultDOM()` to populate the slot, clear any previous result, append the `ElevationComparisonCard`, and trigger smooth scrolling.
   - In `render()`: Always render `this.renderWorkspaceDOM()`; if `this.elevationResult` is present, immediately call `this.renderElevationResultDOM()`.
   - Update `onRestart` callback to clear the result slot, reset `this.elevationResult = null`, save session, and smoothly scroll back to `.recording-console-slot`.

2. **`src/ui/components/ElevationComparisonCard.js`**:
   - Adjust the secondary button label and action (e.g., `🔄 Effacer le résultat` / `Haut de page`) to clearly convey that it resets/clears the generated cards rather than navigating away from the workspace.

3. **Translations (`src/core/i18n/locales/*.js`)**:
   - Ensure keys for `clear_elevation` / `scroll_to_top` are present and consistent in French, English, Vietnamese, and Chinese.

---

## 5. Verification & Testing Strategy

1. **Unit & Integration Tests**:
   - Verify that `PracticeView.render()` keeps workspace controls mounted when `elevationResult` exists.
   - Verify that triggering elevation writes to `.elevation-result-slot` without removing console or picker DOM nodes.
   - Verify `onRestart` clears `elevationResult` and session without causing runtime errors.
2. **Visual & Behavioral Validation**:
   - Test in dev server (`http://localhost:5173/`).
   - Validate smooth scrolling behavior when clicking "Améliorer avec l'IA".
   - Confirm user can modify text or change CEFR pills directly and re-elevate instantly.
