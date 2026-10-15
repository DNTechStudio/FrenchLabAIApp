# Quickstart & Verification Guide: User-Defined Custom Topics

**Feature**: `005-custom-topic-input`  

---

## 1. Local Development

Ensure the dev server is active:
```bash
node dev-server.js
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 2. Interactive Testing & Verification Flow

### Step 1: Open Test Simulation Mode
- On the home view, ensure you are in **Mode Simulation d'Épreuve** (Test Mode).
- In the Hero section, locate the new button: `✏️ Sujet personnalisé` next to `🎲 Tirage au sort`.

### Step 2: Test Inline Expandable Form
- Click `✏️ Sujet personnalisé`.
- Verify the form smoothly expands below the hero banner.
- Click `✕ Annuler` and verify the form smoothly collapses.
- Click `✏️ Sujet personnalisé` again to reopen.

### Step 3: Test Real-time Validation & Word Counter
- Type less than 30 words in "Texte déclencheur". Observe the live word counter badge turn red (`⚠️ Trop court (min. 30 mots)`). Verify the submit button remains disabled or warns the user.
- Paste an authentic excerpt of 150–200 words. Observe the live word counter badge turn green (`✅ Format DELF B2 idéal`).
- Fill in:
  - **Titre**: "La semaine de 4 jours : utopie ou nécessité ?"
  - **Thématique**: "Travail & Nouveaux Modes de Vie"
  - **Source**: "Le Monde, 2026"
  - **Problématique**: "Faut-il généraliser la semaine de 4 jours sans perte de salaire ?"

### Step 4: Launch Exam with Custom Topic
- Click `🚀 Démarrer l'épreuve avec ce sujet`.
- Verify that the app transitions smoothly to **Phase 1: Préparation (30:00)**.
- Verify that the trigger document displayed on the left is your custom document with the `🎨 Personnalisé` badge.
- Test through to Monologue and Debate phases to confirm the examiner incorporates your custom topic context.

### Step 5: Verify Saved Topics Library
- Return to the document selection view.
- Verify the custom document is saved under `delf_speaking_custom_topics` in `localStorage` and appears under the `✏️ Mes Sujets` filter tab.

---

## 3. Running Automated Tests

Run the test suite:
```bash
node --test tests/unit/CustomTopicsStorage.test.js tests/unit/CustomTopicForm.test.js tests/integration/*.test.js
```
All tests must pass cleanly with 0 errors.
