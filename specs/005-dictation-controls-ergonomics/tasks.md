# Tasks: Dictation Controls Ergonomics & Keybinding Optimization (005-dictation-controls-ergonomics)

**Input**: Design documents from `specs/005-dictation-controls-ergonomics/`  
**Prerequisites**: [spec.md](spec.md) (required), [plan.md](plan.md) (required)  
**Tests**: Automated tests in `tests/french-lab.test.js` (Test 16)  
**Target Platform**: Browser (Pure Vanilla JS ESM + Vanilla CSS)  

---

## Phase 1: Keybinding & Shortcuts Refactoring

**Purpose**: Restore standard spacebar typing inside textarea and remap replay to `Ctrl+R`.

- [x] T001 Update `handleKeyDown(e)` in `src/ui/DictationView.js` to intercept `Ctrl+Space` for Écouter (Play/Pause/Resume), and allow standard spacebar insertion in textarea without toggling audio.
- [x] T002 Update `handleKeyDown(e)` in `src/ui/DictationView.js` to intercept `(e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R' || e.code === 'KeyR')`, call `e.preventDefault()`, `e.stopPropagation()`, and trigger `this.playCurrentSentence()`.
- [x] T003 Remove the legacy `Shift+Space` keydown listener on `textarea` in `src/ui/DictationView.js`.

**Checkpoint**: Spacebar types normally in textarea; `Ctrl+Space` toggles Écouter; `Ctrl+R` triggers Replay without page refresh.

---

## Phase 2: Deck Controls Layout & Button Swap

**Purpose**: Swap the positions of `Réécouter` and `Suivant` to form a standard 3-button playback/navigation row and a centered replay row.

- [x] T004 Update `render()` in `src/ui/DictationView.js`:
  - Place `#btn-prev-sentence`, `#btn-play-sentence`, and `#btn-next-sentence` together in `.deck-controls-row-1`.
  - Place `#btn-replay-sentence` centered inside `.deck-controls-row-2`.
- [x] T005 Update shortcut badge text on `#btn-play-sentence` to `<kbd class="shortcut-badge">Ctrl+Space</kbd>`, on `#btn-replay-sentence` to `<kbd class="shortcut-badge">Ctrl+R</kbd>` and on `#btn-next-sentence` to `<kbd class="shortcut-badge">Ctrl+→</kbd>` in `src/ui/DictationView.js`.
- [x] T006 Remove `💡 Shift+Space = espace` badge from `.deck-accent-row` and update textarea placeholder texts in `src/ui/DictationView.js`.

**Checkpoint**: UI template displays `[Précédent] [Play] [Suivant]` in Row 1 and `[Réécouter]` in Row 2.

---

## Phase 3: CSS Styling Adjustments

**Purpose**: Ensure harmonious flex spacing and button balance for the swapped controls.

- [x] T007 Update `.deck-controls-row-1` and `.deck-controls-row-2` styling in `src/styles/dictation.css` to ensure 3 buttons in Row 1 have equal height, balanced flex proportions, and Row 2 centers `#btn-replay-sentence`.

**Checkpoint**: Visual styling is polished, balanced, and responsive across all screen sizes.

---

## Phase 4: Automated Testing & Verification

**Purpose**: Validate new shortcuts and button behavior via automated tests and browser inspection.

- [x] T008 Update Test 16 in `tests/french-lab.test.js`:
  - Test `Ctrl+Space` triggers Écouter (`togglePlayPause()`).
  - Test `Ctrl+R` triggers Replay (`playCurrentSentence()`).
  - Test regular `Space` does NOT toggle Play/Pause.
- [x] T009 Run automated test suite (`node tests/french-lab.test.js`) and confirm all 19 tests pass (100% green).
- [x] T010 Verify live browser behavior: type space in textarea, press `Ctrl+Space` to play/pause, press `Ctrl+R` to replay, and verify button layout.

---

## Task Dependencies & Flow

```
[Phase 1: Keybindings (T001-T003)] ──> [Phase 2: Button Swap (T004-T006)]
                                                │
                                                ▼
                                      [Phase 3: CSS Styling (T007)]
                                                │
                                                ▼
                                      [Phase 4: Automated Tests & Verification (T008-T010)]
```
