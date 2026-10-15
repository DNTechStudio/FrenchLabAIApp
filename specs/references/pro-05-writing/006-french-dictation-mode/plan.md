# Implementation Plan: 006 — Interactive French Dictation Mode (« La Dictée DELF B2 »)

**Branch**: `006-french-dictation-mode` | **Date**: 2026-09-25 | **Spec**: [specs/006-french-dictation-mode/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/006-french-dictation-mode/spec.md)

**Input**: Feature specification from `specs/006-french-dictation-mode/spec.md`

---

## 1. Summary

Introduce an interactive French Dictation training mode (« La Dictée DELF B2 ») allowing candidates to listen to spoken sentences from official DELF B2 topics or AI model essays and transcribe them into an interactive editor.
1. **Offline Audio Engine**: Native browser Web Speech Synthesis (`SpeechSynthesisUtterance`, `fr-FR`), 100% free, 100% offline.
2. **Keyboard Ergonomics**: `Ctrl + Space` to replay the active sentence, `Play/Pause`, and speed selector (`0.75x` / `1.0x`).
3. **French Linguistic Error Diagnostics**: Real-time / on-demand evaluation comparing user input against reference text, categorized into:
   - 🔴 **Accords & Grammaire** (plural `-s/-x`, feminine `-e`, past participles)
   - 🟡 **Accents & Diacritiques** (missing/extra `é, è, ê, à, ç`)
   - 🔵 **Homophones Grammaticaux** (`c'est/s'est`, `a/à`, `ou/où`, `ces/ses`, `on/ont`)
   - 🟢 **Lexique & Ponctuation** (omissions, insertions, typos)
4. **Accuracy Scoring**: Standardized $0–100\%$ score reflecting DELF B2 grading criteria.
5. **Dual Architecture Parity**: Full parity across React SPA components and single-file [`standalone.html`](standalone.html).

---

## 2. Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022  
**Primary Dependencies**: React 19, Lucide React (`Headphones`, `Play`, `Pause`, `RotateCcw`, `Volume2`, `Award`, `CheckCircle2`)  
**Browser APIs**: Web Speech Synthesis API (`window.speechSynthesis`, `SpeechSynthesisUtterance`)  
**Storage**: Session state in LocalStorage; non-destructive to user essay drafts  
**Testing**: `node:test` runner (`node tests/run-all-tests.mjs`)  
**Target Platform**: Modern Web Browsers (Chrome, Edge, Safari, Firefox)  
**Performance Goals**: <16ms UI latency; instant (<50ms) offline transcription diff & error classification  
**Constraints**: Must strictly conform to Constitution Principle V (Offline-First Capability) and Principle IV (Domain Separation)  

---

## 3. Constitution Gate Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, zero dead code | Pure functions in `dictationEngine.ts`; strict types in `types.ts`; zero external unvetted dependencies | **PASS** |
| **II. Exceptional UX & Learner Delight** | Zero data loss, fluid typing, French diacritic support, high contrast | Distraction-free dictation interface; `Ctrl+Space` instant replay; clear badge classification; light/dark theme compliance | **PASS** |
| **III. Test-First & Automated Verification** | Test core logic prior to implementation | Automated unit tests in `tests/run-all-tests.mjs` verifying sentence splitter, mistake classifier, and accuracy formula | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decouple business logic from UI and Speech API | Pure evaluation logic in `dictationEngine.ts` decoupled from `speechSynthesisService.ts` and `DictationPane.tsx` | **PASS** |
| **V. Performance & Offline Resilience** | 100% offline resilience, sub-100ms response | Browser-native `window.speechSynthesis` with local OS voices; client-side diff evaluation; zero network traffic | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## 4. Project Structure

### Documentation (this feature)
```text
specs/006-french-dictation-mode/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Technical Research & Architecture Decisions
├── data-model.md        # Data Model & Schema Definitions
├── quickstart.md        # Verification & Testing Guide
└── tasks.md             # Granular Task Breakdown (generated in /task)
```

### Source Code Modifications & Additions
```text
src/
├── domain/
│   ├── types.ts                  # [MODIFY] Add DictationSession, DictationEvaluation, DictationMistake types
│   ├── translations.ts           # [MODIFY] Add Dictation translations (FR, EN, ZH, VI)
│   └── dictationEngine.ts        # [NEW] Pure functions: splitFrenchSentences, classifyDictationMistake, calculateAccuracy
├── services/
│   └── speechSynthesisService.ts # [NEW] Wrapper for window.speechSynthesis with French voice resolution
├── components/
│   ├── DictationPane.tsx         # [NEW] Audio controls, sentence progress, transcription textarea, error badges
│   └── EditorPane.tsx            # [MODIFY] Add toggle button between Essay Composition and Dictation mode
├── App.tsx                       # [MODIFY] Wire active view mode (editor vs dictation) and pass reference text
standalone.html                   # [MODIFY] 100% parity implementation: dictation audio controls, local evaluation, tabs
tests/
└── run-all-tests.mjs             # [MODIFY] Add Suite 9: Dictation Engine unit tests
```

---

## 5. Implementation Phases & Milestones

### Phase 1: Domain Core & Automated Tests (Test-First)
- Implement `src/domain/dictationEngine.ts`:
  - `splitFrenchSentences(text: string): string[]`: French-aware sentence splitting shielding abbreviations (*M.*, *Mme.*, *etc.*).
  - `classifyDictationMistake(expected: string, user: string): DictationMistakeCategory`: Accords, Accents, Homophones, Lexique.
  - `evaluateDictation(expectedText: string, userText: string): DictationEvaluation`: Calculates accuracy percentage and detailed mistake list.
- Add Suite 9 in `tests/run-all-tests.mjs` verifying:
  - Sentence segmentation on complex French administrative prompts.
  - Accurate categorization of accent errors, agreement mismatches, and grammatical homophones.
  - Accuracy percentage boundaries (0–100%).

### Phase 2: Speech Synthesis Service & Audio Controls
- Implement `src/services/speechSynthesisService.ts`:
  - French voice detection and fallback (`fr-FR`, `fr-CA`, `fr-BE`).
  - Safe cancel, pause, resume, and rate configuration (`0.75x`, `1.0x`).
  - Keybinding listener for `Ctrl + Space` to replay active sentence.

### Phase 3: React SPA Components
- Create `src/components/DictationPane.tsx`:
  - Mode banner and toggle between *Mode Rédaction* and *Mode Dictée*.
  - Audio toolbar: Play, Pause, Replay, Speed, Sentence stepper (`Phrase X / Y`).
  - Clean transcription textarea with real-time character & word counter.
  - Results card: Taux d'exactitude gauge, categorized mistake pills, and unified visual diff.
- Update `src/App.tsx` and `src/domain/translations.ts`:
  - Provide complete translations for FR, EN, ZH, and VI.

### Phase 4: Standalone Distribution Parity (`standalone.html`)
- Integrate dictation engine and audio controls directly into `standalone.html`:
  - Embed `splitFrenchSentences` and `evaluateDictation`.
  - Add Dictation tab button in header or editor toolbar.
  - Implement Web Speech Synthesis controls and mistake analysis UI.

### Phase 5: Verification & Browser Testing
- Run `node tests/run-all-tests.mjs`.
- Launch Google Chrome via browser subagent on `http://localhost:8080/standalone.html`.
- Test sentence-by-sentence dictation, `Ctrl + Space` keyboard replay, speed adjustment, and submission evaluation.
