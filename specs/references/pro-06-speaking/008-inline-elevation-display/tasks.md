# Implementation Tasks: Inline AI Speech Elevation Display (Mode Entraînement)

**Feature**: `008-inline-elevation-display` | **Branch**: `008-inline-elevation-display`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Localization & Translations

**Purpose**: Provide localized button text and tooltip labels for the new inline action in French, English, Vietnamese, and Chinese.

- [X] T001 Add `practice.clear_result` key to:
  - `src/core/i18n/locales/fr.js` (`"Effacer les résultats"`)
  - `src/core/i18n/locales/en.js` (`"Clear results"`)
  - `src/core/i18n/locales/vi.js` (`"Xóa kết quả"`)
  - `src/core/i18n/locales/zh.js` (`"清除结果"`)

---

## Phase 2: Elevation Comparison Card Component Adjustment

**Purpose**: Adapt the header action of `ElevationComparisonCard` to support inline resetting without full-page reloads.

- [X] T002 Update `src/ui/components/ElevationComparisonCard.js`:
  - Change the header action button text from `"Nouvel entraînement"` to `i18n.t('practice.clear_result')`.
  - Ensure triggering `onRestart` signals the parent view to clear the inline results slot and scroll smoothly back up to the microphone console.

---

## Phase 3: PracticeView Inline Rendering & State Architecture

**Purpose**: Implement non-destructive continuous rendering in `PracticeView.js`.

- [X] T003 In `src/ui/views/PracticeView.js`:
  - In `renderWorkspaceDOM()`: Add a dedicated container `<div class="elevation-result-slot" style="margin-top: 2rem;"></div>` immediately following the primary action button area.
  - In `render()`: Mount the workspace via `this.renderWorkspaceDOM()`, and if `this.elevationResult` already exists in persisted session, immediately invoke `this.renderElevationResultDOM()`.
  - In `handleTriggerElevation()`: Keep the workspace mounted; delegate rendering to `this.renderElevationResultDOM()` which mounts the comparison card into `.elevation-result-slot`.
  - In `renderElevationResultDOM()`: 
    - Retrieve `.elevation-result-slot`.
    - Clear only the slot (`slot.innerHTML = ''`), instantiate `renderElevationComparisonCard`, and append it.
    - Call `slot.scrollIntoView({ behavior: 'smooth', block: 'start' })`.
    - Configure `onRestart` callback to set `this.elevationResult = null`, empty `.elevation-result-slot`, call `this.saveSession()`, and scroll smoothly back to `.recording-console-slot`.

---

## Phase 4: Verification, Automated Testing & Documentation

**Purpose**: Ensure zero regressions across unit and integration tests, and provide a comprehensive walkthrough.

- [X] T004 Run full automated test suite (`npm test`) to ensure all 95+ unit/integration tests pass.
- [X] T005 Verify in browser (`http://localhost:5173/`):
  - Topic, recording console, and CEFR level picker remain visible when clicking "Améliorer avec l’IA".
  - Elevation windows appear directly below the button.
  - Modifying transcript or CEFR levels updates the inline results cleanly.
  - "Effacer les résultats" clears the slot and scrolls to console.
- [X] T006 Complete task documentation and update checklist.
