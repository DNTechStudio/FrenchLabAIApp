# Tasks: DELF B2 Writing Practice Application

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/spec.md) | **Plan**: [plan.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/plan.md) | **Date**: 2026-09-21

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, toolchain configuration, and baseline design tokens.

- [X] T001 Initialize React + TypeScript + Vite project structure with `package.json`, `tsconfig.json`, `vite.config.ts`, and `index.html`
- [X] T002 [P] Install core runtime and testing dependencies (`react`, `react-dom`, `diff`, `@types/diff`, `lucide-react`, `vitest`, `@testing-library/react`, `jsdom`) in `package.json`
- [X] T003 [P] Configure global design system tokens, typography (Outfit & Inter), responsive container, and color variables (dark theme, glassmorphism, diff colors) in `src/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data types, prompt repository, storage layer, and base layout required before implementing user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 [P] Define core TypeScript domain interfaces (`Prompt`, `PromptCategory`, `EssayDraft`, `DiffToken`, `PedagogicalNote`, `DelfCriterion`, `ImprovementResult`, `UserSettings`) in `src/domain/types.ts`
- [X] T005 [P] Implement curated official DELF B2 prompts repository (at least 6 realistic prompts across `lettre_formelle`, `essai_argumentatif`, `article_forum`) with scenario, instructions, and targetWordCount (250) in `src/domain/prompts.ts`
- [X] T006 [P] Create LocalStorage persistence manager with debounced saving, versioned schema (`delf_b2_storage_v1`), draft recovery, and settings in `src/services/storageService.ts`
- [X] T007 Implement base Application Layout with Header, theme toggle, and responsive two-pane grid in `src/App.tsx` and `src/components/Header.tsx`

**Checkpoint**: Foundation ready - User Story 1 implementation can now proceed.

---

## Phase 3: User Story 1 - Prompt Selection & Distraction-Free Composition (Priority: P1) 🎯 MVP

**Goal**: Candidates can select a DELF B2 prompt (or random topic), compose their essay in a clean editor, track words in real-time towards the 250-word goal, and have drafts autosaved.

**Independent Test**: Select a topic, click "Random Topic", write text in editor, verify real-time French word counter updates instantaneously (<50ms), and refresh the browser to confirm draft restoration without data loss.

### Tests for User Story 1 🧪
- [X] T008 [P] [US1] Unit tests for French word counter (testing elisions `c'est` = 2, `l'arbre` = 2, hyphens `peut-être`, punctuation stripping, whitespace handling) in `tests/unit/frenchWordCounter.test.ts`
- [X] T009 [P] [US1] Unit tests for local storage service draft saving and recovery in `tests/unit/storageService.test.ts`

### Implementation for User Story 1
- [X] T010 [US1] Implement French linguistic word counter algorithm respecting apostrophes/elisions and DELF counting standards in `src/domain/frenchWordCounter.ts`
- [X] T011 [P] [US1] Create PromptSelector component with categorized dropdown (`lettre_formelle`, `essai_argumentatif`, `article_forum`), prompt description viewer, and "Random Topic" button in `src/components/PromptSelector.tsx`
- [X] T012 [P] [US1] Create WordCounterBadge component with real-time count, progress bar toward 250 words, and status indicator (`under_target`, `target_achieved`) in `src/components/WordCounterBadge.tsx`
- [X] T013 [US1] Implement EditorPane component integrating PromptSelector, distraction-free textarea, WordCounterBadge, and debounced autosave trigger in `src/components/EditorPane.tsx`
- [X] T014 [US1] Integrate EditorPane with App state and LocalStorage persistence in `src/App.tsx`

**Checkpoint**: User Story 1 is fully functional and tested independently as an MVP.

---

## Phase 4: User Story 2 - AI Essay Improvement & Visual Diff Comparison (Priority: P2)

**Goal**: Candidates can request AI improvement and compare their original essay with the elevated B2 version using red visual diffing.

**Independent Test**: Enter an essay draft, click "AI Improve", and verify the comparison pane displays original vs improved text with deletions/modifications highlighted in red with strike-through and B2 additions in emerald/green.

### Tests for User Story 2 🧪
- [X] T015 [P] [US2] Unit tests for word-level Myers LCS diff engine in `tests/unit/diffEngine.test.ts`
- [X] T016 [P] [US2] Contract test for Mock Improvement Service validating compliance with `contracts/ai-improvement.contract.json` in `tests/contract/mockImprovementService.test.ts`

### Implementation for User Story 2
- [X] T017 [US2] Implement word-level diffing utility wrapping `diffWordsWithSpace` producing typed `DiffToken[]` in `src/domain/diffEngine.ts`
- [X] T018 [P] [US2] Define abstract `ImprovementService` interface and request/response contracts in `src/services/improvementService.ts`
- [X] T019 [US2] Implement built-in `MockImprovementService` with offline DELF B2 grammar/vocabulary enhancement rules and realistic B2 rewrites in `src/services/mockImprovementService.ts`
- [X] T020 [P] [US2] Implement DiffViewer component rendering word-level visual diffs with `.diff-removed` (red with strike-through) and `.diff-added` (emerald highlight) in `src/components/DiffViewer.tsx`
- [X] T021 [US2] Implement ComparisonPane component with side-by-side original vs improved view and loading indicator in `src/components/ComparisonPane.tsx`
- [X] T022 [US2] Wire "AI Improve" action button in EditorPane and render ComparisonPane in `src/App.tsx`

**Checkpoint**: User Stories 1 AND 2 are fully functional and tested together.

---

## Phase 5: User Story 3 - DELF B2 Pedagogical Notes & Rubric Feedback (Priority: P3)

**Goal**: Display structured pedagogical notes mapped to official DELF B2 criteria (*Correction sociolinguistique*, *Cohérence et cohésion*, *Compétence morphosyntaxique*, *Richesse lexicale*).

**Independent Test**: Run AI Improve on an essay and verify that pedagogical notes render distinct cards explaining grammatical, lexical, and structural enhancements mapped to DELF criteria.

### Tests for User Story 3 🧪
- [X] T023 [P] [US3] Unit tests verifying pedagogical notes generation covering at least 3 distinct DELF B2 criteria in `tests/unit/pedagogicalNotes.test.ts`

### Implementation for User Story 3
- [X] T024 [US3] Enhance `MockImprovementService` to generate contextual DELF B2 criterion notes explaining why replacements were made (e.g. subjunctive mood, formal letter closing formulas, logical connectors) in `src/services/mockImprovementService.ts`
- [X] T025 [P] [US3] Implement PedagogicalNotes component with criterion filter badges and explanation cards in `src/components/PedagogicalNotes.tsx`
- [X] T026 [US3] Integrate PedagogicalNotes within ComparisonPane with interactive highlight linkage in `src/components/ComparisonPane.tsx`

**Checkpoint**: User Stories 1, 2, and 3 are complete.

---

## Phase 6: User Story 4 - Essay Copying, Export & Session Reset (Priority: P4)

**Goal**: Candidates can easily copy the improved essay to clipboard or reset their session with confirmation, and configure AI providers.

**Independent Test**: Click "Copy Improved Version" and verify clipboard content; click "New Essay / Reset" and verify confirmation modal resets the editor cleanly; test SettingsModal provider selection.

### Implementation for User Story 4
- [X] T027 [P] [US4] Implement clipboard copy utility and toast/notification feedback in `src/components/ComparisonPane.tsx`
- [X] T028 [US4] Implement session reset confirmation dialog and state reset handler in `src/components/EditorPane.tsx`
- [X] T029 [P] [US4] Implement SettingsModal component allowing users to configure AI provider (`mock`, `gemini`, `openai`) and enter API keys in `src/components/SettingsModal.tsx`
- [X] T030 [US4] Implement optional `GeminiImprovementService` calling Google Gemini API with structured JSON schema in `src/services/geminiImprovementService.ts`

**Checkpoint**: All user stories (P1 through P4) are functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Verification, responsive refinement, and test execution.

- [X] T031 [P] Run full test suite (`npm test`) and verify all unit and contract tests pass in `tests/`
- [X] T032 Verify and optimize UI responsiveness on mobile, tablet, and desktop breakpoints in `src/index.css`
- [X] T033 Execute end-to-end verification scenarios per `specs/001-delf-b2-writing-practice/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Completed.
- **Foundational (Phase 2)**: Completed.
- **User Story 1 (Phase 3 - P1)**: Completed.
- **User Story 2 (Phase 4 - P2)**: Completed.
- **User Story 3 (Phase 5 - P3)**: Completed.
- **User Story 4 (Phase 6 - P4)**: Completed.
- **Polish (Phase 7)**: Completed.
