# Implementation Plan: Dictation Sample Text Window & AI Generator (003-dictation-input-window)

**Branch**: `003-dictation-input-window` | **Date**: 2026-10-02 | **Spec**: [specs/003-dictation-input-window/spec.md](spec.md)

**Input**: User request: `"/specify tạo một text window vào vị trí này, window này dùng để hiện lên đoạn văn mẫu dùng để được đọc chính tả."`

---

## 1. Summary

This plan integrates a dedicated **Sample Text Window (`.dictation-sample-window`)** embedded directly into the Dictation view layout between the **Top Header Bar** and the **Audio Control Deck**:
1. **Always-Visible Reference Text**: Displays the French passage (đoạn văn mẫu) currently being read for dictation, with sentence count, clitic word count, and grammar tags.
2. **Level Selector Chips**: Quick selection for **A1, A2, B1, and B2** right inside the Text Window header.
3. **Copy / Paste & Direct Edit Mode**: A **`📋 Coller un texte`** action that toggles an in-place editing textarea, allowing learners or teachers to paste custom French texts.
4. **Sovereign AI Generator Actions**: Direct **`🎲 Aléatoire`** and **`✨ Générer IA`** action buttons that instantly inject level-calibrated French passages from `aiTextGenerator.js`.
5. **Real-Time Deck Synchronization**: Changing the sample text instantly re-segments sentences, calculates clitic word counts, and updates the Audio Deck and Transcription Area below.

---

## 2. Technical Context

- **Language/Version**: JavaScript (ESM, ECMAScript 2022, Node.js 18+ for test runner)
- **Primary Dependencies**: Pure Vanilla JS + Vanilla CSS (zero external runtime dependencies)
- **Storage**: `localStorage` (`frenchlab_custom_dictations` for saved custom & generated exercises)
- **Testing**: `node --test tests/french-lab.test.js` (validating AI text generation calibration, sentence segmentation, and custom dictation handling)
- **Target Platform**: Modern web browsers (Chrome, Edge, Safari, Firefox), 100% offline capable
- **Performance Goals**: Instant text swap < 16ms, AI generation < 50ms, zero layout shifts

---

## 3. Constitution Check

| Principle | Requirement | Compliance Status | Rationale |
|:---|:---|:---:|:---|
| **I. Sidebar-Workspace Architecture** | Persistent Left Sidebar; High-Fidelity Workspace Integration | **PASS** | Adds the Text Window card directly into the existing Dictation workspace without altering global sidebar integrity. |
| **II. Strict CEFR Alignment** | Rigorous evaluation; CEFR levels A1 to B2; French clitic rules | **PASS** | Generates texts strictly calibrated to CEFR linguistic structures (vocabulary, verb tenses, sentence count). |
| **III. Test-First & Audio Mocking** | TDD; headless testing; 100% test pass rate | **PASS** | Automated tests verify generator outputs for levels A1, A2, B1, B2 and sentence splits. |
| **IV. Local Sovereignty & Offline** | Zero data loss; sovereign `localStorage`; fully offline capable | **PASS** | Generative engine runs 100% client-side with zero external cloud dependencies. |
| **V. Premium Aesthetics & Pure Vanilla** | Visual Excellence matching reference screenshot; Pure Vanilla JS + CSS | **PASS** | Styled in cohesive Midnight Indigo glassmorphism (`rgba(15, 27, 45, 0.75)`). |

---

## 4. Architectural Layout & Component Design

```
+-----------------------------------------------------------------------------------------+
| .dictation-top-bar                                                                      |
| [← Rédaction]   🎧 Mode Dictée  [B1]                    [🎙️ Web Speech] [Vitesse: 1.0x] |
+-----------------------------------------------------------------------------------------+
| .dictation-sample-window                                                                |
| ┌─────────────────────────────────────────────────────────────────────────────────────┐ |
| │ Header: 📝 Đoạn văn mẫu (Texte modèle)    [A1] [A2] [B1] [B2]                       │ |
| │ Actions: [📋 Coller un texte] [🎲 Sujet Aléatoire] [✨ Générer IA]                  │ |
| ├─────────────────────────────────────────────────────────────────────────────────────┤ |
| │ Body:                                                                               │ |
| │  - View Mode: Formatted French passage text with typography & quotation styling     │ |
| │  - Edit Mode: Clean textarea with live word & sentence counter + [Valider] button   │ |
| ├─────────────────────────────────────────────────────────────────────────────────────┤ |
| │ Footer: 📊 3 phrases • 34 mots • Thème : Vie Quotidienne • 📌 Points grammaticaux   │ |
| └─────────────────────────────────────────────────────────────────────────────────────┘ |
+-----------------------------------------------------------------------------------------+
| .dictation-deck-card (Audio Control Deck)                                               |
| Phrase 1 sur 3 [=========================>                                            ] |
| [◀ Précédent]             [ ▶ Écouter ]             [ 🔄 Réécouter ]        [Suivant ▶] |
+-----------------------------------------------------------------------------------------+
| .dictation-deck-card (Transcription Area & Diacritics)                                  |
| [ Phrase 1 ] [ Texte intégral ]                                                         |
| [ Écoutez la phrase 1 et tapez ce que vous entendez en français...                    ] |
| [Accents: é è ê ë à â ...]                                                              |
| Mots transcrits: 0 (Attendu: ~11 mots)                   [Effacer]  [🎯 Corriger dictée]|
+-----------------------------------------------------------------------------------------+
```

---

## 5. File Modifications Plan

1. **`src/styles/dictation.css`**:
   - Add styles for `.dictation-sample-window`:
     - Container: Glassmorphic dark card (`background: rgba(15, 27, 45, 0.75)`, border `rgba(99, 102, 241, 0.25)`, border-radius `10px`).
     - Window header: Title badge with `📝`, level chips grid, and action button toolbar.
     - Text display area: High legibility, font size `1rem`, line height `1.7`, soft glowing border.
     - In-place textarea for paste/edit mode with live counter pill.
     - Window footer: Metadata badges (theme, grammar tags, word/sentence stats).

2. **`src/ui/DictationView.js`**:
   - Add `this.isWindowEditing = false;` to track paste/edit mode in the sample text window.
   - Render `.dictation-sample-window` directly above `.dictation-deck-card`.
   - Implement handlers:
     - Level chip click (`handleWindowLevelChange(level)`).
     - Paste toggle & submit (`handleWindowPaste(text)`).
     - AI generate trigger (`handleWindowAIGenerate()`).
     - AI random topic trigger (`handleWindowRandomTopic()`).
   - Re-segment sentences and update audio deck seamlessly upon text change.

3. **`tests/french-lab.test.js`**:
   - Verify all existing 13 tests remain 100% green.
