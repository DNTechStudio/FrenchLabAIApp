# Quickstart & Verification Guide: Practice Mode & AI Speech Elevation

**Feature**: `003-practice-mode-ai-improvement`  
**Date**: 2026-09-28  

---

## 1. Quick Verification Steps (Manual Walkthrough)

1. **Start the local dev server**:
   ```bash
   node dev-server.js
   ```
2. Open `http://localhost:5173/` in your browser.
3. **Switch to Practice Mode**:
   - In the header navigation bar, locate the mode segmented control.
   - Click **🎙️ Mode Entraînement** (Practice Mode).
   - Observe that the exam stepper changes to the 3-step Practice stepper:
     `1. Sujet & Enregistrement -> 2. Transcription & Niveaux -> 3. Amélioration IA`.
4. **Record or Input Speech**:
   - Select a suggested topic (e.g., *« Le télétravail et l'équilibre de vie »*) or enter a custom prompt.
   - Click **🎙️ Commencer l'enregistrement** and speak into your microphone in French (e.g., *"Je pense que le travail à distance est très bon parce qu'on gagne du temps."*).
   - Click **⏹️ Terminer l'enregistrement**.
   - Check the transcript editor; optionally edit text manually.
5. **Select 2 CEFR Levels**:
   - Review the 6 level pills: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
   - Select **B1** and **B2** (or any 2 levels). Verify that exactly 2 levels are highlighted and active.
6. **Trigger AI Elevation**:
   - Click **✨ Améliorer avec l'IA (Improve with AI)**.
   - Verify the 3 comparative views:
     - **Original**: Your verbatim speech.
     - **Level 1 (B1)**: Corrected syntax and basic discourse markers.
     - **Level 2 (B2)**: Subjunctive, elevated academic vocabulary, and logical connectors.
7. **Test Auditory Shadowing (TTS)**:
   - Click **🔊 Écouter (Shadowing)** on the B2 card.
   - Verify that natural French voice synthesis plays the upgraded speech aloud.

---

## 2. Automated Test Execution

Run the complete test suite including new Practice Mode unit and integration tests:

```bash
node --test tests/unit/*.test.js tests/integration/*.test.js
```
