# Implementation Plan: Inline AI Speech Elevation Display (Feature 008)

Display AI-generated comparative speech elevation windows directly below the « ✨ Améliorer avec l’IA » action button on the same continuous page, preserving full access to the active topic, microphone console, transcript editor, and CEFR level picker.

---

## 1. Goal Description

In **Mode Entraînement**, clicking `✨ Améliorer avec l’IA` previously replaced the entire view DOM (`this.container.innerHTML = ''`), hiding the candidate's topic card, recording console, transcript, and level selectors. To record another draft or change levels, the user was forced to click a `🔄 Nouvel entraînement` button, which re-rendered the initial page and lost seamless visual flow.

This feature enables an **inline, non-destructive continuous layout**:
1. The practice workspace stays mounted and interactive above.
2. The AI elevation comparison cards render directly underneath into a dedicated `.elevation-result-slot`.
3. The page smoothly scrolls into view to show the generated versions.
4. The candidate can modify transcript, adjust CEFR levels, or change topics at will without needing a "Nouvel entraînement" page transition.

---

## 2. User Review Required

> [!NOTE]
> **Button Behavior in Comparison Card**:  
> In the generated comparison card header, the previous button `🔄 Nouvel entraînement` will be adjusted to `🔄 Effacer les kết quả / Effacer les résultats` (Clear Results). Clicking it will simply remove the generated comparison cards from the slot and smoothly scroll back up to the microphone console, keeping the candidate's active topic and draft intact.

---

## 3. Proposed Changes

### Component: `PracticeView` (`src/ui/views/PracticeView.js`)
- **Add Dedicated Slot**: In `renderWorkspaceDOM()`, add `<div class="elevation-result-slot" style="margin-top: 2rem;"></div>` immediately following the primary action button.
- **Update `render()`**:
  - Always call `this.renderWorkspaceDOM()`.
  - If `this.elevationResult` exists, immediately invoke `this.renderElevationResultDOM()` to populate the slot.
- **Update `renderElevationResultDOM()`**:
  - Do NOT clear `this.container.innerHTML`.
  - Find `const slot = this.container.querySelector('.elevation-result-slot')`.
  - Clear `slot.innerHTML = ''` and append `renderElevationComparisonCard(...)`.
  - Trigger `slot.scrollIntoView({ behavior: 'smooth', block: 'start' })`.
  - On restart/clear callback:
    - Set `this.elevationResult = null`.
    - Clear `slot.innerHTML = ''`.
    - Call `this.saveSession()`.
    - Smoothly scroll up to `.recording-console-slot`.

---

### Component: `ElevationComparisonCard` (`src/ui/components/ElevationComparisonCard.js`)
- Update the action button in the header from `🔄 Nouvel entraînement` to `🔄 ${i18n.t('practice.clear_result') || 'Effacer les résultats'}`.

---

### Component: Internationalization (`src/core/i18n/locales/*.js`)
- Add localized string `practice.clear_result` across `fr`, `en`, `vi`, `zh`.

---

## 4. Verification Plan
- Run automated test suite (`npm test`).
- Test interactive flow in browser with live dev server.
