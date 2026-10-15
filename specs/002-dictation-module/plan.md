# Implementation Plan: 100% High-Fidelity UI Alignment for Standalone Dictation Module (002-dictation-module)

**Branch**: `002-dictation-module` | **Date**: 2026-10-02 | **Spec**: [specs/002-dictation-module/spec.md](spec.md)

**Input**: User request: `"/specify làm lại giao diện của mục \"Dictation\" giống như vầy"` with reference screenshot from PRO-05's Mode Dictée.

---

## Summary

This plan synchronizes the standalone Dictation workspace (`DictationView.js`) to achieve **100% visual and structural fidelity** with the proven Mode Dictée layout from PRO-05 (Writing Lab). The interface reproduces the exact card hierarchy:
1. **Top Bar Header**: `← Rédaction` button, `🎧 Mode Dictée` title, level badge (`B1`), voice badge (`🎙️ Web Speech`), and speed selector (`0.75x` vs `1.0x` pills).
2. **Audio Control Deck Card**: `Phrase X sur Y`, linear progress fill bar, `◀ Précédent [Ctrl+←]`, glowing indigo `► Écouter` center button (toggles to `⏸ Pause`), `🔁 Réécouter [Ctrl+Space]`, and centered `Suivant ▶ [Ctrl+→]`.
3. **Transcription Input Box**: Mode tabs (`Phrase X` vs `Texte intégral (X phrases)`), dark inset textarea with italic instruction placeholder, diacritic accent helper row.
4. **Action Bar**: Real-time transcribed word counter (`Mots transcrits : X (Attendu : ~Y mots)`), `Effacer` button, and `🎯 Corriger ma dictée` gradient submission button.
5. **Deterministic Diagnostics**: Sentence-by-sentence word diff, homophone and grammatical error breakdown, and CEFR-calibrated assessment.

---

## Technical Context

**Language/Version**: JavaScript (ESM, ECMAScript 2022, Node.js 18+ for test runner)  
**Primary Dependencies**: Pure Vanilla JS + Vanilla CSS (zero external runtime dependencies)  
**Storage**: Sovereign `localStorage` (`frenchlab_active_dictation` for draft autosaving, `frenchlab_dictation_history` for attempts)  
**Testing**: `node --test tests/french-lab.test.js` (clitic tokenization, French homophone classification, word-level diff, accuracy scoring)  
**Target Platform**: Modern web browsers (Chrome, Edge, Safari, Firefox), 100% offline capable  
**Performance Goals**: Audio start < 150ms, view switching < 50ms, diff calculation < 200ms  
**Aesthetics & Theme**: Deep Petrol Teal & Midnight Navy (`rgba(13, 27, 42, 0.95)`), Indigo accents (`#4f46e5`, `#6366f1`, `#818cf8`), WCAG 2.1 AA contrast  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Compliance Status | Rationale |
|:---|:---|:---:|:---|
| **I. Sidebar-Workspace Architecture** | Persistent Left Sidebar; High-Fidelity Workspace Integration | **PASS** | Adds `Dictation` to `#app-sidebar` with active cyan indicator; mounts into `#view-dictation` matching PRO-05 fidelity. |
| **II. Strict CEFR Alignment** | Rigorous evaluation; CEFR levels A1 to C2; French orthographic clitic rules | **PASS** | Evaluates accuracy with clitic word counting rules (*l'homme* = 2 words) and official French homophone clusters. |
| **III. Test-First & Audio Mocking** | TDD; headless audio mocking; 100% test pass rate | **PASS** | Automated unit tests in `tests/french-lab.test.js` pass headlessly with 0 errors. |
| **IV. Local Sovereignty & Offline** | Zero data loss; sovereign `localStorage`; fully offline capable | **PASS** | Active drafts auto-saved on every keystroke; native Web Speech API runs fully locally. |
| **V. Premium Aesthetics & Pure Vanilla** | Visual Excellence matching reference screenshot; Pure Vanilla JS (ESM) + Vanilla CSS | **PASS** | Replicates exact card hierarchy, buttons, kbd shortcut badges, and indigo gradients without monolithic frameworks. |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-dictation-module/
├── spec.md                  # Feature requirements with 100% visual fidelity contract
├── plan.md                  # This implementation plan
├── research.md              # Research & technical decisions
├── data-model.md            # Data structures & storage schema
├── quickstart.md            # Validation scenarios & test commands
├── contracts/
│   └── dictation-api.md     # Interface contracts for Engine & Views
└── checklists/
    └── requirements.md      # Specification quality checklist
```

### Source Code (repository root)

```text
FrenchLabAIApp/
├── index.html                           # #view-dictation workspace mount & dictation.css link
├── src/
│   ├── app.js                           # DictationView registration & routing
│   ├── core/
│   │   ├── router.js                    # 'dictation' -> 'view-dictation' SPA mapping
│   │   ├── dictation/
│   │   │   └── dictationEngine.js       # Sentence splitting, French homophones, word diff
│   │   └── speech/
│   │       └── speechSynthesizer.js     # Web Speech TTS service (0.75x & 1.0x)
│   ├── data/
│   │   └── dictations.js                # Graded catalog of dictation texts (A1 - C2)
│   ├── styles/
│   │   ├── sidebar.css                  # Dictation navigation item
│   │   └── dictation.css                # 100% faithful Mode Dictée styles
│   └── ui/
│       ├── SidebarView.js               # Left sidebar item rendering
│       └── DictationView.js             # High-Fidelity controller matching reference screenshot
└── tests/
    └── french-lab.test.js               # Automated unit & integration tests
```

---

## Complexity Tracking

*No constitutional violations. Zero external runtime dependencies.*
