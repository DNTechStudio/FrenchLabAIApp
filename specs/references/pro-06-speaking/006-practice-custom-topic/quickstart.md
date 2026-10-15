# Quickstart & Verification Guide: User-Defined Practice Topics

**Feature**: `006-practice-custom-topic`  

---

## 1. Local Development

Ensure the dev server is active:
```bash
node dev-server.js
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 2. Interactive Verification Flow

### Step 1: Switch to Practice Mode
- On the top header, switch to **Mode Entraînement** (Practice Mode).
- In the hero header on the right, locate the buttons:
  - `🎲 Changer de sujet`
  - `✏️ Sujet personnalisé`

### Step 2: Open and Test Inline Expandable Form
- Click `✏️ Sujet personnalisé`.
- Verify the form expands smoothly without resetting any text in the recording console.
- Click `✕ Annuler` and verify it collapses.
- Click `✏️ Sujet personnalisé` again to reopen.

### Step 3: Fill in Custom Practice Subject
- Enter:
  - **Titre**: "L'impact des podcasts sur l'apprentissage des langues"
  - **Thématique**: Select chip "Éducation"
  - **Description**: "Pensez-vous que l'écoute quotidienne de podcasts permet d'acquérir une prononciation plus naturelle ?"
  - **Amorce suggérée**: "Selon mon expérience avec les podcasts en français, ..."
- Click `🚀 Appliquer ce sujet`.

### Step 4: Verify Topic Card & AI Speech Elevation
- Verify the active topic card updates immediately with:
  - `🎨 Personnalisé` badge
  - Title: "« L'impact des podcasts sur l'apprentissage des langues »"
  - Suggested starter sentence.
- Type or speak a short speech in the recording console.
- Click `✨ Améliorer avec l'IA (Improve with AI)`.
- Verify the dual-level elevation cards render successfully.
- Refresh the browser page and verify the custom practice topic persists.

---

## 3. Automated Test Execution

Run the test suite:
```bash
node --test tests/unit/CustomPracticeStorage.test.js tests/unit/CustomPracticeTopicForm.test.js tests/integration/*.test.js
```
