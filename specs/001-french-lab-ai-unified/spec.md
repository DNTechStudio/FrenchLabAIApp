# Feature Specification: French Lab AI (Sidebar-Workspace & High-Fidelity Modules)

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Status**: Ready for Planning & Implementation

**Input**: User wireframe & explicit architectural requirement:
1. **Layout**:
   - **Left Sidebar**: Brand `French Lab AI` + 4 Navigation Items (`DELF-DALF Speaking`, `DELF-DALF Writing`, `Daily Conversation`, `Debate`) + Teal/Cyan vertical divider.
   - **Right Main Workspace**: Dynamic container hosting the active module view.
2. **High-Fidelity Integration Requirement**:
   - When the user selects **`DELF-DALF Speaking`**, the right workspace MUST replicate **100% of the UI layout, stepper, controls, and functions** of project `TEC-2026-07 PRO-06 DELF-DALF Lab Speaking`.
   - When the user selects **`DELF-DALF Writing`**, the right workspace MUST replicate **100% of the UI layout, editor, diff viewer, and functions** of project `TEC-2026-07 PRO-05 DELF-DALF Lab Writing`.
   - When the user selects **`Daily Conversation`**, the right workspace hosts the dedicated 2-party & 3-party everyday conversational roleplay engine.
   - When the user selects **`Debate`**, the right workspace hosts the dedicated adversarial Pour/Contre debate arena with logical connector tracking and rhetoric scoring.

---

## 1. Executive Summary & Interface Layout Architecture

```
+---------------------------------------------------------------------------------------------------------------+
| French Lab AI App Window                                                                                      |
+----------------------+----------------------------------------------------------------------------------------+
| SIDEBAR (Left ~22%)  | MAIN WORKSPACE (Right ~78%)                                                            |
|                      |                                                                                        |
| French Lab AI        | When "DELF-DALF Speaking" is active:                                                   |
|                      | ────────────────────────────────────────────────────────────────────────────────────── |
| • DELF-DALF Speaking | [DELF-DALF Lab Speaking • Simulateur d'Épreuve Orale]                                 |
| • DELF-DALF Writing  | [Sub-Modes: Mode Examen | Mode Entraînement] [Speed: 0.75x 1x 1.25x | Clear Transcript]   |
|   Daily Conversation | [Stepper: 1. Sujet → 2. Préparation (10m) → 3. Exposé Oral → 4. Débat → 5. Bilan]      |
|   Debate             |                                                                                        |
|                      | Dynamic Speaking Views (Identical to PRO-06):                                         |
|                      | - SelectionView: Authentic trigger docs, category filters, random draw, custom topic.  |
|                      | - PreparationView: 10-min countdown timer, digital scratchpad (Plan, Arguments...).    |
|                      | - MonologueView: Mic recording, live canvas audio waveform, elapsed speech timer.       |
|                      | - DebateView: Native French TTS spoken AI examiner, 3-5 interactive debate turns.       |
|                      | - ReportView: Official 25-pt CEFR oral scorecard, transcript, dual B2/C1 elevation.   |
|                      | - PracticeView: Sentence practice, AI topic generator, inline B2/C1 elevation.         |
|                      | ────────────────────────────────────────────────────────────────────────────────────── |
|                      | When "DELF-DALF Writing" is active:                                                    |
|                      | ────────────────────────────────────────────────────────────────────────────────────── |
|                      | [DELF-DALF Lab Writing • Production Écrite A1-C2 & Dictée]                             |
|                      | [Sub-Modes: Mode Écriture | Mode Dictée] [Générer Essai Modèle | Comparer CECRL]       |
|                      |                                                                                        |
|                      | Dynamic Writing Views (Identical to PRO-05):                                          |
|                      | - PromptSelector: 15+ official prompts (Lettre formelle, Essai, Article, Aléatoire).    |
|                      | - Composition Editor: Distraction-free text area, real-time word counter (>= 250 words)|
|                      | - ComparisonPane & DiffViewer: Side-by-side diff (red deletions, emerald additions).  |
|                      | - PedagogicalNotes & Rubric: 25-pt official Production Écrite scorecard.               |
|                      | - DictationPane: Audio player, transcription input, and spelling error detection.      |
| ──────────────────── | ────────────────────────────────────────────────────────────────────────────────────── |
| [CEFR: B2 ▼] [FR/VI] | When "Daily Conversation" is active:                                                   |
| [Export / Backup 💾] | - 2-party & 3-party roleplays, situational bank (medical, work, préfecture), STT, TTS. |
|                      | When "Debate" is active:                                                               |
|                      | - Controversies, Pour/Contre stance, 3-5 rounds, connecteurs logiques, rhetoric rubric.|
+----------------------+----------------------------------------------------------------------------------------+
```

---

## 2. High-Fidelity Module Specifications

### 2.1 DELF-DALF Speaking Workspace (100% Fidelity with PRO-06)

When the user selects **`DELF-DALF Speaking`** in the left sidebar, the main workspace renders the complete interface and functionality from `TEC-2026-07 PRO-06 DELF-DALF Lab Speaking`:

1. **Speaking Sub-Header & Controls**:
   - **Brand Bar**: `DELF-DALF Lab Speaking • Simulateur d'Épreuve Orale — France Éducation international`.
   - **App Mode Switcher**:
     - `Mode Examen`: Full 5-phase official exam flow.
     - `Mode Entraînement`: Practice mode for rapid sentence/argumentation training.
   - **Audio & Exam Toolbar**:
     - Voice Speed Toggle: `0.75x`, `1.0x`, `1.25x` for native French TTS playback.
     - `Effacer transcription` button: Instant reset of transcribed speech.
     - Volume control slider.
   - **5-Phase Examination Stepper**:
     - `1. Sujet` (Active when choosing document)
     - `2. Préparation (10m)` (Active during countdown)
     - `3. Exposé Oral` (Active during monologue recording)
     - `4. Débat` (Active during AI examiner debate)
     - `5. Bilan` (Active during 25-pt report viewing)

2. **Speaking Workspace Sub-Views**:
   - **SelectionView**:
     - Filter tabs by theme: *Tous*, *Travail & Société*, *Environnement*, *Numérique*, *Éducation*.
     - Trigger Document Cards: Displaying title, category badge, word count, excerpt.
     - Action Buttons: `Tirage au sort (Aléatoire)` and `Sujet personnalisé (Custom)`.
     - Direct button to launch 10-minute preparation.
   - **PreparationView**:
     - Countdown Timer: 10:00 minutes with color warning (< 2 mins amber, < 30s red).
     - Timer Controls: `Pause / Reprendre`, `+1 min`, `-1 min`, `Passer à l'oral`.
     - Pinned Trigger Document Drawer (expandable/collapsible).
     - Digital Structured Scratchpad: Sections for *Introduction / Problématique*, *Plan & Arguments*, and *Conclusion*.
   - **MonologueView**:
     - Live Audio Visualizer: Canvas rendering real-time animated sound waveform during speaking.
     - Speaking Timer: Tracking elapsed oral defense (target: 5-7 mins).
     - Live Speech-to-Text transcript display with real-time word accumulator.
     - Action: `Terminer mon exposé et lancer le Débat`.
   - **DebateView**:
     - AI Examiner Avatar & Spoken French Audio: The examiner introduces questions using native French TTS.
     - Conversation Exchange Feed: Displays examiner questions and user rebuttals.
     - Turn Counter: Progress tracker for 3 to 5 debate rounds.
     - Microphone Input: Candidate records counter-arguments with instant STT feedback.
     - Action: `Conclure le débat et afficher le Bilan`.
   - **ReportView**:
     - Official 25-Point Oral Scorecard:
       - *Monologue suivi* (/6)
       - *Exercice en interaction* (/6)
       - *Lexique & Registre* (/5)
       - *Morphosyntaxe orale* (/5)
       - *Maîtrise phonologique* (/3)
     - Dual-Level Speech Elevation:
       - Tab 1: *Version B2 Standard* (Cleaned, grammatically fluent phrasing).
       - Tab 2: *Version C1 Avancée* (Academic, sophisticated French phrasing with advanced connectors).
     - Full transcript review with highlighted linguistic feedback.
   - **PracticeView (Mode Entraînement)**:
     - AI Practice Topic Generator: Generate tailored debate prompts on the fly.
     - Interactive sentence recorder with instant inline elevation comparison.

---

### 2.2 DELF-DALF Writing Workspace (100% Fidelity with PRO-05)

When the user selects **`DELF-DALF Writing`** in the left sidebar, the main workspace renders the complete interface and functionality from `TEC-2026-07 PRO-05 DELF-DALF Lab Writing`:

1. **Writing Sub-Header & Controls**:
   - **Brand Bar**: `DELF-DALF Lab Writing • Entraînement Production Écrite & Correction IA`.
   - **Sub-Mode Switcher**:
     - `Mode Écriture`: Official essay composition and AI improvement.
     - `Mode Dictée`: French dictation audio practice with accuracy diagnostics.
   - **Action Bar**:
     - `Générer Essai Modèle`: AI produces an exemplar B2/C1 essay for the current prompt.
     - `Comparer Niveaux CECRL`: Modal showing comparative essays from A1 to C2.

2. **Writing Workspace Sub-Views**:
   - **PromptSelector**:
     - Dropdown listing official DELF B2/DALF C1 prompts grouped by category:
       - *Lettre formelle* (Lettre au maire pour préservation du parc, Lettre au DRH sur le télétravail).
       - *Essai argumenté* (L'IA dans l'éducation, Interdiction des vols courts).
       - *Article / Contribution de forum* (Semaine de 4 jours, Consommation responsable).
     - `Sujet Aléatoire` button to pick a prompt instantly.
     - Prompt Context Box: Explicit instructions, context, and official constraints.
   - **Composition Editor & Word Counter**:
     - Distraction-Free Text Area: Generous font size, comfortable line height.
     - Real-Time Word Counter Badge:
       - Strict French tokenization enforcing clitic rules (*l'homme*, *d'accord*, *c'est* counted accurately as 2 words).
       - Visual progress indicator toward the 250-word threshold:
         - `< 200 words`: Amber warning (`Nécessite au moins 250 mots`).
         - `200 - 249 words`: Approaching threshold notice.
         - `≥ 250 words`: Emerald green success badge (`Longueur conforme`).
     - Action Buttons: `AI Améliorer (Amélioration B2)`, `Effacer`, `Copier`.
   - **ComparisonPane & Visual Diff Viewer**:
     - Split Side-by-Side or Unified Diff View:
       - **Left Column (Texte Original)**: Highlights deletions and grammatical flaws in red background (`#fee2e2` / dark red highlight).
       - **Right Column (Texte Amélioré B2/C1)**: Highlights upgraded vocabulary, connectors, and sentence structures in emerald green (`#dcfce7` / dark green highlight).
     - Pedagogical Commentary Notes:
       - Specific linguistic explanations mapped to DELF criteria: *Respect de la consigne*, *Cohérence & Cohésion*, *Morphosyntaxe*, *Compétence lexicale*.
     - Official 25-Point Production Écrite Scorecard:
       - Consigne (/5), Cohérence (/6), Morphosyntaxe (/7), Lexique (/7) $\to$ Total /25.
   - **Mode Dictée (DictationPane)**:
     - Audio Player: Plays authentic French sentences at selectable speeds.
     - Candidate Input Box: Candidate types what they hear.
     - Evaluation: Automated character/word accuracy percentage and phonetic error detection.

---

### 2.3 Daily Conversation Workspace (Pillar III - PRO-07)

When the user selects **`Daily Conversation`** in the left sidebar:
- Dynamic conversation studio supporting both **2-party** (User + 1 AI) and **3-party** (User + 2 AI interlocutors) roleplays.
- Scenario catalog across 5 real-life domains (Medical, Workplace, University, Préfecture, Commerce).
- Real-time STT microphone recording with audio visualizer waveform.
- Graduated expression recommendations (*Suggestions d'expression*) from A2 to C1.
- Custom Scenario Creator structuring raw ideas into full French situational dialogues.

---

### 2.4 Debate Arena Workspace (Pillar IV - PRO-07)

When the user selects **`Debate`** in the left sidebar:
- Adversarial argumentation arena on contemporary societal debates.
- Stance selection (**Pour** / **Contre**).
- 3 to 5 turn-taking rounds with an opposing AI debater.
- Real-time detection and taxonomy tagging of *Connecteurs logiques* (Cause, Conséquence, Opposition, Concession, Conclusion).
- 25-point Rhetoric Scorecard analyzing argumentation depth, rebuttal quality, and dialectical fluidity.

---

## 3. Navigation & State Persistence Protocol

1. **No-Reload Architecture**:
   - Clicking an item in the sidebar hides non-active workspace panels and displays the selected workspace panel immediately (`display: none` / `display: flex`).
   - Timers in Speaking (e.g. 10m prep timer) continue running in the background if the user briefly switches to another tab.
   - Essay drafts in Writing remain saved in memory and `localStorage` so switching between Speaking and Writing NEVER discards candidate input.
2. **Design Tokens & Theme Consistency**:
   - Both PRO-05 and PRO-06 views are styled with the unified Deep Petrol / Ocean Teal palette (`#0c3d56`, `#082b3d`, `#22d3ee`) while strictly preserving their distinctive layouts, buttons, controls, and components.
