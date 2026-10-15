# Implementation Plan: 005 — AI Model Essay Generation on Empty Input

**Branch**: `005-ai-model-essay-generation` | **Date**: 2026-09-25 | **Spec**: [specs/005-ai-model-essay-generation/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/005-ai-model-essay-generation/spec.md)

**Input**: Feature specification from `specs/005-ai-model-essay-generation/spec.md`

---

## 1. Summary

Allow candidates to trigger AI assistance even when their editor draft is completely empty (`0/250 mots`). In this autonomous generation mode:
1. The **« Améliorer avec l'IA »** button is permanently enabled and clickable.
2. Clicking the button with an empty editor prompts the AI to act as an exemplary candidate and generate a full, high-scoring model essay answering the active exam prompt from scratch.
3. If multiple CEFR levels are selected (e.g. `B1` and `C1`), the system produces contrasting model answers for each level in parallel windows.
4. The comparison window automatically defaults to **Clean View** (`viewMode: 'clean'`) to present the generated essay clearly without distracting diff artifacts.
5. Implemented across both the React application components and the single-file distribution ([`standalone.html`](standalone.html)) in both Mock Offline and Gemini Online modes.

---

## 2. Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022  
**Primary Dependencies**: React 19, Lucide React (Sparkles, Eye, Columns, Copy, Check)  
**Storage**: N/A (Does not overwrite user drafts unless explicitly pasted/copied)  
**Testing**: `node:test` runner (`node tests/run-all-tests.mjs`)  
**Target Platform**: Modern Web Browsers (Chrome, Edge, Safari, Firefox)  
**Performance Goals**: <100ms response in Mock mode; <4s response in Gemini API mode  
**Constraints**: Must preserve Constitution Principle V (Offline-First Capability) and Principle II (Exceptional UX)  

---

## 3. Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, zero dead code | Explicit `isAutonomous` flag in improvement service contracts; strict typing on prompt and level parameters | **PASS** |
| **II. Exceptional UX & Learner Delight** | Zero data loss, intuitive behavior, accessible contrast | Solves "blank page syndrome"; button is never unexpectedly locked; defaults to clean essay view for readability | **PASS** |
| **III. Test-First & Automated Verification** | Automated tests for autonomous generation | Automated test cases in `tests/run-all-tests.mjs` verifying empty input produces valid model essays | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decoupled prompt generation from UI components | Autonomous prompt logic encapsulated in `mockImprovementService.ts` and `geminiImprovementService.ts` | **PASS** |
| **V. Performance & Offline Resilience** | Offline resilience, sub-100ms response | Pre-crafted offline mock model essays for all exam prompts; zero mandatory internet connectivity | **PASS** |

**Gate Result**: **PASS** (Zero violations).

---

## 4. Project Structure

### Documentation (this feature)
```text
specs/005-ai-model-essay-generation/
├── spec.md              # Feature Specification
├── plan.md              # This file
├── research.md          # Technical Research & Architecture Decisions
├── data-model.md        # Data Model & Schema Definitions
├── quickstart.md        # Verification & Testing Guide
└── tasks.md             # Implementation tasks checklist (to be generated next)
```

### Source Code Modifications
```text
src/
├── domain/
│   ├── types.ts                  # [MODIFY] Add isAutonomous option to improvement contracts
│   └── mockImprovementService.ts # [MODIFY] Add autonomous model essay generation per prompt and level
├── services/
│   └── geminiImprovementService.ts # [MODIFY] Handle empty draft by generating model answer from scratch
├── components/
│   ├── EditorPane.tsx            # [MODIFY] Enable button on empty text; adapt title/tooltip
│   └── ComparisonWindow.tsx      # [MODIFY] Default viewMode to 'clean' when isAutonomous is true
standalone.html                   # [MODIFY] Parity implementation of button enable, mock essay generation, and default clean view
tests/
└── run-all-tests.mjs             # [MODIFY] Add unit tests for empty draft model generation
```

---

## 5. Implementation Phases & Milestones

### Phase 1: Service Layer Enhancement (Mock & Gemini)
- Update `mockImprovementService.ts` to detect `text.trim().length === 0`:
  - Return high-quality, pre-crafted model essays answering the active prompt for `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
  - Include relevant pedagogical notes highlighting why this model essay succeeds.
- Update `geminiImprovementService.ts`:
  - When `text.trim().length === 0`, send an autonomous prompt instructing Gemini to write a complete model essay answering the prompt at the chosen CEFR level.

### Phase 2: Editor Pane Button State & UI Interaction
- In `EditorPane.tsx`:
  - Change button disabled condition: `disabled={isLoading}` (remove `wordCount < 10` restriction).
  - Update tooltip: When `wordCount === 0`, show *"Générer une réponse modèle avec l'IA"* or localized equivalent.
- In `ComparisonWindow.tsx`:
  - When result is from an autonomous model generation, default initial view mode to `'clean'` (`Version améliorée [Level]`).

### Phase 3: Standalone Single-File Parity (`standalone.html`)
- In `standalone.html`:
  - Remove `wordCount < 10` from `handleImprove` and button `disabled` attribute.
  - Implement autonomous model generation in `improveEssayMock` and `improveEssayGemini` for all 6 CEFR levels.
  - Auto-select `viewMode: 'clean'` for generated model essays.

### Phase 4: Automated Testing & Verification
- Add automated unit tests in `tests/run-all-tests.mjs` verifying:
  - Calling mock improvement service with empty string returns a complete essay (>200 words for B2/C1).
  - Output contains valid criteria notes.
- Verify end-to-end in Chrome browser across all levels and prompts.
