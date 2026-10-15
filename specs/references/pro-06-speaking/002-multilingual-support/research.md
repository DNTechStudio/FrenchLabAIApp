# Technical Research & Architecture Decisions: Multilingual Support

**Feature**: `002-multilingual-support` | **Date**: 2026-09-28

---

## 1. Internationalization (i18n) Engine Architecture

### Decision
- **Lightweight, Zero-Dependency `I18nManager`**:
  Implement a modular `I18nManager` class (`src/core/i18n/I18nManager.js`) maintaining translation dictionaries for the 4 supported locales:
  - `fr`: Français (Default / Langue de référence)
  - `en`: English
  - `zh`: 简体中文 (Simplified Chinese)
  - `vi`: Tiếng Việt
- **Lookup Method**: Dot-notation key resolution (e.g. `i18n.t('stepper.monologue')` or `i18n.t('prep.scratchpad_title')`) with automatic fallback to French if a key is missing.
- **Event-Driven UI Updates**: Emit a `'localeChanged'` event on language switch so subscribed UI components re-render instantly without reloading the browser or stopping active timers.

---

## 2. Bilingual Pedagogical Feedback & Diagnostic Translations

### Decision
- **Structured Multilingual Grammar Feedback**:
  The `DelfB2EvaluationEngine` will link detected linguistic flaws to bilingual explanation bundles, rendering the explanation in the learner's chosen language (e.g., explaining subject-verb agreement or subjunctive mood in Vietnamese or English) while preserving the original French sentence and correction.
- **Bilingual B2/C1 Connectors**:
  Each connector in `lexicalRecommendations` will include its target translation and communicative function (e.g., `Néanmoins` ➔ EN: "Nevertheless" / VI: "Tuy nhiên" / ZH: "然而").

---

## 3. Storage & State Persistence

### Decision
- Language preference stored in `localStorage` under `delf_speaking_language_pref`.
- On application boot, check stored preference or detect browser locale (`navigator.language`).
