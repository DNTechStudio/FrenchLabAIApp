# Implementation Tasks: French Lab AI (Sidebar-Workspace & High-Fidelity Modules)

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Status**: Ready for Execution

**Associated Specification**: [spec.md](file:///f:/My%20Drive/(03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/spec.md)

**Associated Plan**: [plan.md](file:///f:/My%20Drive/(03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/plan.md)

**Ratified Constitution**: [constitution.md](file:///f:/My%20Drive/(03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/.specify/memory/constitution.md)

---

## Task Overview & Dependency Graph

```
Phase 1: Shell & Sidebar ──► Phase 2: Speaking Lab (PRO-06) ──┐
                         ──► Phase 3: Writing Lab (PRO-05)  ──┼──► Phase 6: Automated Tests & Validation
                         ──► Phase 4: Daily Conversation   ──┤
                         ──► Phase 5: Debate Arena          ──┘
```

---

## Phase 1: Sidebar Shell & Workspace Layout Foundation

- [x] **TASK-001**: **Application Shell Layout**
  - **Files**: `index.html`, `package.json`, `dev-server.js`
  - **Action**: Create root HTML container with two primary areas: `<aside id="app-sidebar">` (~22% width) and `<main id="main-workspace">` (~78% width).
  - **Acceptance**: File loads properly in browser with clean semantic structure.

- [x] **TASK-002**: **Deep Petrol Teal Design System**
  - **Files**: `src/styles/main.css`, `src/styles/sidebar.css`
  - **Action**: Define CSS custom properties:
    - Primary background: `#0c3d56` (Deep Petrol Teal)
    - Sidebar background: `#082b3d`
    - Dividing border: `1px solid rgba(34, 211, 238, 0.35)`
    - Surface cards: `rgba(255, 255, 255, 0.05)`
    - Accent colors: Cyan `#22d3ee` and Emerald `#10b981`.
  - **Acceptance**: Matches user wireframe colors and contrast standards (WCAG AA).

- [x] **TASK-003**: **Sidebar Navigation Component**
  - **Files**: `src/ui/SidebarView.js`
  - **Action**: Render brand title **`French Lab AI`** and 4 interactive menu items:
    1. `DELF-DALF Speaking`
    2. `DELF-DALF Writing`
    3. `Daily Conversation`
    4. `Debate`
    with active glowing bullets (`•`) and smooth hover animations.
  - **Acceptance**: Clicking any item emits navigation events and updates visual active class.

- [x] **TASK-004**: **Sidebar Utility Controls & Data Sovereignty**
  - **Files**: `src/ui/SidebarView.js`, `src/core/storage/storage.js`, `src/core/i18n/index.js`
  - **Action**: Add footer controls: CEFR level selector dropdown (A1 - C2), language switcher (FR, VI, EN, ZH), and JSON export/import button.
  - **Acceptance**: Changing level or locale updates state in `localStorage`.

- [x] **TASK-005**: **Workspace Client-Side Router**
  - **Files**: `src/core/router.js`, `src/app.js`
  - **Action**: Implement zero-reload view switcher showing/hiding `#view-speaking`, `#view-writing`, `#view-conversation`, `#view-debate`.
  - **Acceptance**: Instant view transition (< 50ms) without page refresh; active view state persisted.

---

## Phase 2: DELF-DALF Speaking Workspace (Consolidated from PRO-06)

*Requirement: 100% Fidelity with `TEC-2026-07 PRO-06 DELF-DALF Lab Speaking`*

- [x] **TASK-006**: **Port Trigger Document Data**
  - **Files**: `src/data/triggerDocuments.js`
  - **Source**: `..\..\TEC-2026-07 PRO-06 DELF-DALF Lab Speaking\DELF-DALFLabSpeakingApp\src\data\topics.js`
  - **Action**: Port authentic DELF B2/DALF C1 debate trigger texts with category metadata and word counts.
  - **Acceptance**: Minimum 10 authentic trigger documents accessible by category.

- [x] **TASK-007**: **Port 10-Minute Preparation Timer & Digital Scratchpad**
  - **Files**: `src/core/speaking/timer.js`, `src/ui/views/speaking/PreparationView.js`
  - **Action**: Port countdown timer (10:00) with pause, +/- 1 min, skip, and scratchpad (Introduction, Problématique, Plan, Arguments, Conclusion).
  - **Acceptance**: Timer alerts at 2m (amber) and 30s (red); scratchpad notes auto-save to `localStorage`.

- [x] **TASK-008**: **Port Live Audio Recording & Waveform Visualizer**
  - **Files**: `src/core/speech/stt.js`, `src/ui/views/speaking/MonologueView.js`, `src/styles/speaking.css`
  - **Action**: Connect Web Speech API and MediaRecorder to canvas-based animated sound waveform.
  - **Acceptance**: Speaking into mic renders real-time audio waves and accumulates transcribed French text.

- [x] **TASK-009**: **Port Spoken AI Examiner Debate Interaction**
  - **Files**: `src/core/speaking/examiner.js`, `src/core/speech/tts.js`, `src/ui/views/speaking/DebateView.js`
  - **Action**: AI examiner speaks questions out loud using native French SpeechSynthesis with speed controls (0.75x, 1.0x, 1.25x) across 3-5 rounds.
  - **Acceptance**: Audio playback triggers automatically with audio speed adjustments.

- [x] **TASK-010**: **Port 25-Point Oral Scorecard & Dual-Level B2/C1 Speech Elevation**
  - **Files**: `src/core/speaking/rubricOral.js`, `src/core/speaking/elevation.js`, `src/ui/views/speaking/ReportView.js`
  - **Action**: Calculate official 25-pt oral scores across 5 criteria; provide dual-level rewritten transcripts (Standard B2 vs Advanced C1).
  - **Acceptance**: Scorecard renders radar/bar criteria breakdown and elevation tabs.

- [x] **TASK-011**: **Assemble Speaking Workspace Component**
  - **Files**: `src/ui/SpeakingView.js`
  - **Action**: Wire header bar, 5-phase stepper (`1. Sujet → 2. Préparation → 3. Exposé → 4. Débat → 5. Bilan`), toolbar, and sub-views into `#view-speaking`.
  - **Acceptance**: End-to-end oral exam session completes smoothly within the right workspace.

---

## Phase 3: DELF-DALF Writing Workspace (Consolidated from PRO-05)

*Requirement: 100% Fidelity with `TEC-2026-07 PRO-05 DELF-DALF Lab Writing`*

- [x] **TASK-012**: **Port Writing Prompt Catalog**
  - **Files**: `src/data/writingPrompts.js`
  - **Source**: `..\..\TEC-2026-07 PRO-05 DELF-DALF Lab Writing\DELF-DALF Lab Writing Application\standalone.html`
  - **Action**: Port 15+ official DELF B2/DALF C1 prompts across formal complaint letters, argumentative essays, and forum contributions.
  - **Acceptance**: Prompts load in dropdown with official instructions and context boxes.

- [x] **TASK-013**: **Port French Tokenization Word Counter ($\ge 250$ Words)**
  - **Files**: `src/core/writing/wordCounter.js`
  - **Action**: Port regex tokenization handling clitic contractions (*l'homme*, *d'accord*, *c'est* = 2 words, hyphenated compounds = 1 word).
  - **Acceptance**: Word count badge updates in real time with amber (< 250) and emerald ($\ge 250$) indicators.

- [x] **TASK-014**: **Port AI Improvement & Side-by-Side Visual Diff Viewer**
  - **Files**: `src/core/writing/diffEngine.js`, `src/styles/writing.css`
  - **Action**: Implement LCS/word-diff algorithm rendering split view: left column red highlights (deletions/flaws), right column emerald highlights (B2/C1 improvements).
  - **Acceptance**: Visual diff clearly highlights exact word additions, removals, and vocabulary substitutions.

- [x] **TASK-015**: **Port Official 25-Point Production Écrite Rubric & Pedagogical Notes**
  - **Files**: `src/core/writing/rubricWriting.js`
  - **Action**: Evaluate Consigne (/5), Cohérence (/6), Morphosyntaxe (/7), Lexique (/7); generate pedagogical commentary mapped to criteria.
  - **Acceptance**: 25-point score breakdown displays with qualitative explanations.

- [x] **TASK-016**: **Port French Dictation Practice Engine (Mode Dictée)**
  - **Files**: `src/core/writing/dictation.js`
  - **Action**: Port sentence audio player, typing input area, homophone cluster classifier, and accuracy score percentage.
  - **Acceptance**: Mode Dictée calculates transcription accuracy and flags grammatical errors.

- [x] **TASK-017**: **Assemble Writing Workspace Component**
  - **Files**: `src/ui/WritingView.js`
  - **Action**: Assemble header, prompt selector, editor pane, comparison pane, diff viewer, model essay generator, and dictation pane into `#view-writing`.
  - **Acceptance**: Full writing and improvement workflow operates cleanly inside `#view-writing`.

---

## Phase 4: Daily Conversation Workspace (Pillar III - PRO-07)

- [x] **TASK-018**: **Situational Scenario Bank**
  - **Files**: `src/data/scenarios.js`
  - **Action**: Create 20+ authentic scenarios across 5 domains: Medical clinic, Corporate/Remote negotiation, University project, Préfecture administration, Daily commerce & rentals.
  - **Acceptance**: Each scenario defines roles, objectives, and starter prompts.

- [x] **TASK-019**: **2-Party & 3-Party Dialogue Controller**
  - **Files**: `src/core/conversation/scenarioManager.js`, `src/core/conversation/turnController.js`
  - **Action**: Support 2-person (User + 1 AI) and 3-person (User + 2 AI characters) interactions with logical turn alternation.
  - **Acceptance**: In 3-party mode, Character A and Character B alternate naturally while maintaining context.

- [x] **TASK-020**: **Graduated Expression Suggester (A2 - C1)**
  - **Files**: `src/core/conversation/suggester.js`
  - **Action**: Generate 3 contextual phrasing recommendations graduated by CEFR level whenever requested.
  - **Acceptance**: Clicking a suggested expression populates or assists user input.

- [x] **TASK-021**: **Custom Scenario Creator**
  - **Files**: `src/ui/views/conversation/CustomScenarioModal.js`
  - **Action**: Convert raw user input (in VI, EN, FR) into structured French roleplays with roles and goals.
  - **Acceptance**: Custom scenarios save to `localStorage` and can be launched immediately.

- [x] **TASK-022**: **Assemble Daily Conversation Workspace Component**
  - **Files**: `src/ui/ConversationView.js`, `src/styles/conversation.css`
  - **Action**: Assemble scenario picker, character avatars, chat timeline, mic recorder, and suggestion bar into `#view-conversation`.
  - **Acceptance**: Interactive 2-party and 3-party roleplays run smoothly with voice and text.

---

## Phase 5: Debate Arena Workspace (Pillar IV - PRO-07)

- [x] **TASK-023**: **Controversial Societal Debate Topics Catalog**
  - **Files**: `src/data/debateTopics.js`
  - **Action**: Compile 20+ controversial themes (AI & jobs, 4-day workweek, ecological transition, social media, gender equality).
  - **Acceptance**: Topics include contextual briefs and core pro/con arguments.

- [x] **TASK-024**: **Pour/Contre Stance Selection & Round State Machine**
  - **Files**: `src/core/debat/debateEngine.js`
  - **Action**: Candidate chooses **Pour** or **Contre**; AI debater adopts the opposing position and challenges the user across 3-5 rounds.
  - **Acceptance**: State machine tracks active round, turn transitions, and final conclusion.

- [x] **TASK-025**: **Real-Time Logical Connectors Analyzer**
  - **Files**: `src/core/debat/connectorAnalyzer.js`, `src/data/connectors.js`
  - **Action**: Detect and highlight French connectors categorized into Cause, Conséquence, Opposition, Concession, Addition, and Conclusion.
  - **Acceptance**: Connectors in candidate utterances are highlighted in real time with category tags.

- [x] **TASK-026**: **25-Point Rhetoric & Dialectical Scorecard**
  - **Files**: `src/core/debat/rhetoricRubric.js`
  - **Action**: Score argument relevance (/5), connector fluency (/5), concession/refutation tactics (/5), vocabulary (/5), and conviction (/5).
  - **Acceptance**: Final debate report renders 25-point breakdown and tactical recommendations.

- [x] **TASK-027**: **Assemble Debate Workspace Component**
  - **Files**: `src/ui/DebateView.js`, `src/styles/debate.css`
  - **Action**: Assemble topic picker, stance selector, round progress indicator, connector badges, and scorecard into `#view-debate`.
  - **Acceptance**: Full adversarial debate session operates seamlessly inside `#view-debate`.

---

## Phase 6: Automated Testing, Quality Gates & Verification

- [x] **TASK-028**: **Core Engine Unit Tests**
  - **Files**: `tests/french-lab.test.js`
  - **Action**: Test French word counting rules (clitics), connector detection, 25-pt writing rubric, and 25-pt oral rubric.
  - **Acceptance**: Unit tests execute via `node --test tests/french-lab.test.js` and pass 100%.

- [x] **TASK-029**: **Integration & State Persistence Tests**
  - **Files**: `tests/french-lab.test.js`
  - **Action**: Test sidebar navigation switching, draft preservation across views, 3-party conversation turn transitions, and debate round flows.
  - **Acceptance**: Integration tests pass 100% without timeouts or state leakage.

- [x] **TASK-030**: **Final End-to-End Walkthrough & Constitutional Audit**
  - **Action**: Start local server (`node dev-server.js`), verify browser rendering at `http://localhost:3000`, test all 4 modules, and confirm 100% compliance with `constitution.md`.
  - **Acceptance**: All 30 tasks marked complete with verifiable results.
