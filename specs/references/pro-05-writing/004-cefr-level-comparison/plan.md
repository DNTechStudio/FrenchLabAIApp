# Implementation Plan: CEFR Level Multi-Comparison (A1, A2, B1, B2, C1, C2)

**Branch**: `004-cefr-level-comparison` | **Date**: 2026-09-24 | **Spec**: [specs/004-cefr-level-comparison/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/004-cefr-level-comparison/spec.md)

**Input**: Feature specification from `specs/004-cefr-level-comparison/spec.md`

---

## 1. Summary

Implement a dynamic, pedagogical CEFR level comparison system allowing learners to:
1. Select **1 or 2 target CEFR levels** (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`) via interactive pill checkboxes with level color coding and strict 1-to-2 selection enforcement.
2. Dynamically expand the workspace into **1 or 2 comparison windows** opening side-by-side or responsively stacked.
3. Generate **level-tailored AI rewritten essays** in French matching the selected levels when clicking "Improve with AI" (Améliorer ma rédaction).
4. Inspect independent visual diffs, word counts, criteria scores, and pedagogical notes within each open window.
5. Persist level selections in `localStorage` under `UserSettings.selectedLevels` with safe fallback to `['B2']`.
6. Maintain 100% parity across both the React application and the zero-dependency distribution ([`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html)).
7. Fully localize level names and guidance in French, English, Chinese, and Vietnamese.

---

## 2. Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022  
**Primary Dependencies**: React 19, Lucide React (Check, Layers, Sparkles icons)  
**Storage**: Browser `localStorage` (`UserSettings.selectedLevels`)  
**Testing**: `node:test` test runner (`node tests/run-all-tests.mjs`) for constraint verification and dictionary key completeness  
**Target Platform**: Modern Web Browsers (desktop & mobile)  
**Performance Goals**: <50ms layout transition between 1 and 2 windows; zero memory leaks during concurrent AI generation; zero data loss for active drafts  

---

## 3. Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, zero dead code | `CEFRLevel` union type, `CEFRLevelSelector` component, modular `ComparisonWindow` component | **PASS** |
| **II. Exceptional UX & Learner Delight** | Zero data loss, instantaneous feedback (<50ms), accessible contrast | Level toggling never resets editor text; selection constraints prevent invalid states; color-coded badges enhance clarity | **PASS** |
| **III. Test-First & Automated Verification** | Automated tests for selection logic and level generation | Automated tests in `tests/run-all-tests.mjs` verifying 1-2 level constraints, fallback, and dictionary coverage | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decouple level metadata from UI rendering | CEFR level configs defined in `src/domain/cefrLevels.ts` and translations in `src/domain/translations.ts` | **PASS** |
| **V. Performance & Offline Resilience** | Offline-first, sub-100ms response | Full offline support with Mock level generation in both React SPA and `standalone.html` | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## 4. Project Structure

### Documentation (this feature)
```text
specs/004-cefr-level-comparison/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Technical Research & Architecture Decisions
├── data-model.md        # Data Model & Schema Definitions
└── quickstart.md        # Verification & Testing Guide
```

### Source Code Modifications
```text
src/
├── domain/
│   ├── types.ts            # [MODIFY] Add CEFRLevel, MultiLevelResultMap, update UserSettings
│   ├── cefrLevels.ts       # [NEW] CEFR level constants, color tokens, and metadata
│   ├── translations.ts     # [MODIFY] Add CEFR level localized titles, descriptions, and hints
│   └── mockImprovementService.ts # [MODIFY] Add level-tailored rewrites for A1, A2, B1, B2, C1, C2
├── services/
│   ├── storageService.ts   # [MODIFY] Persist and load selectedLevels in UserSettings
│   └── geminiImprovementService.ts # [MODIFY] Include target CEFR level in Gemini prompt
├── components/
│   ├── CEFRLevelSelector.tsx # [NEW] 6 pill checkboxes with 1-2 constraint enforcement
│   ├── ComparisonWindow.tsx  # [NEW] Reusable individual comparison window
│   ├── ComparisonPane.tsx    # [MODIFY] Multi-window container rendering 1 or 2 ComparisonWindows
│   ├── EditorPane.tsx        # [MODIFY] Mount CEFRLevelSelector above action bar
│   └── Header.tsx / App.tsx  # [MODIFY] Manage selectedLevels and multi-level results state
├── index.css               # [MODIFY] Multi-window grid layout, level color tokens, pill styling
standalone.html             # [MODIFY] Parity implementation of checkboxes, layout, and level logic
tests/
└── run-all-tests.mjs       # [MODIFY] Add automated tests for CEFR level constraints & translations
```

---

## 5. Implementation Phases

### Phase 1: Setup & Domain Model
- Define `CEFRLevel` (`'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'`) and level configs in `src/domain/cefrLevels.ts`.
- Update `UserSettings` in `src/domain/types.ts` to include `selectedLevels: CEFRLevel[]`.
- Update `StorageService` to validate and persist `selectedLevels` with default `['B2']`.
- Add CEFR level translation strings in `src/domain/translations.ts` for FR, EN, ZH, and VI.

### Phase 2: Selection Component & Constraint Logic
- Implement `src/components/CEFRLevelSelector.tsx` rendering 6 level buttons/checkboxes.
- Enforce selection constraints:
  - Minimum 1 level (cannot deselect last one).
  - Maximum 2 levels (blocks 3rd selection with tooltip).
- Integrate `CEFRLevelSelector` into `EditorPane.tsx`.

### Phase 3: Multi-Window Comparison Workspace
- Refactor comparison rendering into a modular `ComparisonWindow.tsx` component.
- Update `ComparisonPane.tsx` to handle 1 or 2 open windows based on `selectedLevels`.
- Implement responsive CSS in `src/index.css` for 1-window (`1fr`) vs 2-window (`1fr 1fr`) layouts.
- Provide independent visual diffs, tab toggles, word counts, and copy buttons for each window.

### Phase 4: AI Generation per Level (Mock & Gemini)
- Update `MockImprovementService` with distinct level-adapted text and pedagogical notes for A1, A2, B1, B2, C1, and C2.
- Update `GeminiImprovementService` to inject CEFR level guidelines into prompt instructions.
- Update `App.tsx` to trigger parallel improvement requests for all active levels and track per-level loading states.

### Phase 5: Standalone Single-File Parity
- Add level selector checkboxes, multi-window comparison grid, and level-adapted mock texts into `standalone.html`.
- Localize all elements across all 4 languages in `standalone.html`.

### Phase 6: Automated Testing & Browser Verification
- Add automated tests to `tests/run-all-tests.mjs` verifying selection rules, storage fallback, and translation coverage.
- Conduct comprehensive browser subagent verification on both desktop and mobile viewports.
