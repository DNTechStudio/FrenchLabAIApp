# Quickstart Guide: Natural AI Voice & Speed Control

**Feature**: `004-natural-voice-speed-control` | **Date**: 2026-09-28

---

## 1. Quick Verification Flow

1. **Launch Local Server**:
   ```bash
   node dev-server.js
   ```
   Open `http://localhost:5173/` in **Google Chrome** or **Microsoft Edge**.

2. **Navigate to Practice Mode**:
   - In the header, toggle **🎙️ Mode Entraînement**.
   - Speak or enter a sample sentence:
     > *"Je pense que le télétravail est très avantageux pour les salariés."*
   - Pick 1 or 2 CEFR levels (e.g. `B2`).
   - Click **✨ Améliorer avec l'IA**.

3. **Verify Natural Voice & Speed Control**:
   - On the elevated result card, locate the **Vitesse de lecture (Speed)** control: `[0.75x] [0.9x] [1.0x] [1.2x]`.
   - Select `0.75x` and click **🔊 Écouter**:
     - Listen to the French speech synthesized at a calm, articulation-friendly speed.
     - Note the natural phrasing and accurate French prosody.
   - Switch to `1.2x` and click **🔊 Écouter**:
     - Verify audio accelerates smoothly without clipping.
   - Click **⏹️ Arrêter** mid-sentence:
     - Verify audio cancels immediately and button resets to **🔊 Écouter**.
   - Reload the page:
     - Verify the selected speed rate persists from `localStorage`.

4. **Run Automated Test Suites**:
   ```bash
   node --test tests/unit/*.test.js tests/integration/*.test.js
   ```
