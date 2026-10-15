<!--
Sync Impact Report:
- Version change: Unratified template -> 1.0.0
- Ratified: 2026-10-01 | Last Amended: 2026-10-01
- Project: French Lab AI (TEC-2026-07 PRO-07)
- Unification: Consolidates and harmonizes the Constitutions of PRO-05 (Writing Lab) and PRO-06 (Speaking Lab) into the unified Super-App standard.
- Core Principles Ratified:
  * I. Sidebar-Workspace Architecture & High-Fidelity Integration
  * II. Strict CEFR Alignment & Pedagogical Rigor (CECRL A1 - C2)
  * III. Test-First, Deterministic Rubrics & Audio Mocking (NON-NEGOTIABLE)
  * IV. Local Sovereignty, Zero Data Loss & Offline Resilience
  * V. Premium Aesthetics & Pure Vanilla Architecture
- Added Sections:
  * Technical & Security Constraints (Microphone Privacy, Secure Configuration)
  * Development Workflow & Quality Gates (SDD, TDD, Gate Reviews)
  * Governance & Semantic Versioning Rules
-->

# French Lab AI Constitution

## Core Principles

### I. Sidebar-Workspace Architecture & High-Fidelity Integration
The application interface MUST strictly follow the Sidebar-Workspace paradigm established in project specifications:
- **Persistent Left Sidebar (`#app-sidebar`)**: Contains the unified brand title **`French Lab AI`**, the four primary navigation items (**`DELF-DALF Speaking`**, **`DELF-DALF Writing`**, **`Daily Conversation`**, **`Debate`**), active glowing indicators, and footer utilities (CEFR level selector, 4-language i18n switcher, and sovereign backup button).
- **Subtle Vertical Divider**: A crisp, elegant border line with cyan/teal accent (`border-right: 1px solid rgba(34, 211, 238, 0.35)`) separating navigation from the workspace.
- **Dynamic Right Workspace (`#main-workspace`)**: Occupies the remainder of the viewport (75%-80%) and dynamically mounts the active module view.
- **High-Fidelity Replication (NON-NEGOTIABLE)**:
  - When the user selects **`DELF-DALF Speaking`**, the workspace MUST replicate **100% of the UI layout, stepper, controls, and functions** of project `TEC-2026-07 PRO-06 DELF-DALF Lab Speaking` (Header bar, 5-phase stepper, selection, 10-minute prep timer, digital scratchpad, monologue waveform, spoken AI examiner debate, 25-pt oral rubric, dual B2/C1 elevation, and practice mode).
  - When the user selects **`DELF-DALF Writing`**, the workspace MUST replicate **100% of the UI layout, editor, diff viewer, and functions** of project `TEC-2026-07 PRO-05 DELF-DALF Lab Writing` (Prompt selector, distraction-free editor, 250+ live word counter, side-by-side visual diff with red deletions and green additions, pedagogical notes, 25-pt writing rubric, and Mode Dictée).
  - When the user selects **`Daily Conversation`**, the workspace MUST host the dedicated 2-party & 3-party situational roleplay engine with live STT and graduated suggestions (A2-C1).
  - When the user selects **`Debate`**, the workspace MUST host the dedicated adversarial Pour/Contre debate arena with real-time logical connector tracking and rhetoric scoring.
- **Zero-Reload SPA**: View switching between all four modules MUST be instantaneous with zero page reloads, maintaining active drafts and state in memory.

### II. Strict CEFR Alignment & Pedagogical Rigor (CECRL A1 - C2)
All evaluation engines, scoring grids, and linguistic feedback MUST rigorously align with the official standards published by **France Éducation international**:
- **Production Écrite (Writing)**: Evaluated on the official 25-point scale (*Respect de la consigne /5*, *Cohérence & Cohésion /6*, *Morphosyntaxe /7*, *Compétence lexicale /7*). Word counting MUST adhere strictly to French orthographic tokenization clitic rules (*l'homme*, *d'accord*, *c'est* accurately counted as 2 words) enforcing the $\ge 250$ words threshold.
- **Production Orale (Speaking)**: Evaluated on the official 25-point scale (*Monologue suivi /6*, *Exercice en interaction /6*, *Lexique /5*, *Morphosyntaxe /5*, *Phonologie /3*). Speech elevation MUST provide dual-level recommendations (Standard B2 vs Academic C1).
- **Daily Conversation & Débat**: Explicitly calibrated across CEFR levels A1 to C2. The Débat Arena MUST analyze dialectical competence through recognized logical connector taxonomy (*Cause, Conséquence, Opposition, Concession, Conclusion*) and classical rhetorical strategies (*Concession & Réfutation*).
- All scores and qualitative feedback MUST be deterministic, pedagogically constructive, and actionable.

### III. Test-First, Deterministic Rubrics & Audio Mocking (NON-NEGOTIABLE)
Quality and pedagogical precision are non-negotiable and MUST be continuously verified through automated testing:
- **Test-Driven Development (TDD)**: All domain logic—including French tokenization, word counting, connector analysis, scoring rubrics, 3-party turn transitions, and state machines—MUST be developed with automated unit tests written before or alongside implementation.
- **Headless Audio Mocking**: Audio and speech services (Web Speech STT and SpeechSynthesis TTS) MUST provide mock streams and synthetic audio buffers so that the entire test suite (`node --test tests/french-lab.test.js`) runs headlessly, deterministically, and fast in CI/CD without hardware dependencies.
- **Regression Prevention**: Any reported bug MUST be accompanied by a failing regression test prior to merging the fix.

### IV. Local Sovereignty, Zero Data Loss & Offline Resilience
The candidate's educational journey and private data MUST be completely secure, resilient, and sovereign:
- **Zero Data Loss**: Active essay drafts, digital scratchpad notes, voice recordings, and conversation histories MUST be autosaved continuously into client-side storage (`localStorage` and `IndexedDB`). Switching between sidebar views or refreshing the browser MUST never discard active work.
- **Full Data Sovereignty**: All student records remain strictly local on the user's device. The application MUST provide a one-click JSON backup export and restore mechanism.
- **Offline & Standalone Operation**: The application MUST operate with zero external backend dependencies, capable of running fully locally via a zero-dependency static server.

### V. Premium Aesthetics & Pure Vanilla Architecture
The user interface MUST deliver a state-of-the-art, immersive aesthetic tailored for French language mastery:
- **Deep Petrol Teal Palette**: Rich, cohesive color tokens matching user specifications (`#0c3d56` primary workspace, `#082b3d` sidebar, `#22d3ee` cyan accent divider, `#104e6e` glassmorphic surfaces).
- **Typography & Ergonomics**: High-legibility typography optimized for French diacritics (accent aigu, grave, circonflexe, tréma, cédille), generous line heights, and WCAG 2.1 AA accessible contrast ratios.
- **Pure Vanilla Stack**: Built with pure Vanilla JavaScript (ESM) and Vanilla CSS. No bulky monolithic frameworks (no React, no Vue in runtime bundle), ensuring sub-second initial load and blazing runtime performance.

---

## Technical & Security Constraints

### Microphone Privacy & Audio Diagnostics
- Microphone permissions MUST only be requested upon explicit candidate interaction (e.g. clicking "Commencer l'enregistrement" or "Activer le micro").
- Clear visual indicators (animated waveform visualizer) MUST confirm active recording status.
- Fail-safe fallback to text input or pre-recorded prompts MUST be available if microphone hardware is inaccessible.

### Safe Credential & Environment Management
- Third-party AI APIs (if configured) MUST be managed securely via environment variables.
- API keys MUST NEVER be hardcoded into public repositories or client-side bundles.

---

## Development Workflow & Quality Gates

### Spec-Driven Development (SDD)
All functional enhancements and implementations MUST follow the Spec-kit cycle:
1. **Specify (`/specify`)**: Define clear requirements and acceptance scenarios in `spec.md`.
2. **Plan (`/plan`)**: Establish the architectural layout and component contracts in `plan.md`.
3. **Tasks**: Break down development into granular, testable tasks in `tasks.md`.
4. **Implement**: Execute code adhering to TDD, clean Vanilla ESM, and this Constitution.

### Quality Gates
- **Gate 1 (Automated Verification)**: 100% of unit and integration tests (`tests/french-lab.test.js`) must pass with zero failures.
- **Gate 2 (Constitutional Fidelity)**: Verification that `DELF-DALF Speaking` and `DELF-DALF Writing` workspaces 100% replicate the UI and functions of PRO-06 and PRO-05 respectively.
- **Gate 3 (UX & Persistence Check)**: Verification that switching between views in the sidebar preserves all drafts, notes, and timers without data loss.

---

## Governance

This Constitution is the supreme engineering and architectural authority for the **French Lab AI** project, superseding all informal conventions and ad-hoc practices.
- **Amendments**: Any modification requires explicit justification, documentation of impact, and an updated version number.
- **Semantic Versioning for Constitution**:
  - **MAJOR**: Incompatible governance shifts, removal of core principles, or architectural restructuring.
  - **MINOR**: Addition of new principles, new sections, or substantial expansion of technical guidance.
  - **PATCH**: Wording improvements, typo corrections, and non-semantic clarifications.
- **Compliance**: All specifications (`specs/`), architectural plans (`plan.md`), and implementations MUST actively comply with this Constitution.

**Version**: 1.0.0 | **Ratified**: 2026-10-01 | **Last Amended**: 2026-10-01
