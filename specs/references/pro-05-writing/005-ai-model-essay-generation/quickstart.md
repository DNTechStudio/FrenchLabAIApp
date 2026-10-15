# Quickstart Guide: 005 — AI Model Essay Generation on Empty Input

**Feature**: `005-ai-model-essay-generation`  
**Date**: 2026-09-25  

---

## 1. Quick Verification Steps

### Step 1: Open Application
Open the application in Google Chrome via either:
* **Web Server URL**: `http://localhost:8080/standalone.html`
* **Direct File**: `standalone.html`

### Step 2: Test Empty Input Click
1. Ensure the essay textarea is completely empty (`0/250 mots`).
2. Observe the button **« ✨ Améliorer avec l'IA »** at the bottom right of the editor pane:
   - **Expected**: The button is **enabled** (vibrant purple/gradient, not disabled or grayed out).
3. Click **« ✨ Améliorer avec l'IA »**:
   - **Expected**: The loading indicator appears with the text *"Génération de la version B2..."*.
   - Within <100ms (in Mock mode), the comparison window displays a complete, high-scoring B2 model essay answering the active exam topic (e.g. *Maintien du télétravail*).
   - The view mode automatically defaults to **« 👁 Version améliorée B2 »** (Clean Text view) with exact word count (e.g., ~260 words).

### Step 3: Test Multi-Level Comparison on Empty Input
1. In the CEFR selector, select both **B1** and **C1**.
2. Leave the editor empty.
3. Click **« ✨ Améliorer avec l'IA »**:
   - **Expected**: Two windows open side-by-side:
     - Window 1 (**B1 — Intermédiaire**): An exemplary B1 response (~170 words, accessible connectors like *d'abord, ensuite, à mon avis*).
     - Window 2 (**C1 — Autonome**): An exemplary C1 response (~280 words, formal rhetoric like *il convient de souligner, nonobstant, il est impératif que*).

### Step 4: Run Automated Tests
Execute the automated test suite in the terminal:
```bash
node tests/run-all-tests.mjs
```
All tests for empty input handling, prompt generation, and model retrieval must pass.
