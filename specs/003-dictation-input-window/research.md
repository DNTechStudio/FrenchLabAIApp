# Research & Architectural Decisions: Dictation Sample Text Window & AI Generator (003-dictation-input-window)

## 1. Architectural Strategy: In-Page Embedded Text Window vs. Modal Dialog

### Decision
Embed the **Sample Text Window** directly into the Mode Dictée view layout:
- Positioned immediately between `.dictation-top-bar` and `.dictation-deck-card`.
- Always open and visible as part of the primary dictation layout.
- Provides immediate read access to the sample text (đoạn văn mẫu) currently being read for dictation.

### Rationale
- **Direct Visual Alignment**: As shown in the user's diagram, placing the Text Window right above the audio controls provides intuitive reference. Learners can read the passage, verify their hearing, and see the full context without popups.
- **Immediate Feedback Loop**: Pasting new text or generating an AI topic updates the text window and instantly updates the sentence count, audio player, and transcription deck in real-time.

---

## 2. AI Random Topic & Passage Generation Engine

### Decision
Use the sovereign generator service: `src/core/dictation/aiTextGenerator.js`.
1. **Sovereign Client-Side Generative Matrix (Default & 100% Offline)**:
   - Contains authentic French syntactic templates, vocabulary pools, and topic seeds across 6 thematic categories:
     - *Vie Quotidienne & Loisirs*
     - *Voyage & Découverte*
     - *Société & Actualité*
     - *Écologie & Climat*
     - *Monde du Travail & Études*
     - *Culture & Gastronomie*
   - Strictly calibrated across CEFR levels:
     - **A1**: 20–40 words, present tense, simple coordination (*et*, *mais*), familiar everyday topics.
     - **A2**: 45–75 words, passé composé with *avoir*/*être*, imparfait, directional phrases, simple plural agreements.
     - **B1**: 70–110 words, opinion verbs (*je pense que*, *il me semble*), subjonctif basics, temporal connectors (*tandis que*, *lorsque*).
     - **B2**: 90–150 words, formal debate discourse, logical connectors (*certes*, *néanmoins*, *par conséquent*), complex homophones (*c'est/s'est*, *leur/leurs*), passive voice.
2. **Deterministic Random Seed Generator**:
   - Clicking **« 🎲 Sujet Aléatoire »** produces diverse, unmemorized authentic passages in < 50ms without network latency or external API failure risk.

---

## 3. In-Place Editing & Paste Flow

### Decision
Provide two visual modes within the Text Window:
1. **Display Mode (Default)**: Renders the French text with elegant typography, quotes, word count, sentence count, theme, and grammar tags.
2. **Edit/Paste Mode**: Triggered by **« 📋 Coller / Modifier »**, smoothly transforms the text view into a clean textarea with real-time `countFrenchWords()` and `splitFrenchSentences()` counter, plus a **« ✔ Valider »** and **« Annuler »** button.
