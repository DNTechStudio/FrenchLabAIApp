# Quickstart & Verification Guide: Standalone French Dictation Lab Module (002-dictation-module)

## 1. Prerequisites & Setup

Ensure the French Lab AI dev server is running:

```powershell
node dev-server.js
```

Access the application in your browser:
[http://localhost:3000](http://localhost:3000)

---

## 2. End-to-End Validation Scenarios (100% Fidelity UI)

### Scenario 1: Sidebar Navigation & Exact Mode Dictée Header
1. Look at the left sidebar (`#app-sidebar`).
2. Click **« Dictation »** (directly below DELF-DALF Writing).
3. **Expected**:
   - The workspace smoothly switches to `#view-dictation`.
   - The top header matches the screenshot:
     - `← Rédaction` button on the left.
     - `🎧 Mode Dictée` title.
     - `B1` pill badge.
     - `🎙️ Web Speech` badge.
     - `Vitesse :` `0.75x` and `1.0x` toggle pills.

### Scenario 2: Audio Control Deck & Stepper
1. Observe the audio control deck card:
   - Header shows `Phrase 1 sur 4` with linear progress fill bar.
   - Row 1 shows `◀ Précédent [Ctrl+←]`, glowing purple `► Écouter`, and `🔁 Réécouter [Ctrl+Space]`.
   - Row 2 shows centered `Suivant ▶ [Ctrl+→]`.
2. Click `► Écouter` (or press `Ctrl+Space`):
   - Sentence 1 is spoken aloud in French.
   - The button switches to `⏸ Pause` while audio plays.
3. Click `0.75x` speed pill:
   - It highlights in solid indigo; subsequent playback plays at slow speed.

### Scenario 3: Transcription Tabs, Textarea & French Diacritics
1. Verify the tabs: `Phrase 1` (active) and `Texte intégral (4 phrases)`.
2. Click into the textarea; observe the exact placeholder:
   `Écoutez la phrase 1 et tapez ce que vous entendez en français... (Ctrl+Espace pour réécouter)`
3. Type French words and use the accent helper bar or keyboard diacritics.
4. Observe the live counter updating: `Mots transcrits : X (Attendu : ~Y mots)`.

### Scenario 4: Keyboard Shortcuts & Sentence Navigation
1. Press `Ctrl+Right` inside the textarea:
   - Advances to Phrase 2.
   - The stepper header updates to `Phrase 2 sur 4` and the progress bar animates to 50%.
2. Press `Ctrl+Left`:
   - Returns to Phrase 1 with previous text preserved.

### Scenario 5: Evaluation & Linguistic Diagnostics
1. Click `🎯 Corriger ma dictée`:
   - Diagnostic Report card loads.
   - Overall accuracy score %, words correct count, and mistake categories (Homophones, Accords, Accents) are shown.
   - Sentence-by-sentence visual diff shows red strikethrough for mistakes and green text for correct spelling.
2. Click `← Rédaction` or `🔄 Recommencer` to return to the dictation editor.

---

## 3. Automated Test Suite Execution

Run the deterministic test suite:

```powershell
node --test tests/french-lab.test.js
```

Verify that all test cases pass with 0 errors.
