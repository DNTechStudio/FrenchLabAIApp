# Quickstart & Verification Guide: 006 — Interactive French Dictation Mode

**Feature**: `006-french-dictation-mode`  
**Date**: 2026-09-25  

---

## 1. Local Testing in Web Browser

1. **Open the Application**:
   Navigate to the live application in Google Chrome, Microsoft Edge, or Safari:
   ```
   http://localhost:8080/standalone.html
   ```

2. **Launch Dictation Mode**:
   - In the workspace header or editor toolbar, click the **« 🎧 Mode Dictée »** button.
   - The editor adapts to present audio playback controls and the sentence progress bar (`Phrase 1 / 8`).

3. **Listen & Transcribe**:
   - Click **« ▶ Écouter »** or press **`Ctrl + Space`** on your keyboard.
   - The browser dictates the first sentence in clear French (`fr-FR`).
   - Type what you hear in the dictation text box.
   - Click **« ⏭ Phrase suivante »** to move to sentence 2.

4. **Evaluate Your Dictation**:
   - When finished, click **« 🎯 Corriger ma dictée »**.
   - Review your **Accuracy Score (%)** and inspect the categorized mistake breakdown:
     - 🔴 Accords & Terminaisons verbales
     - 🟡 Accents & Cédilles
     - 🔵 Homophones grammaticaux
     - 🟢 Lexique & Ponctuation

---

## 2. Automated Test Suite Execution

Run the Node.js test runner:
```bash
node tests/run-all-tests.mjs
```

### Verified Test Cases:
1. `splitFrenchSentences`: Correctly splits French paragraphs while shielding abbreviations like `M. le Maire` and `etc.`.
2. `classifyDictationMistake`: Accurately categorizes errors into `accents`, `accords`, `homophones`, and `lexique`.
3. `calculateDictationAccuracy`: Returns a correct 0–100% score based on reference word count vs. detected mistakes.
