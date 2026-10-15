# Implementation Plan: Multilingual UI Language Options (FR, EN, ZH, VI)

**Branch**: `003-language-options` | **Date**: 2026-09-22 | **Spec**: [specs/003-language-options/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/003-language-options/spec.md)

**Input**: Feature specification from `specs/003-language-options/spec.md`

## Summary

Implement a native, type-safe, lightweight multilingual interface system supporting:
- **Français (`fr`)** (Default)
- **English (`en`)**
- **Chinese (`zh`)**
- **Vietnamese (`vi`)**

The system provides:
1. `src/domain/translations.ts` containing complete translation dictionaries with zero external bundle bloat.
2. A sleek, accessible language selector in the header with flag + code.
3. Language configuration in the Settings modal.
4. Persistence in `localStorage` (`UserSettings.language`).
5. Instant in-memory switching (<50ms) preserving candidate drafts without page reloads.
6. 100% parity in [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html).

---

## Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022

**Primary Dependencies**: React 19, Lucide React (Globe / Languages icon)

**Storage**: Browser `localStorage` (persisting `language` field in `UserSettings`)

**Testing**: `node:test` + Vitest for dictionary completeness, fallback handling, and storage persistence

**Target Platform**: Modern Web Browsers (desktop & mobile)

**Performance Goals**: <50ms language switch latency; 0 HTTP requests; <15 KB memory overhead

**Constraints**: Preserves candidate French writing and prompt integrity; zero data loss during switch (Constitution Principle II).

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, zero dead code | Fully typed translation dictionaries ensuring 100% key parity at compile time | **PASS** |
| **II. Exceptional UX & Learner Delight** | Zero data loss, instantaneous feedback (<50ms), accessible contrast | Language switch occurs in-memory without resetting drafts or timers; WCAG 2.1 AA compliant | **PASS** |
| **III. Test-First & Automated Verification** | Automated tests for dictionaries | Automated test checking key parity across `fr`, `en`, `zh`, and `vi` in `tests/run-all-tests.mjs` | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decouple translations from components | Pure translation dictionaries and helper in `src/domain/translations.ts` | **PASS** |
| **V. Performance & Offline Resilience** | Offline-first, sub-100ms response | 0 external network requests; works completely offline in both React SPA and `standalone.html` | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## Project Structure

### Documentation (this feature)

```text
specs/003-language-options/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Technical Research & Architecture Decisions
├── data-model.md        # Data Model & Translation Schema
└── quickstart.md        # Verification & Testing Guide
```

### Source Code Modifications

```text
src/
├── domain/
│   ├── translations.ts     # [NEW] Dictionaries for FR, EN, ZH, VI and getTranslation() helper
│   ├── types.ts            # [MODIFY] Add SupportedLanguage to UserSettings
│   └── constants.ts        # [MODIFY] Localized support config
├── components/
│   ├── Header.tsx          # [MODIFY] Add LanguageSelector dropdown & translate header strings
│   ├── PromptSelector.tsx  # [MODIFY] Translate category labels and random button
│   ├── WordCounterBadge.tsx# [MODIFY] Translate counter status and target strings
│   ├── EditorPane.tsx      # [MODIFY] Translate editor buttons and placeholders
│   ├── ComparisonPane.tsx  # [MODIFY] Translate tabs, criteria, and feedback labels
│   └── SettingsModal.tsx   # [MODIFY] Add language selector and translate modal
├── App.tsx                 # [MODIFY] Manage active language state and pass down translations
standalone.html             # [MODIFY] Embed translation dictionary & language switcher
tests/
└── run-all-tests.mjs       # [MODIFY] Add dictionary completeness tests
```
