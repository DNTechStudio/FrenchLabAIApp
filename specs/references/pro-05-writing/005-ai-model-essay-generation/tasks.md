# Tasks: 005 — AI Model Essay Generation on Empty Input

**Input**: Design documents from `specs/005-ai-model-essay-generation/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`)  
**Prerequisites**: All design documents approved  
**Tests**: Automated tests in `tests/run-all-tests.mjs` verifying empty-input handling and model essay generation  

---

## Phase 1: Setup & Foundational Prerequisites

**Purpose**: Core types and service interface definitions required before story implementation.- [x] **T001** `[P]` Update domain types in `src/domain/types.ts` to add `isAutonomous?: boolean` flag to `ImprovementRequest` and service signatures.
- [x] **T002** `[P]` Update localized tooltips and helper strings in `src/domain/translations.ts` (FR, EN, ZH, VI) for the empty-editor state.

---

## Phase 2: User Story 1 - One-Click Model Answer Generation from Empty Editor (Priority: P1) 🎯 MVP

**Goal**: Candidate can click « Améliorer avec l'IA » on an empty draft and receive an exemplary model essay answering the active exam prompt.  
**Independent Test**: Load app, leave editor empty, click « Améliorer avec l'IA », verify an exemplary B2 model essay is generated with appropriate word count and criteria notes.

### Tests for User Story 1
- [x] **T003** `[P]` `[US1]` Add automated test in `tests/run-all-tests.mjs` verifying that calling `mockImprovementService.improveEssay(prompt, "")` returns a valid, non-empty model essay (>200 words) with valid pedagogical notes.

### Implementation for User Story 1
- [x] **T004** `[US1]` Implement autonomous model essay generation in `src/domain/mockImprovementService.ts`:
  - Detect `text.trim().length === 0` as autonomous generation mode.
  - Return authentic exemplary model essays answering each exam prompt in `PROMPTS` (`tele-travail`, `pistes-cyclables`, `uniforme-scolaire`, `ia-education`, `semaine-4-jours`) at B2 level.
  - Populate structured pedagogical criteria notes explaining key rhetorical decisions.
- [x] **T005** `[US1]` Update `src/components/EditorPane.tsx`:
  - Change button disabled condition from `disabled={isLoading || wordCount < 10}` to `disabled={isLoading}`.
  - Update button title/tooltip when `wordCount === 0` to indicate model essay generation.
- [x] **T006** `[US1]` Ensure `App.tsx` handles empty text in `handleImprove` without aborting or triggering validation errors.

**Checkpoint**: User Story 1 works end-to-end for the default single B2 level.

---

## Phase 3: User Story 2 - Comparative Model Essays Across Multiple CEFR Levels (Priority: P1) 🎯 MVP

**Goal**: When 2 CEFR levels (e.g., `B1` and `C1`) are selected and draft is empty, generate two distinct, level-tailored model essays answering the same prompt side-by-side.  
**Independent Test**: Select `B1` and `C1`, leave editor empty, click « Améliorer avec l'IA », verify 2 windows open with B1 and C1 model essays respectively.

### Tests for User Story 2
- [x] **T007** `[P]` `[US2]` Add automated test in `tests/run-all-tests.mjs` verifying that `mockImprovementService.improveEssay(prompt, "", level)` returns valid model essays for all 6 CEFR levels (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`).

### Implementation for User Story 2
- [x] **T008** `[US2]` Expand `src/domain/mockImprovementService.ts` to support all 6 CEFR levels in autonomous mode:
  - `A1`: 60–80 words, simple isolated sentences, basic daily vocabulary.
  - `A2`: 100–120 words, everyday situations, simple past (*passé composé*), common connectors (*et, mais, parce que*).
  - `B1`: 160–190 words, structured paragraphs, standard connectors (*d'abord, ensuite, à mon avis*).
  - `B2`: 250–300 words, formal arguments, varied connectors (*néanmoins, par conséquent*), subjunctive.
  - `C1`: 280–350 words, sophisticated syntax, nuanced rhetorical devices, rich vocabulary.
  - `C2`: 300–400 words, academic/literary eloquence, impeccable native precision.
- [x] **T009** `[US2]` Ensure parallel multi-window rendering in `ComparisonPane.tsx` passes the generated model essays and correct level metadata to each window.

**Checkpoint**: User Stories 1 and 2 work in full harmony with Feature 004 (CEFR Multi-Comparison).

---

## Phase 4: User Story 3 - Visual Diff Behavior & Default Clean View on Empty Draft (Priority: P2)

**Goal**: Comparison windows default to Clean View (`viewMode: 'clean'`) on model generation to avoid confusing red/green diffs against an empty string.  
**Independent Test**: Generate model essay on empty draft; confirm the window immediately displays clean text (`Version améliorée [Level]`). Switching to `Diff visuel` shows token additions cleanly without errors.

### Implementation for User Story 3
- [x] **T010** `[US3]` Update `src/components/ComparisonWindow.tsx`:
  - When displaying an autonomous model generation (`!originalText.trim()`), default `viewMode` state to `'clean'`.
- [x] **T011** `[US3]` In `src/domain/mockImprovementService.ts`:
  - When `originalText` is empty, generate `diffTokens` where all tokens are tagged as added/neutral tokens with clean presentation.

---

## Phase 5: User Story 4 - Dual-Engine Support (Gemini API Provider) (Priority: P2)

**Goal**: Full support for autonomous model essay generation when using the online Google Gemini API.  
**Independent Test**: Configure Gemini API key, select Gemini provider, leave editor empty, click « Améliorer avec l'IA », verify Gemini produces a complete model essay at the target level.

### Implementation for User Story 4
- [x] **T012** `[US4]` Update `src/services/geminiImprovementService.ts`:
  - Detect `text.trim().length === 0`.
  - Format autonomous model generation prompt instructing Gemini to compose an exemplary essay answering the prompt scenario and instructions at `targetLevel`.
  - Parse the structured JSON response into `ImprovementResult`.

---

## Phase 6: Single-File Distribution Parity (`standalone.html`) & Verification (Priority: P1)

**Goal**: Guarantee 100% parity in the standalone offline HTML distribution.  
**Independent Test**: Open `standalone.html` in Chrome, leave editor empty, click « Améliorer avec l'IA », verify model essays generate flawlessly in both single and multi-level modes.

- [x] **T013** `[P]` Update `standalone.html`:
  - Remove `wordCount < 10` restriction from `handleImprove` and button `disabled` attribute.
  - Implement autonomous model essay generation in `improveEssayMock` across all exam prompts and 6 CEFR levels.
  - Implement autonomous prompt construction in `improveEssayGemini`.
  - Auto-set `levelViewModes[lvl] = 'clean'` for autonomous results.
- [x] **T014** Run automated test suite:
  ```bash
  node tests/run-all-tests.mjs
  ```
- [x] **T015** Perform manual browser verification in Google Chrome:
  - Test empty editor + B2: verify full B2 model essay appears in clean view.
  - Test empty editor + B1 & C1: verify 2 side-by-side model essays appear.
  - Test typing text (>10 words): verify original draft improvement / diff flow is preserved.
