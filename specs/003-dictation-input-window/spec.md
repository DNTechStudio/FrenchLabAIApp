# Feature Specification: Dictation Sample Text Window & AI Generator

**Feature Branch**: `003-dictation-input-window`  
**Created**: 2026-10-02  
**Status**: Specified & Aligned  

---

## 1. Overview & Vision

In the **French Lab AI Super-App (Mode Dictée)**, learners need clear visibility and full control over the **reference French text (đoạn văn mẫu)** being dictated.

A dedicated **Sample Text Window (`dictation-sample-window`)** is integrated **directly between the Top Header Row and the Audio Control Deck Card** (as visually marked by the user):
- **Always Visible**: It remains prominently displayed on the Dictation page directly above the audio controls and transcription deck.
- **Reference Text Display**: Displays the current French passage being read for dictation, with sentence count, word count, and CEFR level badge.
- **Direct Input & AI Generation Actions**:
  - **Level Selector**: Quick chips for **A1, A2, B1, B2** (and C1/C2).
  - **`📋 Coller un texte`**: Allows the user to paste any custom French text directly into the window or edit it, instantly becoming the active dictation exercise.
  - **`🎲 Sujet Aléatoire`** & **`✨ Générer IA`**: Instant sovereign generation of an authentic French passage for the selected level across 6 thematic categories (*Vie Quotidienne, Voyage, Société, Écologie, Travail, Culture*).
- **Synchronized Audio & Transcription**: Whenever the text in this window changes (via paste, edit, or AI generation), the Audio Deck (`Phrase 1 sur N`, audio synthesizer, progress bar) and the Transcription Area below immediately update to segment and practice the new text.

---

## 2. Visual Placement & Architecture

```
+-----------------------------------------------------------------------------------+
|  [← Rédaction]   🎧 Mode Dictée  [B1]              [🎙️ Web Speech] [Vitesse: 1.0x] | (Top Header)
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  📝 TEXT WINDOW (Đoạn văn mẫu đọc chính tả)                                      | <--- NEW TEXT WINDOW
|  -------------------------------------------------------------------------------- |
|  [Niveau: A1 | A2 | B1 | B2]   [📋 Coller un texte]  [🎲 Aléatoire]  [✨ Générer IA] |
|  "Ce matin, le soleil brille sur les toits de Paris. Dans la rue commerçante,     |
|   l'odeur du pain chaud attire les passants..."                                    |
|  (3 phrases • 34 mots • Thème : Vie Quotidienne)                                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
|  Phrase 1 sur 3 [====================>                                          ] | (Audio Deck)
|  [◄ Précédent]             [ ▶ Écouter ]             [ 🔄 Réécouter ]  [Suivant ►]|
+-----------------------------------------------------------------------------------+
|  [ Phrase 1 ] [ Texte intégral ]                                                  | (Transcription Deck)
|  [ Écoutez la phrase 1 et tapez ce que vous entendez en français...             ] |
|  [Accents: é è ê ë à â ...]                                                       |
|  Mots transcrits: 0 (Attendu: ~11 mots)            [Effacer]  [🎯 Corriger ma dictée] |
+-----------------------------------------------------------------------------------+
```

---

## 3. User Scenarios & Acceptance Criteria

### User Story 1 - Viewing the Sample Text in the Text Window (Priority: P1)

As a French learner,  
I want to see the sample text (đoạn văn mẫu) displayed clearly in a dedicated window right above the audio controls,  
So that I can read the source text, understand its context, and follow along with the audio dictation.

**Acceptance Scenarios**:
1. **Given** the user is in Mode Dictée, **When** the page loads, **Then** the **Text Window** is rendered between the top bar and the audio control deck.
2. **Given** a selected exercise (e.g. B1 "Une transition écologique nécessaire"), **Then** the full French passage is clearly displayed inside the Text Window with word count and sentence count.

---

### User Story 2 - Pasting Custom Text into the Text Window (Priority: P1)

As a learner or teacher,  
I want to click **« 📋 Coller / Saisir »** or type directly into the Text Window,  
So that I can practice transcription on any custom French text, article, or lesson.

**Acceptance Scenarios**:
1. **Given** the user clicks **« 📋 Coller un texte »**, **When** pasting a new passage into the Text Window, **Then** the text updates immediately.
2. **Given** the user submits the custom text, **When** confirmed, **Then** the Audio Deck updates to `Phrase 1 sur N`, sentences are re-segmented protecting French abbreviations (*M.*, *Mme.*, *Dr.*, *etc.*), and words are re-counted adhering to French clitic rules (*l'arbre*, *c'est*).

---

### User Story 3 - AI Random Topic & Text Generation by CEFR Level (Priority: P1)

As a candidate preparing for DELF/DALF exams,  
I want to select my target level (**A1, A2, B1, B2**) and click **« ✨ Générer IA »** (or **« 🎲 Sujet Aléatoire »**),  
So that the Text Window instantly populates with an authentic French passage calibrated to my chosen level.

**Acceptance Scenarios**:
1. **Given** level **A1** is selected, **When** clicking **« ✨ Générer IA »**, **Then** a 20–40 word passage in present tense with basic coordination appears in the Text Window.
2. **Given** level **A2** is selected, **When** generating, **Then** a 45–75 word passage featuring passé composé and everyday vocabulary appears.
3. **Given** level **B1** is selected, **When** generating, **Then** a 70–110 word passage with logical connectors and relative clauses appears.
4. **Given** level **B2** is selected, **When** generating, **Then** a 90–150 word formal argumentative passage appears.
5. **Given** clicking **« 🎲 Sujet Aléatoire »**, **Then** a random theme is selected across categories and a fresh passage is placed in the Text Window.
6. **Given** the new text is generated, **Then** the Audio Deck resets to Phrase 1 and is immediately ready to speak the new sentences.

---

### User Story 4 - Level Selection in the Text Window (Priority: P1)

As a student,  
I want to switch between levels (**A1, A2, B1, B2**) using chips in the Text Window,  
So that the sample text adjusts to my proficiency level.

**Acceptance Scenarios**:
1. **Given** the user clicks an A2 chip, **When** clicked, **Then** an A2 passage is loaded into the Text Window and the audio deck synchronizes.

---

## 4. Requirements & Non-Functional Constraints

### Functional Requirements
- **FR-001**: The Text Window MUST be placed directly below `.dictation-top-bar` and directly above `.dictation-deck-card`.
- **FR-002**: The Text Window MUST always be open and visible.
- **FR-003**: The Text Window MUST include:
  - Header with title: `📝 Texte Modèle (Dictée)` or `📝 Đoạn văn mẫu`.
  - Level selector chips: `A1`, `A2`, `B1`, `B2`.
  - Action buttons: `📋 Coller un texte`, `🎲 Aléatoire`, `✨ Générer IA`.
  - Passage container: Displays the current passage formatted cleanly, or an editable textarea when in paste/edit mode.
  - Metadata footer: Word count, sentence count, category, and grammar focus points.
- **FR-004**: System MUST synchronize the Audio Deck and Transcription Area instantly when the sample text changes.
- **FR-005**: Sovereign client-side AI generation (`aiTextGenerator.js`) MUST operate 100% offline with zero external network dependencies.
- **FR-006**: Custom pasted and generated texts MUST be saved in `localStorage` under `frenchlab_custom_dictations` for persistent reload.

### Design Aesthetics & Constraints
- Matches the Midnight Indigo glassmorphism design system (`rgba(15, 27, 45, 0.75)`, border `rgba(99, 102, 241, 0.25)`, glowing indigo accents).
- High visual legibility, elegant typography, and responsive layout.
