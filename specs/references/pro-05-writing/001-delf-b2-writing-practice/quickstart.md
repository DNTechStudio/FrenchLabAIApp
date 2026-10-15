# Quickstart & Verification Guide: DELF B2 Writing Practice

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/spec.md) | **Plan**: [plan.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/001-delf-b2-writing-practice/plan.md) | **Date**: 2026-09-21

## 1. Overview
This guide provides runnable instructions to initialize the development environment, run automated unit/contract tests, and manually verify the application workflows end-to-end.

---

## 2. Environment Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Run unit tests
npm test

# 3. Start local development server
npm run dev
```

---

## 3. Automated Validation Scenarios

### Scenario 1: French Word Counter Accuracy
- **Command**: `npm test -- src/domain/frenchWordCounter.test.ts`
- **Expected Outcome**:
  - `c'est` is counted as 2 words.
  - `l'environnement` is counted as 2 words.
  - `peut-être` is counted as 1 word (or according to DELF hyphen rule).
  - Punctuation (., « », ?) does not increment count.
  - Latency is < 1ms for a 300-word essay.

### Scenario 2: Visual Diff Calculation
- **Command**: `npm test -- src/domain/diffEngine.test.ts`
- **Expected Outcome**:
  - `diffWordsWithSpace` correctly identifies replaced phrases as `removed` tokens and new phrases as `added` tokens.
  - Unmodified sentences remain `unchanged`.
  - Whitespace and punctuation formatting are preserved.

### Scenario 3: Offline Mock Improvement Engine
- **Command**: `npm test -- src/services/mockImprovementService.test.ts`
- **Expected Outcome**:
  - Generates valid `ImprovementResult` matching `contracts/ai-improvement.contract.json`.
  - Returns at least 3 pedagogical notes categorized under official DELF B2 criteria (`sociolinguistic`, `coherence`, `grammar`, `vocabulary`).

### Scenario 4: Local Storage Persistence
- **Command**: `npm test -- src/services/storageService.test.ts`
- **Expected Outcome**:
  - Drafts are saved under `delf_b2_drafts_v1`.
  - Data reload restores the active prompt and exact text without loss.

---

## 4. Manual End-to-End Verification (Browser)

1. **Launch App**: Open `http://localhost:5173`.
2. **Prompt Selection**:
   - Verify the dropdown displays official DELF B2 prompts organized into 3 genres:
     - *Lettre formelle* (e.g. Réclamation à la mairie)
     - *Essai argumentatif* (e.g. Télétravail et équilibre de vie)
     - *Article de forum* (e.g. Écologie urbaine)
   - Click "Random Topic" and observe instantaneous prompt update with context (<100ms).
3. **Editor & Word Counter**:
   - Type French text into the left pane.
   - Observe the live word counter badge update instantaneously (<50ms).
   - Verify visual progress bar: amber/red when below 250 words, green when >= 250 words.
4. **AI Improve & Visual Diff**:
   - Click "AI Improve" (runs via built-in mock engine or Gemini API if key provided).
   - Check the right pane:
     - Original text vs. Improved B2 text.
     - Visual diff highlights removed/substandard words in red with strike-through, and B2 enhancements in emerald/blue.
     - Pedagogical notes section renders below with clear criterion badges (e.g., *Morphosyntaxe*, *Connecteurs logiques*).
5. **Autosave & Persistence**:
   - Refresh the browser (F5).
   - Verify the draft text and active topic remain intact.
