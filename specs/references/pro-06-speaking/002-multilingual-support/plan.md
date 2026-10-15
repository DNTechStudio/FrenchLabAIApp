# Implementation Plan: Multilingual Interface & Pedagogical Guidance (English, Chinese, Vietnamese)

**Branch**: `002-multilingual-support` | **Date**: 2026-09-28 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-multilingual-support/spec.md`

---

## Summary

Add comprehensive multilingual interface localization and pedagogical scaffolding for **English, Chinese (中文), and Vietnamese (Tiếng Việt)** alongside French:
1. **Lightweight, Modular `I18nManager`**: Zero-dependency internationalization engine supporting dynamic language switching, localStorage persistence, and fallback mechanics.
2. **Translation Bundles**: Complete localized string dictionaries for French, English, Chinese, and Vietnamese across all navigation, timers, scratchpads, controls, and dialogs.
3. **Bilingual Pedagogical Diagnostic Feedback**: Localized grammatical error explanations, action plans, and B2/C1 logical connector translations in `DelfB2EvaluationEngine`.
4. **Header Language Switcher**: Elegant dropdown in the app header with flags (🇫🇷, 🇬🇧, 🇨🇳, 🇻🇳) and native names.

---

## Technical Context

**Language/Version**: Modern JavaScript / ES2022+ (Strict Mode)

**Primary Dependencies**: None (Zero-dependency modular i18n architecture)

**Storage**: `localStorage` (`delf_speaking_language_pref`)

**Testing**: Node.js native test runner (`node:test`, `node:assert`)

**Target Platform**: Evergreen Modern Browsers

**Project Type**: Client-Side Single Page Web Application (SPA)

---

## Constitution Check

*GATE: Verified against [.specify/memory/constitution.md](../../.specify/memory/constitution.md) (v1.0.0)*

| Principle | Requirement | Status |
| :--- | :--- | :--- |
| **I. Library-First & Modular Audio Engine** | Decoupled i18n module with explicit contract | **PASS**: `I18nManager` is self-contained in `src/core/i18n/` with contracts in `contracts/i18n-engine.contract.json`. |
| **II. Strict CEFR Alignment & Deterministic Rubric** | Exam speech and 25-pt scoring remain strictly French | **PASS**: Oral French production, examiner voice audio, and official rubric calculations remain strictly in French; localization provides UI guidance and pedagogical feedback. |
| **III. Test-First & Mocking (NON-NEGOTIABLE)** | TDD mandatory; unit tests for all translation keys | **PASS**: Automated tests in `tests/unit/I18nManager.test.js` verifying complete key coverage across FR, EN, ZH, and VI. |
| **IV. State Resilience & UX** | Persistence across browser reloads | **PASS**: Language preference saved in LocalStorage. |
| **V. Premium Aesthetics & Pure CSS Architecture** | Clean styling, smooth fonts for Chinese & Vietnamese | **PASS**: Vanilla CSS dropdown component with flags and seamless typography. |

---

## Project Structure

```text
src/
├── core/
│   └── i18n/
│       ├── I18nManager.js      # Core translation resolver and event emitter
│       └── locales/
│           ├── fr.js           # French (Source / Reference)
│           ├── en.js           # English
│           ├── zh.js           # 简体中文 (Simplified Chinese)
│           └── vi.js           # Tiếng Việt
├── ui/
│   └── components/
│       └── LanguagePicker.js   # Header language dropdown component
tests/
└── unit/
    └── I18nManager.test.js     # Translation key parity & fallback tests
```
