# Data Model & Contracts: CEFR Level Multi-Comparison (A1-C2)

**Feature**: `004-cefr-level-comparison` | **Date**: 2026-09-24

---

## 1. Domain Entities & Types

### 1.1 `CEFRLevel` Type & Constants
```typescript
// src/domain/types.ts

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const ALL_CEFR_LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const DEFAULT_CEFR_LEVELS: CEFRLevel[] = ['B2'];

export interface CEFRLevelInfo {
  level: CEFRLevel;
  code: string;            // e.g. "B2"
  shortName: Record<SupportedLanguage, string>; // e.g. { fr: "Avancé", en: "Upper Intermediate", zh: "中高级", vi: "Trung cấp nâng cao" }
  description: Record<SupportedLanguage, string>;
  color: string;           // CSS color token, e.g. "var(--color-level-b2)"
  badgeBg: string;         // Light background for badge
}
```

### 1.2 `ImprovementRequest` Updates
```typescript
// src/domain/types.ts

export interface ImprovementRequest {
  promptId: string;
  promptTitle: string;
  promptScenario: string;
  promptInstructions: string;
  essayContent: string;
  targetLevel?: CEFRLevel;     // Target level for single execution
}
```

### 1.3 `MultiLevelImprovementResult`
```typescript
// src/domain/types.ts

export type MultiLevelResultMap = Partial<Record<CEFRLevel, ImprovementResult>>;

export interface ImprovementResult {
  originalText: string;
  improvedText: string;
  diffTokens: DiffToken[];
  pedagogicalNotes: PedagogicalNote[];
  criteriaScores: CriteriaScore[];
  summary: string;
  targetLevel?: CEFRLevel;     // Identified level of this result
}
```

### 1.4 `UserSettings` Extension
```typescript
// src/domain/types.ts

export interface UserSettings {
  apiKey?: string;
  provider: 'gemini' | 'mock';
  model?: string;
  theme?: 'dark' | 'light';
  language?: SupportedLanguage;
  selectedLevels?: CEFRLevel[]; // Array of 1 or 2 levels, default: ['B2']
}
```

---

## 2. Storage Schema

Stored under `localStorage` key `delf_b2_settings`:

```json
{
  "theme": "dark",
  "provider": "mock",
  "language": "fr",
  "selectedLevels": ["B1", "C1"]
}
```

### Validation & Fallback Rules:
- If `selectedLevels` is missing, empty, or corrupted, fallback to `['B2']`.
- If `selectedLevels.length > 2`, slice to the first 2 valid items `selectedLevels.slice(0, 2)`.
- If an item is not in `['A1', 'A2', 'B1', 'B2', 'C1', 'C2']`, filter it out.

---

## 3. UI Component Contracts

### 3.1 `CEFRLevelSelector` Component
```typescript
// src/components/CEFRLevelSelector.tsx

export interface CEFRLevelSelectorProps {
  selectedLevels: CEFRLevel[];
  onToggleLevel: (level: CEFRLevel) => void;
  disabled?: boolean;
  translations: AppTranslations;
  currentLanguage: SupportedLanguage;
}
```

### 3.2 `ComparisonWindow` Sub-Component
```typescript
// src/components/ComparisonWindow.tsx

export interface ComparisonWindowProps {
  level: CEFRLevel;
  result: ImprovementResult | null;
  isLoading: boolean;
  onCopy: (text: string) => void;
  hasCopied: boolean;
  translations: AppTranslations;
  currentLanguage: SupportedLanguage;
}
```

### 3.3 `ComparisonPane` (Multi-Window Container)
```typescript
// src/components/ComparisonPane.tsx

export interface ComparisonPaneProps {
  selectedLevels: CEFRLevel[];
  results: MultiLevelResultMap;
  loadingLevels: Set<CEFRLevel>;
  translations: AppTranslations;
  currentLanguage: SupportedLanguage;
}
```

---

## 4. Internationalization Schema Additions

Add level metadata to `AppTranslations` in `src/domain/translations.ts`:

```typescript
export interface AppTranslations {
  // Existing keys...
  cefrLevels: {
    selectorTitle: string;        // "Niveaux CECRL à comparer :" / "CEFR Levels to compare:"
    selectorHint: string;         // "Sélectionnez 1 ou 2 niveaux" / "Select 1 or 2 levels"
    maxSelectionNotice: string;   // "Maximum 2 niveaux sélectionnés" / "Maximum 2 levels selected"
    minSelectionNotice: string;   // "Au moins 1 niveau requis" / "At least 1 level required"
    levelNames: Record<CEFRLevel, string>;
    levelDescriptions: Record<CEFRLevel, string>;
  };
}
```
