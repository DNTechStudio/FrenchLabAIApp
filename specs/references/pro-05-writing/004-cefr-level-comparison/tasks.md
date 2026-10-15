# Tasks: CEFR Level Multi-Comparison (A1, A2, B1, B2, C1, C2)

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/004-cefr-level-comparison/spec.md) | **Plan**: [plan.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/004-cefr-level-comparison/plan.md) | **Date**: 2026-09-24

## Phase 1: Setup & Domain Definitions

**Purpose**: Establish type-safe CEFR level definitions, storage persistence, and multilingual dictionary keys.

- [x] T001 [P] Create `src/domain/cefrLevels.ts` defining `CEFRLevel`, `ALL_CEFR_LEVELS`, `DEFAULT_CEFR_LEVELS`, color tokens, and metadata configs
- [x] T002 [P] Update `src/domain/types.ts` to export `CEFRLevel`, `MultiLevelResultMap`, add `selectedLevels?: CEFRLevel[]` to `UserSettings`, and add `targetLevel?: CEFRLevel` to `ImprovementRequest`
- [x] T003 Update `src/services/storageService.ts` to validate and persist `selectedLevels` (default: `['B2']`, min: 1, max: 2)
- [x] T004 [P] Update `src/domain/translations.ts` with CEFR level localized titles, descriptions, and selection guidelines in `fr`, `en`, `zh`, and `vi`
- [x] T005 [P] Add unit test suite in `tests/run-all-tests.mjs` verifying CEFR level constraints and dictionary key completeness

---

## Phase 2: UI Level Selection Component (Priority: P1) 🎯 MVP

**Goal**: Render 6 styled CEFR checkboxes/pills above the editor action bar, enforcing strict selection of 1 or 2 levels.

- [x] T006 [US1] Create `src/components/CEFRLevelSelector.tsx` rendering 6 level pills with tooltips and 1-to-2 selection constraint logic
- [x] T007 [US1] Mount `CEFRLevelSelector` into `src/components/EditorPane.tsx` above the action bar
- [x] T008 [US1] Add CSS styles in `src/index.css` for `.cefr-selector-bar`, `.cefr-pill`, level color badges, and active glowing states

---

## Phase 3: Multi-Window Comparison Workspace (Priority: P1) 🎯 MVP

**Goal**: Dynamically open 1 or 2 comparison windows side-by-side based on checked levels, each with its own visual diff, word count, tabs, and copy button.

- [x] T009 [US2] Create modular `src/components/ComparisonWindow.tsx` handling diff display, tabs, word count, criteria badges, and independent copy
- [x] T010 [US2] Refactor `src/components/ComparisonPane.tsx` into a multi-window container dynamically mounting 1 or 2 `ComparisonWindow` instances
- [x] T011 [US2] Update `src/index.css` with responsive multi-window grid layout (`1fr` for 1 window, `1fr 1fr` for 2 windows)
- [x] T012 [US2] Wire `selectedLevels` state and `multiLevelResults` map in `src/App.tsx`, preserving candidate drafts during level switching

---

## Phase 4: AI Generation per Level (Mock & Gemini) (Priority: P1) 🎯 MVP

**Goal**: When clicking "Improve with AI", generate level-tailored French rewrites corresponding to the active 1 or 2 levels.

- [x] T013 [US3] Update `src/services/mockImprovementService.ts` with authentic French rewrites and pedagogical notes for A1, A2, B1, B2, C1, C2
- [x] T014 [US3] Update `src/services/geminiImprovementService.ts` to inject target CEFR level guidelines into prompt instructions
- [x] T015 [US3] Update `handleImprove` in `src/App.tsx` to execute concurrent generation for all selected levels with independent loading states

---

## Phase 5: Standalone Single-File App Parity (Priority: P2)

**Goal**: Provide 100% offline parity in `standalone.html` with CEFR checkboxes, 1-or-2 window layout, and level-adapted mock generation.

- [x] T016 [US5] Add CEFR level checkboxes and 1-to-2 selection constraint logic in `standalone.html`
- [x] T017 [US5] Implement responsive multi-window comparison container styles in `standalone.html`
- [x] T018 [US5] Embed level-adapted mock rewrites and dual-window rendering logic in `standalone.html`

---

## Phase 6: Automated Verification & Review (Priority: P1)

**Goal**: Verify all automated tests pass and conduct browser testing.

- [x] T019 Run automated test suite (`node tests/run-all-tests.mjs`)
- [x] T020 Perform interactive browser verification using browser subagent
- [x] T021 Update `tasks.md` and document verification results in `walkthrough.md`
