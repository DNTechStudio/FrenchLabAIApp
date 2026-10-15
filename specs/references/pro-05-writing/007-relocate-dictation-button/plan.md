# Implementation Plan: 007 — Relocate « Mode Dictée » Button Adjacent to « Diff Visuel »

**Branch**: `007-relocate-dictation-button` | **Date**: 2026-09-25 | **Spec**: [specs/007-relocate-dictation-button/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/007-relocate-dictation-button/spec.md)

**Input**: User request: `"/specify move the button \"Mode Dictée\", next to \"Diff Visuel\"."`

---

## 1. Summary

Relocate the **« 🎧 Mode Dictée »** button from the `EditorPane` header to the `ComparisonWindow` toolbar directly adjacent to **« 📊 Diff visuel »**.
1. **Clean Editor Header**: Remove the dictation toggle from the editor header so it focuses purely on essay writing actions (`🗑️ Effacer`), avoiding cognitive clutter.
2. **Contextual Dictation Launch**: Place **« 🎧 Mode Dictée »** alongside **« 📊 Diff visuel »** and **« 👁️ Version améliorée »** in the comparison window toolbar, allowing the learner to immediately transcribe the model text under analysis.
3. **Initial Reference State Availability**: Render the **« 🎧 Mode Dictée »** action button in the empty placeholder card (`📖 B2 (Avancé / Indépendant)`) before essay evaluation, enabling immediate dictation practice on the default reference essay.
4. **Multi-Level Binding**: In dual-window comparison (`B1` + `B2`), clicking **« 🎧 Mode Dictée »** triggers dictation for that specific window's CEFR level text.
5. **Parity**: Dual-implemented with identical styling and behavior across React SPA components and single-file [`standalone.html`](standalone.html).

---

## 2. Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022  
**Primary Dependencies**: React 19, Lucide React (`Headphones`, `Columns`, `Eye`, `Sparkles`, `Trash2`)  
**Components Touched**:
- `src/components/EditorPane.tsx` (remove dictation button from header)
- `src/components/DiffViewer.tsx` (add dictation button next to diff button)
- `src/components/ComparisonWindow.tsx` (pass callback & add button to empty state card)
- `src/components/ComparisonPane.tsx` (forward level-aware dictation callback)
- `src/App.tsx` (bind `onSwitchToDictation` with level parameter)
- `standalone.html` (mirror all UI changes identically)  
**Testing**: `node:test` runner (`node tests/run-all-tests.mjs`)  
**Target Platform**: Modern Web Browsers (Chrome, Edge, Safari, Firefox)  
**Constraints**: Must strictly conform to Constitution Principle V (Parity) and Principle II (Exceptional UX)

---

## 3. Constitution Gate Check

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, zero dead code | Type contracts updated in component props; clean callback signatures; zero dead code | **PASS** |
| **II. Exceptional UX & Learner Delight** | Ergonomic placement, clear visual hierarchy | Separates editor controls from model text actions; contextual dictation launcher right beside visual diff | **PASS** |
| **III. Test-First & Automated Verification** | Continuous verification through automated testing | All 32 existing tests must pass; verification script validates DOM and button presence | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Reusable component system, decoupled rules | Pure presentational and state routing adjustments; domain logic unchanged | **PASS** |
| **V. Performance, Offline Resilience & Parity** | 100% offline parity between React SPA and `standalone.html` | Identical placement and behavior implemented in both React components and `standalone.html` | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## 4. Project Structure & Changes

### Documentation (this feature)
```text
specs/007-relocate-dictation-button/
├── spec.md              # Feature Specification (ratified)
├── plan.md              # This file
└── tasks.md             # Granular Task Breakdown (generated in /tasks)
```

### Source Code Modifications
```text
src/
├── components/
│   ├── EditorPane.tsx          # [MODIFY] Remove dictation button from pane header
│   ├── DiffViewer.tsx          # [MODIFY] Add onSwitchToDictation prop and render button next to diff toggle
│   ├── ComparisonWindow.tsx    # [MODIFY] Pass dictation callback to DiffViewer + render button in initial empty card
│   └── ComparisonPane.tsx      # [MODIFY] Forward level-aware onSwitchToDictation to ComparisonWindow
├── App.tsx                     # [MODIFY] Wire onSwitchToDictation(level) to activate dictation with specific level
standalone.html                 # [MODIFY] 100% parity: remove from editor header, add next to diff button & in empty card
tests/
└── run-all-tests.mjs           # [MODIFY] Ensure test suite remains 100% passing and add contract checks
```

---

## 5. Detailed Component Changes

### 1. `EditorPane.tsx`
- Remove the `onSwitchToDictation` button block from the header `div.pane-header`.
- Keep only `🗑️ Effacer` beside the title `📝 Rédaction Thématique DELF B2`.

### 2. `DiffViewer.tsx`
- Add prop: `onSwitchToDictation?: () => void`.
- In the toolbar `div` containing `[ 📊 Diff visuel ]` and `[ 👁️ Version améliorée ]`, append:
  ```tsx
  {onSwitchToDictation && (
    <button
      className="btn-secondary"
      style={{
        padding: '0.3rem 0.6rem',
        fontSize: '0.75rem',
        color: 'var(--accent-secondary)',
        borderColor: 'rgba(6, 182, 212, 0.35)',
      }}
      onClick={onSwitchToDictation}
      title={translations?.dictation?.tabTitle || "Mode Dictée"}
    >
      <Headphones size={13} />
      <span>{translations?.dictation?.tabTitle || "Mode Dictée"}</span>
    </button>
  )}
  ```

### 3. `ComparisonWindow.tsx`
- Add prop: `onSwitchToDictation?: () => void`.
- Forward `onSwitchToDictation` to `<DiffViewer ... />`.
- In the empty state card (`!result`), add an action button below the description:
  ```tsx
  {onSwitchToDictation && (
    <button
      className="btn-secondary"
      style={{
        marginTop: '0.75rem',
        padding: '0.35rem 0.75rem',
        fontSize: '0.8rem',
        color: 'var(--accent-secondary)',
        borderColor: 'rgba(6, 182, 212, 0.35)',
      }}
      onClick={onSwitchToDictation}
      title={translations?.dictation?.tabTitle || "Mode Dictée"}
    >
      <Headphones size={14} />
      <span>{translations?.dictation?.tabTitle || "Mode Dictée"}</span>
    </button>
  )}
  ```

### 4. `ComparisonPane.tsx` & `App.tsx`
- `ComparisonPaneProps` adds `onSwitchToDictation?: (level: CEFRLevel) => void`.
- `ComparisonPane` calls `onSwitchToDictation(lvl)` for each `ComparisonWindow`.
- In `App.tsx`:
  - `handleSwitchToDictation = (level?: CEFRLevel) => { if (level) setDictationTargetLevel(level); setActiveMode('dictation'); }`
  - Remove `onSwitchToDictation` from `EditorPane`.
  - Pass `onSwitchToDictation={handleSwitchToDictation}` to `ComparisonPane`.

### 5. `standalone.html`
- In `renderEditorPane` / header (lines 1746–1759): Remove `🎧 Mode Dictée` button.
- In `renderComparisonWindow(lvl)`:
  - In empty state (lines 1319–1333): Add `h('button', { className: 'btn-secondary', style: { marginTop: '0.75rem', color: 'var(--accent-secondary)', borderColor: 'rgba(6, 182, 212, 0.35)' }, onClick: () => { ... setActiveMode('dictation'); } }, '🎧 ' + (t.dictation?.tabTitle || 'Mode Dictée'))`.
  - In view mode controls toolbar (lines 1339–1358): Add the `🎧 Mode Dictée` button directly adjacent to `📊 ${t.comparison.tabUnified}`.

---

## 6. Verification & Quality Gates

1. **Gate 1 (Automated Tests)**:
   - Run `node tests/run-all-tests.mjs` -> verify 32/32 tests pass.
2. **Gate 2 (UI & Visual Regression)**:
   - Verify `http://localhost:8080/standalone.html` in browser via subagent:
     - Check Editor header has no dictation button.
     - Check Comparison toolbar has `[ 📊 Diff visuel ] [ 👁️ Version améliorée ] [ 🎧 Mode Dictée ]`.
     - Check initial empty card has `[ 🎧 Mode Dictée ]`.
     - Click `[ 🎧 Mode Dictée ]` and ensure dictation mode loads with audio controls.
