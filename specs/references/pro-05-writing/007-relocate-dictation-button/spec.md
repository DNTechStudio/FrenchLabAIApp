# Feature Specification: 007 — Relocate « Mode Dictée » Button Adjacent to « Diff Visuel »

**Feature Branch**: `007-relocate-dictation-button`  
**Created**: 2026-09-25  
**Status**: Draft  
**Input**: User request: `"/specify move the button \"Mode Dictée\", next to \"Diff Visuel\"."`  

---

## 1. Overview & Context

In Feature 006, the French Dictation Mode (« La Dictée DELF B2 ») was introduced. As an initial entry point, the **« 🎧 Mode Dictée »** toggle button was placed in the header of the `EditorPane`, next to the **« 🗑️ Effacer »** draft reset button.

Learner feedback and UX analysis highlight two key ergonomic observations:
1. **Separation of Concerns**: The Editor pane header is intended for editor actions (clearing text, word counts, theme settings), whereas Dictation Mode transcribes and assesses against the **reference model answer** produced in the comparison pane.
2. **Contextual Affinity**: The comparison window houses the reference texts and the view toggle controls (**« 📊 Diff visuel »** / **« 👁️ Version améliorée »**). Placing **« 🎧 Mode Dictée »** in this toolbar alongside **« 📊 Diff visuel »** provides a natural, intuitive gateway: the learner views the model/diff text and can immediately launch audio dictation on that exact text.

This feature relocates the **« 🎧 Mode Dictée »** button:
- **Removed from**: `EditorPane` header (leaving only `🗑️ Effacer` beside the editor title).
- **Relocated to**: The toolbar of each `ComparisonWindow`, positioned directly adjacent to **« 📊 Diff visuel »** (e.g. `[📊 Diff visuel] [👁️ Version améliorée] [🎧 Mode Dictée]`).
- **Initial Reference State Support**: The button is also accessible before text evaluation/generation, allowing learners to immediately launch dictation on the default reference model essay for the selected CEFR level.

---

## 2. User Scenarios & Acceptance Criteria *(mandatory)*

### User Story 1 - Relocate Button to Comparison Toolbar (Priority: P1) 🎯 MVP

As a DELF B2 learner studying model essays and visual diffs, I want to access « Mode Dictée » directly from the comparison toolbar next to « Diff Visuel », so that I can listen and transcribe the exact text I am currently analyzing.

**Why this priority**: Directly fulfills the user requirement to clean up the editor header and position the dictation trigger in its logical context next to « Diff Visuel ».

**Independent Test**:
1. Open the application (`standalone.html` or React SPA).
2. Verify that the Editor Pane header displays only the title and `🗑️ Effacer` (no `🎧 Mode Dictée` button).
3. In the Comparison Window, locate the toolbar containing `📊 Diff visuel` and verify `🎧 Mode Dictée` sits directly adjacent to it.
4. Click `🎧 Mode Dictée`; verify the workspace transitions smoothly into Dictation Mode using the corresponding model text.

**Acceptance Scenarios**:
1. **Given** the candidate is on the workspace, **When** they inspect the Editor Pane header, **Then** only the pane title and the `🗑️ Effacer` button are present.
2. **Given** a comparison window displays evaluated text or model essay, **When** the candidate views the toolbar containing `📊 Diff visuel`, **Then** the **« 🎧 Mode Dictée »** button is displayed directly next to `📊 Diff visuel` and `👁️ Version améliorée`.
3. **Given** the candidate clicks **« 🎧 Mode Dictée »**, **Then** the application switches `activeMode` to `'dictation'` with the selected CEFR level and text loaded.

---

### User Story 2 - Dictation Access in Initial Reference State (Priority: P1) 🎯 MVP

As a candidate opening the app on a fresh prompt before clicking « Améliorer mon texte », I want to launch Dictation Mode directly from the reference model card, so that I can practice listening comprehension without needing to submit an essay first.

**Why this priority**: Many learners use dictation as their primary entry point to study a topic before writing their own essay.

**Independent Test**:
1. Load a fresh prompt with no user input.
2. In the initial Comparison Window placeholder card (`📖 B2 (Avancé / Indépendant)`), verify the **« 🎧 Mode Dictée »** button is visible.
3. Click it and confirm audio dictation loads with the prompt's default reference text.

**Acceptance Scenarios**:
1. **Given** no essay evaluation has been performed (`!result`), **When** viewing the Comparison Window empty state card, **Then** a prominent **« 🎧 Mode Dictée »** action button is displayed.
2. **Given** the candidate clicks this action button, **Then** Dictation Mode launches targeting the default model essay for that CEFR level.

---

### User Story 3 - Multi-Level Dual-Window Dictation Binding (Priority: P2)

As a learner comparing two CEFR levels (e.g. `B1` and `B2`), I want each comparison window toolbar to have its own « Mode Dictée » trigger, so that clicking it dictates the specific text for that level.

**Why this priority**: Seamlessly leverages the multi-level architecture established in Feature 004 & 005.

**Acceptance Scenarios**:
1. **Given** dual comparison windows are open (`B1` and `B2`), **When** the candidate clicks **« 🎧 Mode Dictée »** in the `B1` window, **Then** Dictation Mode launches with the `B1` text.
2. **Given** the candidate clicks **« 🎧 Mode Dictée »** in the `B2` window, **Then** Dictation Mode launches with the `B2` text.

---

## 3. UI/UX Design & Ergonomics

### Toolbar Layout Specification
Inside each comparison card (active state):
```
+-----------------------------------------------------------------------------------+
|  ✨ B2 — Avancé / Indépendant         245 mots              [ 📋 Copier B2 ]      |
+-----------------------------------------------------------------------------------+
|  DIFF VISUEL                                                                      |
|  [ 📊 Diff visuel ]   [ 👁️ Version améliorée B2 ]   [ 🎧 Mode Dictée ]             |
+-----------------------------------------------------------------------------------+
|  Diff text with additions and deletions...                                        |
+-----------------------------------------------------------------------------------+
```

### Initial State Card Layout
```
+-----------------------------------------------------------------------------------+
|  ✨ B2 — Avancé / Indépendant                                                      |
+-----------------------------------------------------------------------------------+
|                                      📖                                           |
|                           B2 (Avancé / Indépendant)                               |
|   Modèle de référence B2 avec vocabulaire riche, connecteurs logiques...           |
|                                                                                   |
|                               [ 🎧 Mode Dictée ]                                  |
+-----------------------------------------------------------------------------------+
```

### Editor Header Layout (Cleaned)
```
+-----------------------------------------------------------------------------------+
|  📝 Rédaction Thématique DELF B2                                   [ 🗑️ Effacer ] |
+-----------------------------------------------------------------------------------+
```

---

## 4. Parity & Constitutional Requirements

1. **Parity (Principle V)**: All changes MUST be implemented simultaneously in:
   - React SPA components: `src/components/EditorPane.tsx`, `src/components/ComparisonWindow.tsx`, `src/components/DiffViewer.tsx`, and `src/App.tsx`.
   - Zero-dependency distribution: `standalone.html`.
2. **Automated Verification (Principle III)**:
   - All 32 existing tests in `tests/run-all-tests.mjs` must remain passing.
   - Any new test assertions for button placement must be added and verified.
3. **Accessibility & Responsive Design**:
   - Buttons must have `aria-label` / `title` attributes matching localized translations.
   - On mobile screens (<640px), the toolbar buttons must wrap cleanly with no overflow.
