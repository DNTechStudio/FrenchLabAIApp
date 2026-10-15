# Quickstart & Verification Guide: AI-Assisted Custom Topic Generator

**Feature**: `007-ai-practice-topic-generator`  

---

## 1. Local Development Server

Ensure your dev server is active:
```powershell
npm run dev
# or: node dev-server.js
```
Open [http://localhost:5173/](http://localhost:5173/) in Google Chrome or Microsoft Edge.

---

## 2. Interactive Verification Flow

### Step 1: Open Custom Topic Window
1. Switch to **Mode Entraînement** (Practice Mode).
2. Click **`✏️ Sujet personnalisé`**.
3. Notice that:
   - The custom topic window opens smoothly.
   - The active topic card below is hidden automatically (mutually exclusive display).

### Step 2: Test Multilingual Idea Draft Auto-Fill
1. Locate the AI Draft banner at the top of the form:
   - Label: `💡 Votre idée brute (en français, tiếng Việt, English...)`
2. Test **Vietnamese draft**:
   - Type: `trí tuệ nhân tạo trong trường học`
   - Click **`✨ Améliorer avec l’IA`** (or press Enter).
   - Verify that:
     - **Titre du sujet** auto-fills with an authentic French DELF B2 debate title.
     - **Thématique** chip automatically selects `Éducation & Formation`.
     - **Contexte et questions de réflexion** auto-fills with context and 2 opposing debate questions.
     - **Amorce suggérée** auto-fills with a formal French oral starter sentence.
     - Inputs play a gentle highlight pulse animation (`field-highlight-glow`).

3. Test **English or French keywords**:
   - Type: `electric cars green transition` or `semaine de 4 jours travail`
   - Click **`✨ Améliorer avec l’IA`**.
   - Verify proper category detection (`Environnement & Écologie` or `Travail & Nouveaux Modes de Vie`).

4. Test **Empty draft click**:
   - Clear the draft box completely.
   - Click **`✨ Améliorer avec l’IA`**.
   - Verify a trending DELF B2 debate topic is generated spontaneously.

### Step 3: Apply Topic & Elevate Spoken French
1. Click **`🚀 Appliquer ce sujet`**.
2. The active topic card displays your AI-generated custom topic with the `🎨 Personnalisé` badge.
3. Click **`✨ Améliorer avec l’IA →`**:
   - If you have spoken or typed text, your text is elevated across your chosen CEFR tiers (e.g. B1 vs B2).
   - If you have not typed anything, the AI suggests the model response itself and displays the comparative analysis!

---

## 3. Automated Test Execution

Run the complete test suite:
```powershell
npm test
```
All 94 tests must pass with 0 failures.
