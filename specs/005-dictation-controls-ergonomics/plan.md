# Implementation Plan: Dictation Controls Ergonomics & Keybinding Optimization (005-dictation-controls-ergonomics)

**Feature**: `005-dictation-controls-ergonomics`  
**Prerequisites**: `specs/005-dictation-controls-ergonomics/spec.md`  
**Architecture Style**: Pure Vanilla JS ESM + Vanilla CSS (Zero runtime npm dependencies)  

---

## Proposed Changes

### 1. UI Controller: Keybinding Refactoring (`src/ui/DictationView.js`)
- In `handleKeyDown(e)`:
  - If `(e.ctrlKey || e.metaKey) && isSpace`:
    - Apply `e.preventDefault()` and `e.stopPropagation()`.
    - Call `this.togglePlayPause()`.
  - If `(e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R' || e.code === 'KeyR')`:
    - Apply `e.preventDefault()` and `e.stopPropagation()` to prevent browser reload.
    - Call `this.playCurrentSentence()`.
  - Regular `Space` (without ctrl/meta) inside textarea/input: return without preventing default, allowing standard whitespace typing.
  - Regular `Space` outside textarea: does not toggle audio.
- In `bindEvents()`:
  - Remove the legacy `textarea.addEventListener('keydown')` block that intercepted `Shift+Space`.

### 2. UI Template: Button Swap & Label Cleanups (`src/ui/DictationView.js`)
- In `render()`:
  - Swap buttons between `.deck-controls-row-1` and `.deck-controls-row-2`:
    - Row 1: `#btn-prev-sentence` (Précédent), `#btn-play-sentence` (Écouter / Play / Pause), `#btn-next-sentence` (Suivant).
    - Row 2: `#btn-replay-sentence` (Réécouter), centered.
  - Update shortcut badge on `#btn-play-sentence` to `Ctrl+Space`.
  - Update shortcut badge on `#btn-replay-sentence` to `Ctrl+R`.
  - Update shortcut badge on `#btn-next-sentence` to `Ctrl+→`.
  - Remove obsolete `💡 Shift+Space = espace` hint badge from `.deck-accent-row`.
  - Update textarea placeholder text to reflect `Ctrl+Space` for Écouter/Pause and `Ctrl+R` for replay.

### 3. Styling & Responsive Layout (`src/styles/dictation.css`)
- Review and refine `.deck-controls-row-1` and `.deck-controls-row-2`:
  - Ensure Row 1 displays 3 symmetrically balanced navigation & playback buttons:
    - `btn-prev-sentence` (flex 1)
    - `btn-deck-play` (prominent center button, flex 1.4)
    - `btn-next-sentence` (flex 1)
  - Ensure Row 2 displays `#btn-replay-sentence` centered with consistent width and styling.

### 4. Automated Tests (`tests/french-lab.test.js`)
- Update Test 16:
  - Assert that `Ctrl+Space` triggers Écouter (`togglePlayPause()`).
  - Assert that regular `Space` inside or outside textarea does NOT trigger Play/Pause.
  - Assert that `Ctrl+R` triggers Replay (`playCurrentSentence()`).
- Run test runner and verify 19/19 tests pass (100% green).

---

## Verification Plan

### Automated Tests
- Command: `node tests/french-lab.test.js`
- Expected: All 19 tests pass.

### Manual / Browser Verification
- Load `http://localhost:3000/#dictation`.
- Focus inside the transcription textarea, type words and press `Space` ➔ normal spaces are inserted seamlessly without stopping or pausing audio.
- Press `Ctrl+R` ➔ current sentence re-reads immediately from the start without reloading the webpage.
- Check Row 1 ➔ `Précédent`, `Play`, `Suivant` are aligned horizontally.
- Check Row 2 ➔ `Réécouter` is centered neatly below.
