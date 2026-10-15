# Technical Architecture & Implementation Plan: French Lab AI (High-Fidelity Integration)

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Status**: Ready for Execution

**Associated Specification**: [spec.md](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/spec.md)

---

## 1. High-Fidelity Workspace Mount Architecture

To fulfill the user requirement:
- When **`DELF-DALF Speaking`** is clicked: `#view-speaking` mounts the exact view stack of `TEC-2026-07 PRO-06 DELF-DALF Lab Speaking` (Header with stepper, SelectionView, PreparationView with 10m timer & scratchpad, MonologueView with waveform, DebateView with spoken AI examiner, ReportView with 25-pt oral rubric and dual B2/C1 elevation, and PracticeView).
- When **`DELF-DALF Writing`** is clicked: `#view-writing` mounts the exact interface of `TEC-2026-07 PRO-05 DELF-DALF Lab Writing` (Header, PromptSelector, Distraction-free editor with 250+ word counter badge, Side-by-side diff viewer with red deletions and green additions, Pedagogical notes by DELF criteria, 25-pt writing rubric, and Mode Dictée).
- When **`Daily Conversation`** is clicked: `#view-conversation` mounts the 2-party & 3-party roleplay engine.
- When **`Debate`** is clicked: `#view-debate` mounts the adversarial Pour/Contre debate arena with logical connector tracking.

```
+-----------------------------------------------------------------------------------------------+
| index.html (Root Container)                                                                   |
|                                                                                               |
| +------------------------+---+--------------------------------------------------------------+ |
| | <aside id="sidebar">   |   | <main id="main-workspace">                                   | |
| |                        | | |                                                              | |
| | French Lab AI          | | | +----------------------------------------------------------+ | |
| |                        | | | | <section id="view-speaking" class="workspace-view">       | | |
| | • DELF-DALF Speaking   | | | | (100% PRO-06 Speaking App Layout, Stepper, Views)         | | |
| | • DELF-DALF Writing    | | | +----------------------------------------------------------+ | |
| |   Daily Conversation   | | | | <section id="view-writing" class="workspace-view">        | | |
| |   Debate               | | | | (100% PRO-05 Writing App Layout, Diff, Rubrics, Dictée)   | | |
| |                        | | | +----------------------------------------------------------+ | |
| | [CEFR: B2] [FR/VI]     | | | | <section id="view-conversation" class="workspace-view">   | | |
| | [Export JSON]          | | | | (Daily Life Situational Roleplays 2 & 3 Persons)          | | |
| |                        | | | +----------------------------------------------------------+ | |
| |                        | | | | <section id="view-debate" class="workspace-view">         | | |
| |                        | | | | (Adversarial Arena, Pour/Contre, Connectors)             | | |
| |                        | | | +----------------------------------------------------------+ | |
| +------------------------+---+--------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Directory Layout & Integration Strategy

```
FrenchLabAIApp/
├── index.html                   # Super-App shell (Sidebar + 4 Workspace View Mounts)
├── package.json                 # ESM configuration & test scripts
├── dev-server.js                # Zero-dependency local Node.js static server
├── src/
│   ├── app.js                   # Main application coordinator & router
│   ├── styles/
│   │   ├── main.css             # Unified Deep Petrol Teal theme tokens
│   │   ├── sidebar.css          # Left sidebar layout & active indicators
│   │   ├── speaking.css         # Direct import of PRO-06 styles (components, views, practice)
│   │   ├── writing.css          # Direct import of PRO-05 styles (editor, diff, rubric, dictée)
│   │   ├── conversation.css     # Daily conversation chat & roleplay styles
│   │   └── debate.css           # Debate arena & connector tagging styles
│   ├── core/
│   │   ├── router.js            # Workspace switcher & persistence trigger
│   │   ├── speaking/            # Direct port from PRO-06 core (timer, examiner, rubric, elevation)
│   │   ├── writing/             # Direct port from PRO-05 core (wordCounter, diffEngine, rubric, dictation)
│   │   ├── conversation/        # Daily conversation engine (2 & 3 party manager, suggester)
│   │   ├── debat/               # Debate engine (debateEngine, connectorAnalyzer, rhetoricRubric)
│   │   ├── speech/              # Audio & Speech services (STT, TTS, waveform)
│   │   ├── i18n/                # Multilingual translations (FR, VI, EN, ZH)
│   │   └── storage/             # Sovereign persistence in localStorage
│   ├── data/
│   │   ├── triggerDocuments.js  # From PRO-06
│   │   ├── writingPrompts.js    # From PRO-05
│   │   ├── scenarios.js         # Daily life roleplay scenarios
│   │   ├── debateTopics.js      # Controversial debate topics
│   │   └── connectors.js        # Taxonomy of French logical connectors
│   └── ui/
│       ├── SidebarView.js       # Sidebar controller
│       ├── SpeakingView.js      # PRO-06 High-Fidelity view coordinator
│       ├── WritingView.js       # PRO-05 High-Fidelity view coordinator
│       ├── ConversationView.js  # Daily conversation view coordinator
│       └── DebateView.js        # Debate arena view coordinator
└── tests/
    └── french-lab.test.js       # Integration test suite
```

---

## 3. High-Fidelity View Porting Plan

1. **Speaking Module Porting (`SpeakingView.js`)**:
   - Reuse PRO-06 view components (`SelectionView`, `PreparationView`, `MonologueView`, `DebateView`, `ReportView`, `PracticeView`).
   - Wire the 5-step stepper and sub-mode toggle (`Mode Examen` vs `Mode Entraînement`).
   - Connect Web Speech recognition and audio waveform to canvas.
2. **Writing Module Porting (`WritingView.js`)**:
   - Reuse PRO-05 components (PromptSelector, WordCounterBadge with clitic tokenization, EditorPane, ComparisonPane with DiffViewer, PedagogicalNotes, 25-pt Rubric, Mode Dictée).
   - Wire `AI Améliorer` diff engine and model essay generator.
3. **Daily Conversation & Debate**:
   - Integrated as peer workspace views matching the same theme tokens and standards.
