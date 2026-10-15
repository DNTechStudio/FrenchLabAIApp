# Quickstart Validation Guide: DELF B2 Speaking Simulator

**Feature**: `001-delf-b2-speaking-simulator` | **Date**: 2026-09-27

This guide specifies runnable validation scenarios to verify that the French DELF B2 Oral Exam Simulator behaves in strict conformance with the specifications and Constitution.

---

## Prerequisites & Setup

1. **Environment**: Node.js 18+ installed.
2. **Dev Server Execution**:
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` (or configured dev port) in a modern web browser (Google Chrome, Edge, or Safari recommended for native Web Speech API).
3. **Automated Testing Suite (Constitution Principle III)**:
   ```bash
   npm test
   ```
   Runs Vitest headless unit and integration test suites using mock audio buffers and canned transcripts.

---

## Scenario 1: Topic Selection & 10-Minute Preparation Window

### Objective
Verify that the candidate can draw or choose an authentic trigger document and take structured notes with a synchronized countdown.

### Steps
1. Navigate to the Home / Topic Selection view.
2. Click **"Tirage au sort (Random Draw)"**.
   - *Expected*: A curated DELF B2 trigger document (e.g. "Le télétravail : révolution ou isolement ?") is selected with headline, source attribution, and word count.
3. Click **"Démarrer la préparation (10 min)"**.
   - *Expected*: The countdown timer initializes at `10:00` and decrements each second.
4. Type structured outline notes into the Preparation Scratchpad:
   - Introduction & Problématique
   - Plan (Partie 1 / Partie 2)
   - Arguments & Exemples
   - Conclusion
5. Reload the browser page (`F5`).
   - *Expected (State Resilience)*: The session restores seamlessly; the document remains selected and all typed scratchpad notes are intact.

---

## Scenario 2: Monologue Recording with Live Waveform & Timer

### Objective
Verify that audio capture activates, displays a real-time responsive waveform, and accurately records the candidate's monologue.

### Steps
1. In the Preparation view, click **"Passer à l'oral (Monologue)"** (or let timer reach 0:00).
2. Allow browser microphone access when prompted.
3. Click **"Commencer l'enregistrement"**.
   - *Expected*: The microphone indicator turns active (pulsing green indicator).
   - *Expected*: The canvas soundwave visualizer renders real-time audio amplitude changes (> 30 fps) when speaking.
   - *Expected*: The elapsed timer counts up from `00:00`, displaying visual color cues (amber for < 3 min, emerald green for 5–7 min, red for > 8 min).
4. Speak for at least 15 seconds (or use Mock Audio input during automated tests) and click **"Terminer le monologue"**.
   - *Expected*: Recording stops, audio blob is saved into IndexedDB, and the review card displays an audio player for candidate self-review.

---

## Scenario 3: Spoken Debate Phase with Native French AI Examiner

### Objective
Verify that the AI Examiner initiates spoken dialogue in French challenging candidate assertions and supports turn-taking.

### Steps
1. Confirm the monologue and click **"Lancer le Débat"**.
   - *Expected*: AI Examiner status displays "L'examinateur réfléchit...", analyzes the candidate's points, then vocalizes question 1 using native French neural TTS (`fr-FR`).
   - *Expected*: The examiner's speech bubble shows audio playing animation with closed caption toggles.
2. Click **"Répondre à l'examinateur"** and record a counter-argument.
3. Submit the turn response.
   - *Expected*: The debate turns counter increments (e.g., Turn 1/3 → Turn 2/3), followed by examiner question 2 directly referencing the counter-argument.
4. Complete all turns (3 to 5 exchanges).

---

## Scenario 4: Official 25-Point CEFR Diagnostic Evaluation

### Objective
Verify that the Evaluation Engine outputs a complete, mathematically consistent 25-point report.

### Steps
1. Conclude the final debate turn.
   - *Expected*: Evaluation spinner loads with diagnostic analysis in progress (< 15 seconds).
2. Inspect the resulting Evaluation Report:
   - *Expected*: All 5 official subscores are displayed:
     - Monologue suivi: /9 (Problématique /3, Arguments /3, Structure /3)
     - Débat en interaction: /6 (Défense /3, Réactivité /3)
     - Lexique: /4
     - Morphosyntaxe: /5
     - Phonologie & Prosodie: /1
   - *Expected*: Subscores sum exactly to `totalScore` out of 25.0.
   - *Expected*: Pass/Fail status is clearly indicated ($\ge 12.5$ pass, $< 5.0$ eliminatory warning).
3. Review the linguistic breakdown:
   - Highlighted verbatim quotes with grammar corrections and explanations.
   - Suggested B2/C1 logical connectors.
4. Click **"Imprimer / Exporter le bilan"**.
   - *Expected*: Clean, print-styled view is triggered without UI chrome or buttons.
