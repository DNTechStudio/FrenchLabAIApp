# Data Model: 005 — AI Model Essay Generation on Empty Input

**Feature**: `005-ai-model-essay-generation`  
**Date**: 2026-09-25  

---

## 1. Domain Entities & Interfaces

### A. Extended Improvement Service Signature
```typescript
import { ExamPrompt, CEFRLevel, ImprovementResult } from './types';

export interface ImprovementRequest {
  prompt: ExamPrompt;
  originalText: string;
  targetLevel: CEFRLevel;
  isAutonomous: boolean; // true when originalText.trim().length === 0
}

export interface IImprovementService {
  improveEssay(
    prompt: ExamPrompt,
    text: string,
    level?: CEFRLevel,
    isAutonomous?: boolean
  ): Promise<ImprovementResult>;
}
```

### B. Result Schema (100% Backward Compatible)
```typescript
export interface ImprovementResult {
  improvedText: string;              // Model essay or corrected draft
  diffTokens: DiffToken[];           // Visual diff or model tokens
  pedagogicalNotes: PedagogicalNote[];// Criterion-specific notes
  overallFeedback: string;           // Examiner summary
}

export interface DiffToken {
  type: 'unchanged' | 'added' | 'removed';
  value: string;
}

export interface PedagogicalNote {
  id: string;
  criterion: 'sociolinguistic' | 'coherence' | 'grammar' | 'vocabulary';
  title: string;
  explanation: string;
}
```

### C. State Mapping in UI
```typescript
// Comparison window view modes
export type ViewMode = 'diff' | 'clean';

// Map of view modes per CEFR level
export type LevelViewModeMap = Partial<Record<CEFRLevel, ViewMode>>;

// When isAutonomous is true:
// initial viewMode for the generated window defaults to 'clean'
```

---

## 2. Storage & Persistence
- When an autonomous model essay is generated on an empty draft, it does not overwrite the user's saved draft in `localStorage` unless the user explicitly copies it or chooses to use it as their draft.
- The user's active editor draft remains cleanly separated from the AI model essay windows.
