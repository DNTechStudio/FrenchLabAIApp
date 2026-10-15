# Tasks: 007 — Relocate « Mode Dictée » Button Adjacent to « Diff Visuel »

**Input**: Design documents from `specs/007-relocate-dictation-button/` (`spec.md`, `plan.md`)  
**Prerequisites**: All design documents approved; Constitution Gate Check: PASS  
**Tests**: Automated tests in `tests/run-all-tests.mjs`  

---

## Phase 1: Automated Contract & Placement Verification

**Purpose**: Test-first verification ensuring DOM contracts for button placement are rigorously validated.

- [x] **T001** `[P]` Add automated test suite in `tests/run-all-tests.mjs`:
  - Validate that `standalone.html` does NOT contain `Mode Dictée` inside the editor pane header.
  - Validate that `standalone.html` contains `Mode Dictée` in the comparison toolbar adjacent to `Diff visuel`.
  - Validate that `standalone.html` contains `Mode Dictée` in the initial empty comparison card.

---

## Phase 2: React SPA Component Refactoring

**Goal**: Relocate button cleanly in the React SPA component hierarchy while passing level context.

- [x] **T002** Update `src/components/EditorPane.tsx`:
  - Remove the `onSwitchToDictation` button from `pane-header`.
  - Retain `🗑️ Effacer` beside the pane title for a distraction-free writing header.
- [x] **T003** Update `src/components/DiffViewer.tsx`:
  - Add optional prop `onSwitchToDictation?: () => void` to `DiffViewerProps`.
  - In the toolbar `div`, render the `[🎧 Mode Dictée]` button right next to `[📊 Diff visuel]`.
- [x] **T004** Update `src/components/ComparisonWindow.tsx`:
  - Add optional prop `onSwitchToDictation?: () => void` to `ComparisonWindowProps`.
  - Forward `onSwitchToDictation` into `<DiffViewer ... />`.
  - In the initial empty state (`!result`), render a prominent `[🎧 Mode Dictée]` action button under the level description.
- [x] **T005** Update `src/components/ComparisonPane.tsx` and `src/App.tsx`:
  - In `ComparisonPane.tsx`, accept `onSwitchToDictation?: (level: CEFRLevel) => void` and pass level-specific callbacks to each `ComparisonWindow`.
  - In `App.tsx`, create `handleSwitchToDictation(level?: CEFRLevel)`, set target level and `activeMode = 'dictation'`, remove callback from `EditorPane`, and pass to `ComparisonPane`.

---

## Phase 3: Single-File Distribution Parity (`standalone.html`)

**Goal**: Maintain 100% parity in `standalone.html` (Constitution Principle V).

- [x] **T006** Update `standalone.html`:
  - Remove `🎧 Mode Dictée` button from `EditorPane` header (lines ~1746–1759).
  - In `renderComparisonWindow(lvl)` view mode controls: Add `[🎧 Mode Dictée]` button directly adjacent to `📊 ${t.comparison.tabUnified}`.
  - In `renderComparisonWindow(lvl)` initial state card: Add `[🎧 Mode Dictée]` action button below the level description.
  - Update click handler to set `dictationTargetLevel = lvl` when clicked from a specific level window.

---

## Phase 4: Verification & Quality Gates

**Goal**: Complete end-to-end verification across test runner and real browser environment.

- [x] **T007** Execute automated test suite:
  - Run `node tests/run-all-tests.mjs`.
  - Verify all existing and new tests pass cleanly with 0 failures.
- [x] **T008** Browser verification via `browser_subagent`:
  - Navigate to `http://localhost:8080/standalone.html`.
  - Confirm `EditorPane` header has only `🗑️ Effacer`.
  - Confirm initial reference card displays `[🎧 Mode Dictée]`.
  - Click `[✨ Améliorer mon texte]` to evaluate; confirm toolbar shows `[📊 Diff visuel] [👁️ Version améliorée B2] [🎧 Mode Dictée]`.
  - Click `[🎧 Mode Dictée]` and confirm dictation audio interface loads seamlessly.
