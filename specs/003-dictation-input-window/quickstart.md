# Quickstart & Verification Guide: Dictation Sample Text Window & AI Generator (003-dictation-input-window)

## 1. Prerequisites & Setup

Ensure the French Lab AI dev server is active:

```powershell
node dev-server.js
```

Open [http://localhost:3000/#dictation](http://localhost:3000/#dictation) and navigate to the Dictation view.

---

## 2. Validation Scenarios

### Scenario 1: Always-Visible Sample Text Window
1. Navigate to the Dictation workspace.
2. Directly below the top bar (`[← Rédaction] 🎧 Mode Dictée [B1]...`) and above the audio player deck, observe the **Sample Text Window (`📝 Texte Modèle / Đoạn văn mẫu`)**.
3. **Expected**:
   - The Text Window is open and visible by default.
   - Shows the active reference passage formatted cleanly.
   - Shows level chips (`A1`, `A2`, `B1`, `B2`).
   - Shows action buttons: `[📋 Coller un texte]`, `[🎲 Aléatoire]`, `[✨ Générer IA]`.
   - Shows word count, sentence count, category, and grammar focus badges in the footer.

### Scenario 2: Switching Levels (A1 - B2)
1. In the Text Window header, click the **`A2`** level chip.
2. **Expected**:
   - The Text Window updates with an authentic A2 French passage.
   - The Audio Deck below instantly updates to `Phrase 1 sur N` for this A2 text.
   - Clicking `► Écouter` speaks Phrase 1 of the new A2 passage.

### Scenario 3: AI Random Topic & Passage Generation
1. In the Text Window, click **`✨ Générer IA`** (or **`🎲 Aléatoire`**).
2. **Expected**:
   - A fresh, authentic passage matching the active level appears instantly in the Text Window.
   - Metadata badges (word count, sentence count, grammar points) update immediately.
   - Audio Deck synchronizes to Phrase 1 of the newly generated passage.

### Scenario 4: Copy & Paste / Custom Text Editing
1. Click **`📋 Coller un texte`** in the Text Window toolbar.
2. An editable textarea appears with a live word/sentence counter.
3. Paste a custom French text (e.g. *"Bonjour à tous ! C'est une magnifique journée pour pratiquer le français."*).
4. Click **`✔ Valider`**.
5. **Expected**:
   - The custom text is displayed in the Text Window.
   - Audio Deck segments into 2 phrases and speaks the custom text accurately.
   - Transcription area evaluates against the custom text.

---

## 3. Automated Tests

Run the test suite:

```powershell
node --test tests/french-lab.test.js
```
