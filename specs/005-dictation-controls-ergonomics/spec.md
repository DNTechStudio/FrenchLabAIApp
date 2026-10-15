# Feature Specification: Dictation Controls Ergonomics & Keybinding Optimization

**Feature Branch**: `005-dictation-controls-ergonomics`  
**Created**: 2026-10-03  
**Status**: Specified & Ready for Review  

---

## 1. Overview & Problem Statement

In **Mode Dictée** (Dictation Lab), typing fluency and audio playback ergonomics are critical for students practicing French transcription.

### Problems Identified:
1. **Spacebar Conflict in Textarea**:
   - Currently, pressing `Space` is bound to `Toggle Play/Pause/Resume` globally.
   - Consequently, when typing French inside the transcription textarea, users were forced to press `Shift+Space` just to type an ordinary whitespace between words.
   - This breaks standard typing muscle memory, causing unexpected audio pausing while transcribing text.
2. **Replay Shortcut Ergonomics**:
   - Currently, `Ctrl+Space` is assigned to `Réécouter` (Replay current sentence).
   - `Ctrl+R` is a more natural, standard keybinding for **R**éécouter / **R**eplay.
   - Note: Because `Ctrl+R` is the browser's default shortcut for page refresh, `e.preventDefault()` must be strictly applied when Mode Dictée is active to prevent accidental page reloads.
3. **Control Deck Button Arrangement**:
   - Currently:
     - Row 1: `[◀ Précédent]` `[► Écouter/Pause]` `[🔁 Réécouter]`
     - Row 2: `[Suivant ▶]`
   - This layout separates `Précédent` and `Suivant` into two different rows, which is counter-intuitive for linear step navigation.
   - Placing `Précédent`, `Écouter/Pause`, and `Suivant` together in Row 1 forms a cohesive, standard 3-button playback & navigation deck (`Prev` - `Play` - `Next`), while `Réécouter` centered in Row 2 serves as an auxiliary replay utility.

---

## 2. User Scenarios & Acceptance Criteria

### Scenario 1: Natural Spacebar in Textarea
- **Given**: The student is focused inside `#dictation-textarea` (or `#sample-window-textarea`).
- **When**: The student presses `Space`.
- **Then**: A normal space character (`" "`) is inserted into the text at the cursor position without triggering audio Play/Pause/Resume.
- **And**: The UI hint `💡 Shift+Space = espace` is removed from the diacritics bar, as it is obsolete.

### Scenario 2: `Ctrl+Space` Controls Écouter (Play / Pause / Resume)
- **Given**: Mode Dictée is active (whether focused inside the textarea or outside).
- **When**: The student presses `Ctrl+Space` (or `Cmd+Space` on macOS).
- **Then**: It toggles audio playback (Play / Pause / Resume) without moving focus or typing whitespace.
- **And**: Standard `Space` key alone is reserved purely for typing whitespace and never toggles playback.

### Scenario 3: `Ctrl+R` Replays Current Sentence
- **Given**: Mode Dictée is active.
- **When**: The student presses `Ctrl+R` (or `Cmd+R` on macOS).
- **Then**:
  - The browser page **does NOT** refresh (`preventDefault` applied).
  - The current sentence audio is replayed immediately from the beginning via `playCurrentSentence()`.
  - The shortcut badge on the `Réécouter` button displays `Ctrl+R`.

### Scenario 4: Swapped Positions of `Réécouter` and `Suivant`
- **Given**: The user views the Mode Dictée deck card.
- **Then**:
  - **Row 1 (`.deck-controls-row-1`)** contains 3 buttons in order:
    1. `[◀ Précédent]` with badge `<kbd>Ctrl+←</kbd>`
    2. `[► Écouter / ⏸ Pause / ► Reprendre]` with badge `<kbd>Ctrl+Space</kbd>`
    3. `[Suivant ▶]` with badge `<kbd>Ctrl+→</kbd>`
  - **Row 2 (`.deck-controls-row-2`)** contains 1 centered button:
    1. `[🔁 Réécouter]` with badge `<kbd>Ctrl+R</kbd>`
  - Visual symmetry and responsive spacing remain visually polished across desktop and tablet screen sizes.

---

## 3. Detailed Component Changes

### 3.1 UI Controller (`src/ui/DictationView.js`)
1. **HTML Template (`render()`)**:
   - Move `#btn-next-sentence` into `.deck-controls-row-1`.
   - Move `#btn-replay-sentence` into `.deck-controls-row-2`.
   - Update shortcut badge on `#btn-replay-sentence` to `<kbd class="shortcut-badge">Ctrl+R</kbd>`.
   - Update shortcut badge on `#btn-next-sentence` to `<kbd class="shortcut-badge">Ctrl+→</kbd>`.
   - Remove `${diacriticsHtml}` suffix `💡 Shift+Space = espace`.
   - Update textarea placeholders to explain shortcuts clearly:
     - `(Space: Écouter/Pause khi ngoài ô nhập • Ctrl+R: Réécouter • Ctrl+← / Ctrl+→: Điều hướng)`
2. **Keyboard Event Handling (`handleKeyDown`)**:
   - Check if event target is an input or textarea (`e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT'`).
   - If target is a textarea and key is `Space` without Ctrl/Alt/Meta: **allow default browser behavior** (do not preventDefault, do not toggle audio).
   - If `(e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R' || e.code === 'KeyR')`:
     - `e.preventDefault()`; `e.stopPropagation()`;
     - Call `this.playCurrentSentence()`.
   - Remove special `Shift+Space` interceptor from `dictation-textarea` keydown.

### 3.2 Stylesheet (`src/styles/dictation.css`)
- Update `.deck-controls-row-1` and `.deck-controls-row-2` to support the swapped layout:
  - Row 1: 3 flex items with consistent button sizing.
  - Row 2: centered replay button styling (accented with subtle indigo border or icon glow).

### 3.3 Automated Test Suite (`tests/french-lab.test.js`)
- Update Test 16 to assert:
  - `Ctrl+R` triggers Replay.
  - `Space` inside textarea inserts normal whitespace.
  - `Space` outside textarea toggles Play/Pause.
