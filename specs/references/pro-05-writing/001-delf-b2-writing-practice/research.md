# Technical Research & Architecture Decisions: DELF B2 Writing Practice

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/spec.md) | **Date**: 2026-09-21 | **Status**: Complete

## 1. Technical Decisions & Justifications

### 1.1 Frontend Framework & Runtime
- **Decision**: **Vite + React 18/19 + TypeScript (Strict Mode)**
- **Rationale**:
  - React provides declarative UI state management essential for synchronizing the two-pane editor, live word counter badge, comparison diff viewer, and prompt switching.
  - TypeScript guarantees strict compile-time typing for DELF B2 prompts, diff tokens, rubric criteria, and AI service payloads (Constitution Principle I).
  - Vite offers instant HMR (Hot Module Replacement), fast bundle build times, and native ESM support.
- **Alternatives Considered**:
  - *Next.js*: Unnecessary server complexity and deployment overhead for what is fundamentally a client-side, offline-resilient SPA.
  - *Vanilla JS*: Feasible, but state management between the two panes (editor sync, diff highlighting, autosave, loading states) is more maintainable and testable with React hooks.

### 1.2 Client-Side Word-Level Diffing Engine
- **Decision**: **`diff` (`jsdiff`) via `diffWordsWithSpace`**
- **Rationale**:
  - `diffWordsWithSpace` preserves whitespace while identifying exact word-level removals, substitutions, and additions.
  - Generates token arrays with `{ value: string, added?: boolean, removed?: boolean }`, directly mapping to visual diff rendering.
  - Red highlighting (`diff-removed`) with strike-through clearly indicates user errors or phrases replaced by higher-level B2 vocabulary, while green/emerald highlighting (`diff-added`) showcases the elevated expression.
  - Proven performance: under 10ms for essays up to 1,000 words.
- **Alternatives Considered**:
  - *diff-match-patch*: Highly efficient character-level diffing, but character-level diffs are visually noisy for language learners (e.g., highlighting single letters inside words rather than whole vocabulary choices).
  - *Custom Myers LCS*: Re-inventing the wheel adds maintenance risk without adding learner value. `jsdiff` is small (~12kB gzipped) and zero-dependency.

### 1.3 French Word Counter (Linguistic Tokenizer)
- **Decision**: **Custom French Word Counter (`frenchWordCounter.ts`)**
- **Algorithm**:
  - Delimiters: whitespace and apostrophes (elisions).
  - Rules:
    - Elisions with apostrophe (*c'est*, *l'arbre*, *j'ai*, *d'accord*) = counted as 2 distinct words.
    - Compound words with hyphens (*peut-être*, *c'est-à-dire*, *socio-économique*) = counted according to standard DELF B2 guidelines (space-delimited compounds count as single lexical units unless separated by apostrophes).
    - Punctuation marks (., ?, !, :, ;, « », "", etc.) and numbers are handled cleanly without inflating word count.
  - Target tracking: Live calculation against the 250-word threshold with reactive status (`under_target`, `nearing_target`, `target_achieved`).
- **Rationale**: Meets Constitution Principle II & Success Criteria SC-001 (sub-50ms execution on every keystroke).

### 1.4 Pluggable AI Service Architecture
- **Decision**: **Pluggable `ImprovementService` Interface**
  - `ImprovementService`: `improveEssay(request: ImprovementRequest): Promise<ImprovementResponse>`
  - Implementations:
    1. **`MockImprovementService` (Default / Fallback)**: Deterministic, rule-and-template-based B2 improvement generator. Analyzes user text, detects common B1-level patterns (e.g., informal salutations in letters, lack of *subjonctif*, basic connectors like *et* or *mais*), generates elevated B2 phrasing, and produces realistic pedagogical notes mapped to the 4 DELF B2 criteria. Works 100% offline without API keys.
    2. **`GeminiImprovementService`**: Direct client-side invocation of Google Gemini API (`gemini-1.5-flash` or `gemini-2.5-flash`) using structured JSON Schema (`responseSchema`) when the user enters an API key in the app settings modal.
    3. **`OpenAIImprovementService`**: Extensible provider for OpenAI/Claude-compatible endpoints.
- **Rationale**:
  - Full offline capability (Constitution Principle V).
  - Zero lock-in: learners can practice immediately with the mock engine or plug in their personal API key for dynamic LLM feedback.

### 1.5 Persistence & Zero Data Loss Strategy
- **Decision**: **`LocalStorage` with structured schema and debounced writes**
- **Implementation**:
  - Key: `delf_b2_active_session` and `delf_b2_drafts_v1`
  - Debounce: 300ms on typing + immediate sync on prompt switch and window `beforeunload`.
  - Content: stores current prompt ID, essay text, last modified timestamp, and cached improvement results per topic.
- **Rationale**:
  - Guaranteed recovery on browser crash or accidental tab close (Constitution Principle II).
  - Storage size for text essays is minimal (<100KB for dozens of essays), well within the 5MB `localStorage` limit.

### 1.6 Styling & UI Aesthetics
- **Decision**: **Vanilla CSS with Design Tokens & Modern Typography**
- **Aesthetic Principles**:
  - Two-pane split view (Desktop: 50/50 side-by-side; Tablet/Mobile: responsive tabbed toggle).
  - Typography: Google Fonts `Outfit` for UI headings + `Inter` for clean, distraction-free essay writing.
  - Colors: Curated deep slate background (`#0f172a`), warm card surfaces (`#1e293b`), elegant indigo accents (`#6366f1`), crimson red diff tags (`#ef4444` / `rgba(239, 68, 68, 0.15)`), and crisp white text.
  - Smooth transitions, glassmorphic headers, and clear visual hierarchy.
