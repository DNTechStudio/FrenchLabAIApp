# Developer Quickstart: French Lab AI Super-App

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Associated Specification**: [spec.md](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit AI/%2801%29%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/spec.md)

---

## 1. Prerequisites

- **Node.js**: Version 18.0.0 or later (used for local static server and built-in Node test runner `node --test`).
- **Web Browser**: Any modern Chromium or WebKit browser with Web Speech API support (Google Chrome, Microsoft Edge, Brave, Safari).

---

## 2. Launching Locally

From the root project directory:

```bash
# 1. Navigate to the application root
cd FrenchLabAIApp

# 2. Start the zero-dependency local static server
node dev-server.js
```

The application server will bind to:
`http://localhost:3000` (or `http://localhost:8080`)

Open your browser and navigate to the local URL.

---

## 3. Running Automated Tests

Run the built-in Node.js test suite to verify all core engines (word counter, connector analyzer, rubrics, state transitions):

```bash
node --test tests/french-lab.test.js
```

Expected output:
```
✔ Word Counter adheres to French tokenization (apostrophes and contractions)
✔ Connecteurs Logiques detection and classification
✔ 25-Point Production Écrite Rubric calculation
✔ 25-Point Production Orale Rubric calculation
✔ 3-Party Conversation state machine turn-taking logic
✔ Débat Arena Pour/Contre state transitions and scoring
ℹ tests 6
ℹ pass 6
ℹ fail 0
```

---

## 4. Key Navigation Flows to Test in the Browser

1. **Cockpit**: Inspect the 4-pillar cards; toggle CEFR level between B2 and C1; toggle language between FR, VI, EN, ZH.
2. **Writing Lab**: Choose a prompt, type $\ge 250$ words, click "AI Améliorer", review side-by-side diff.
3. **Speaking Lab**: Launch exam, test 10-minute timer, record monologue, engage with AI examiner.
4. **Daily Conversation**: Select 3-party roleplay (e.g. *Chez le médecin*), send user utterance, verify alternating character turns.
5. **Débat Arena**: Select topic, pick stance *Pour*, complete 3 rounds with logical connector highlights, inspect 25-pt scorecard.
6. **Data Sovereignty**: Click "Exporter Sauvegarde" in header, inspect exported JSON file.
