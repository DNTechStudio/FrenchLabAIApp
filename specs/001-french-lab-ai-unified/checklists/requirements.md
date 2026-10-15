# Requirements Verification Checklist: French Lab AI (High-Fidelity Specification)

**Feature Branch**: `001-french-lab-ai-unified`

**Created**: 2026-10-01

**Associated Specification**: [spec.md](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-07%20French%20Lab%20AI/FrenchLabAIApp/specs/001-french-lab-ai-unified/spec.md)

---

## 1. High-Fidelity DELF-DALF Speaking Workspace (100% Match with PRO-06)

- [ ] **REQ-SP-01**: Displays PRO-06 header bar with title `DELF-DALF Lab Speaking • Simulateur d'Épreuve Orale — France Éducation international`.
- [ ] **REQ-SP-02**: Provides 5-step stepper: `1. Sujet → 2. Préparation (10m) → 3. Exposé Oral → 4. Débat → 5. Bilan`.
- [ ] **REQ-SP-03**: Includes sub-mode switcher: `Mode Examen` vs `Mode Entraînement`.
- [ ] **REQ-SP-04**: Includes toolbar with voice speed controls (0.75x, 1.0x, 1.25x), `Effacer transcription` button, and volume slider.
- [ ] **REQ-SP-05**: SelectionView displays authentic trigger documents categorized by theme, "Tirage au sort", and "Sujet personnalisé".
- [ ] **REQ-SP-06**: PreparationView displays 10-minute countdown timer with controls (+1m, -1m, pause, skip) and digital scratchpad (Introduction, Problématique, Plan, Arguments, Conclusion).
- [ ] **REQ-SP-07**: MonologueView displays live audio waveform on canvas and elapsed speaking timer (5-7 mins).
- [ ] **REQ-SP-08**: DebateView features interactive AI Examiner spoken exchange (3-5 rounds) with native French TTS.
- [ ] **REQ-SP-09**: ReportView displays official 25-point CEFR oral scorecard, transcript analysis, and dual-level spoken CEFR elevation (Standard B2 vs Advanced C1).
- [ ] **REQ-SP-10**: PracticeView provides AI topic generation and inline sentence elevation.

---

## 2. High-Fidelity DELF-DALF Writing Workspace (100% Match with PRO-05)

- [ ] **REQ-WR-01**: Displays PRO-05 header bar with title `DELF-DALF Lab Writing • Production Écrite A1-C2 & Dictée`.
- [ ] **REQ-WR-02**: Includes sub-mode switcher: `Mode Écriture` vs `Mode Dictée`.
- [ ] **REQ-WR-03**: Includes prompt selector dropdown with 15+ official prompts (Lettre formelle, Essai argumenté, Article/Forum, Sujet Aléatoire).
- [ ] **REQ-WR-04**: Provides distraction-free text editor with real-time French word counter enforcing $\ge 250$ target and clitic rules (*l'homme*, *d'accord* = 2 words).
- [ ] **REQ-WR-05**: "AI Améliorer" button opens comparison pane with side-by-side visual diff (red deletions, emerald additions).
- [ ] **REQ-WR-06**: Displays pedagogical notes categorized by DELF criteria (Consigne, Cohérence, Morphosyntaxe, Lexique).
- [ ] **REQ-WR-07**: Displays official 25-point Production Écrite scorecard.
- [ ] **REQ-WR-08**: Mode Dictée features audio player, candidate transcription input, and real-time accuracy scoring.
- [ ] **REQ-WR-09**: Provides "Générer Essai Modèle" and "Comparer Niveaux CECRL" modals.

---

## 3. Dedicated Daily Conversation Workspace (Pillar III - PRO-07)

- [ ] **REQ-CV-01**: 2-party roleplay (Candidate + 1 AI) and 3-party roleplay (Candidate + 2 AI characters taking alternating turns).
- [ ] **REQ-CV-02**: 20+ situational scenarios covering medical, workplace, university, préfecture, commerce.
- [ ] **REQ-CV-03**: STT microphone input with live waveform and editable transcript.
- [ ] **REQ-CV-04**: Graduated phrasing suggestions (*Suggestions d'expression*) across A2-C1.
- [ ] **REQ-CV-05**: Custom Scenario Creator converting user briefs into structured French roleplays.

---

## 4. Dedicated Debate Arena Workspace (Pillar IV - PRO-07)

- [ ] **REQ-DB-01**: 20+ controversial societal debate topics (AI, 4-day workweek, ecology, social media).
- [ ] **REQ-DB-02**: Stance selector for **Pour** or **Contre**.
- [ ] **REQ-DB-03**: 3 to 5 turn-taking rounds with adversarial AI debater.
- [ ] **REQ-DB-04**: Real-time detection and taxonomy highlighting of *Connecteurs logiques*.
- [ ] **REQ-DB-05**: 25-point Rhetorical Scorecard analyzing argument depth, concession/refutation, and vocabulary.

---

## 5. Sidebar Shell & Sovereign Persistence

- [ ] **REQ-SB-01**: Persistent left sidebar displaying title "French Lab AI" and 4 menu items with active indicators.
- [ ] **REQ-SB-02**: Teal/Cyan vertical divider line (`border-right: 1px solid rgba(34, 211, 238, 0.35)`).
- [ ] **REQ-SB-03**: Sidebar footer contains CEFR level selector (A1-C2), i18n language switcher (FR, VI, EN, ZH), and JSON export button.
- [ ] **REQ-SB-04**: Instant view switching in `#main-workspace` without page reload.
- [ ] **REQ-SB-05**: 100% local persistence in `localStorage`: switching between views never loses drafts or timers.
