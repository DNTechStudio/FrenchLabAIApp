# Implementation Plan: DELF B2 Writing Practice Application

**Branch**: `001-delf-b2-writing-practice` | **Date**: 2026-09-21 | **Spec**: [specs/001-delf-b2-writing-practice/spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/spec.md)

**Input**: Feature specification from `specs/001-delf-b2-writing-practice/spec.md`

## Summary

Build a modern, lightweight, distraction-free web application tailored for candidates practicing French DELF B2 writing (*Production Écrite*). The application features a two-pane layout:
- **Left Pane (Editor)**: Curated DELF B2 prompt selector (Formal letters, Argumentative essays, Forum articles) with a "Random Topic" button, clean text editor, and real-time French word counter tracking the 250+ word target.
- **Right Pane (Comparison & Feedback)**: Side-by-side comparison pane showing the improved B2-level version of the essay with red visual diff markers (strike-through removals and B2 vocabulary upgrades) and structured pedagogical notes mapped to official DELF B2 criteria.
- **Architecture**: Vite + React + TypeScript with zero backend dependencies required for core usage. Includes local persistence (`localStorage`) for zero data loss and a pluggable AI service layer with an offline Mock engine plus optional Gemini/OpenAI API integration.

## Technical Context

**Language/Version**: TypeScript 5.x / ECMAScript 2022 (Node.js >= 18)

**Primary Dependencies**: 
- `react` & `react-dom` (v18 / v19)
- `diff` (`jsdiff`) for word-level LCS text comparison
- `lucide-react` (or lightweight SVG icons) for distraction-free UI actions

**Storage**: Browser `localStorage` with versioned schema (`delf_b2_storage_v1`), supporting debounced autosave (300ms) and offline draft recovery.

**Testing**: `vitest` + `@testing-library/react` + `jsdom` for fast unit, tokenizer, diffing, and component tests.

**Target Platform**: Evergreen Web Browsers (Chrome, Firefox, Safari, Edge) on desktop and tablet.

**Project Type**: Client-side Single Page Web Application (Vite SPA).

**Performance Goals**: 
- Word counter calculation latency: < 50ms per keystroke (SC-001)
- Prompt switching and context load: < 100ms (SC-002)
- Input frame budget: 60fps (< 16ms typing latency)

**Constraints**: 
- Constitution Principle II: 100% draft preservation across browser reloads (zero data loss).
- Constitution Principle V: Offline-first capability with built-in Mock improvement engine for zero-setup practice.
- Word counting respects French linguistic rules (elisions with apostrophes counted as 2 words).

**Scale/Scope**: Focused single-page application with modular domain logic, UI components, and pluggable service adapters.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Design Compliance | Status |
|---|---|---|---|
| **I. Clean Code & Maintainability** | Intention-revealing naming, strict typing, low coupling, no dead code | Domain logic (`src/domain/`) strictly typed in TypeScript; UI components isolated in `src/components/`; zero dead code | **PASS** |
| **II. Exceptional UX & Learner Delight** | Distraction-free writing, autosave, zero data loss, instant feedback (<50ms), French diacritics support | Two-pane split view, Google Fonts (Outfit & Inter), live 250-word progress badge, red visual diffing, debounced local autosave | **PASS** |
| **III. Test-First & Automated Verification** | TDD for core business logic, >80% coverage for domain utilities | Automated unit tests for French word counter, diff engine, mock AI service, and storage adapter via Vitest | **PASS** |
| **IV. Domain Separation & Modular Architecture** | Decouple business rules from UI and infrastructure | Pure domain functions (`frenchWordCounter`, `diffEngine`, `prompts`) independent of React; pluggable `ImprovementService` interface | **PASS** |
| **V. Performance, Offline Resilience & Data Integrity** | Sub-100ms response, offline-first, schema-validated storage | Client-side execution, offline Mock engine, versioned local storage schema (`storage.schema.json`) | **PASS** |

**Gate Result**: **PASS** (Zero violations, 100% alignment with Constitution v1.0.0).

## Project Structure

### Documentation (this feature)

```text
specs/001-delf-b2-writing-practice/
├── plan.md              # Implementation Plan
├── research.md          # Phase 0 Technical Research & Architecture Decisions
├── data-model.md        # Phase 1 Data Models & State Lifecycles
├── quickstart.md        # Phase 1 Runnable Validation & Testing Guide
├── contracts/           # Phase 1 JSON Schemas & Interface Contracts
│   ├── prompt.schema.json
│   ├── ai-improvement.contract.json
│   └── storage.schema.json
└── checklists/
    └── requirements.md  # Specification Quality Checklist
```

### Source Code (repository root)

```text
WritingDELFB2/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── domain/
│   │   ├── types.ts                 # TypeScript interfaces (Prompt, Draft, DiffToken, etc.)
│   │   ├── frenchWordCounter.ts     # Linguistic French word counter
│   │   ├── diffEngine.ts            # Word-level diff generator
│   │   └── prompts.ts               # Official DELF B2 prompts repository
│   ├── services/
│   │   ├── improvementService.ts    # Abstract ImprovementService interface
│   │   ├── mockImprovementService.ts# Built-in offline rule/heuristic engine
│   │   ├── geminiImprovementService.ts# Optional live Gemini API provider
│   │   └── storageService.ts        # LocalStorage persistence manager
│   └── components/
│       ├── Header.tsx               # App bar with theme toggle & settings
│       ├── PromptSelector.tsx       # Dropdown & "Random Topic" button
│       ├── EditorPane.tsx           # Left pane: writing space & live status
│       ├── ComparisonPane.tsx       # Right pane: original vs improved text
│       ├── WordCounterBadge.tsx     # Real-time progress towards 250 words
│       ├── DiffViewer.tsx           # Visual diff highlighting (red removals, green additions)
│       ├── PedagogicalNotes.tsx     # Explanations categorized by DELF B2 criteria
│       └── SettingsModal.tsx        # API key & AI provider configuration
└── tests/
    ├── unit/
    │   ├── frenchWordCounter.test.ts# Tokenizer and word count edge cases
    │   ├── diffEngine.test.ts       # Word-level diff correctness
    │   └── storageService.test.ts   # Autosave and draft restoration
    └── contract/
        └── mockImprovementService.test.ts # Verifies schema compliance
```

**Structure Decision**: Selected a modular Web Application layout separating pure domain logic (`src/domain/`), service adapters (`src/services/`), and UI presentation (`src/components/`), thoroughly backed by automated tests (`tests/`).

## Complexity Tracking

> *No Constitution violations identified. All modules adhere strictly to simplicity and YAGNI.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *None* | N/A | N/A |
