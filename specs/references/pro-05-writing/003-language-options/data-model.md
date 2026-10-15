# Data Model & Translation Schema: Multilingual Support

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/003-language-options/spec.md) | **Branch**: `003-language-options` | **Date**: 2026-09-22

## 1. Domain Types

### Language & Option Types (`src/domain/translations.ts`)
```typescript
export type SupportedLanguage = 'fr' | 'en' | 'zh' | 'vi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  shortLabel: string;
  flag: string;
}
```

### Translation Dictionary Schema
```typescript
export interface AppTranslations {
  brand: {
    title: string;
    badge: string;
  };
  header: {
    engine: string;
    themeLight: string;
    themeDark: string;
    settings: string;
    coffeeLabel: string;
    coffeeTitle: string;
  };
  editor: {
    paneTitle: string;
    clearButton: string;
    clearConfirm: string;
    randomTopicButton: string;
    selectPromptPrompt: string;
    inputPlaceholder: string;
    targetLabel: string;
    wordsCount: string;
    statusUnder: string;
    statusNearing: string;
    statusAchieved: string;
    wordRequirementBadge: string;
  };
  categories: {
    lettre_formelle: string;
    essai_argumentatif: string;
    article_forum: string;
  };
  comparison: {
    paneTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    tabUnified: string;
    tabOriginal: string;
    tabImproved: string;
    filterAll: string;
    overallFeedbackTitle: string;
    pedagogicalNotesTitle: string;
    copyButton: string;
    copiedButton: string;
    improveButton: string;
    analyzingButton: string;
    diffLegendRemoved: string;
    diffLegendAdded: string;
  };
  criteria: {
    sociolinguistic: string;
    coherence: string;
    grammar: string;
    vocabulary: string;
  };
  settings: {
    title: string;
    description: string;
    languageLabel: string;
    providerLabel: string;
    mockProvider: string;
    geminiProvider: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    saveButton: string;
    closeButton: string;
  };
}
```

---

## 2. UserSettings Schema Extension

`UserSettings` in `src/domain/types.ts`:
```typescript
export interface UserSettings {
  provider: AiProvider;
  apiKey?: string;
  theme: 'dark' | 'light';
  language?: SupportedLanguage; // Added field (defaults to 'fr')
}
```

---

## 3. Storage Persistence

Saved within existing key `delf_b2_storage_v1`:
```json
{
  "activePromptId": "lettre-maire-espaces-verts",
  "drafts": {},
  "settings": {
    "provider": "mock",
    "theme": "dark",
    "language": "en"
  }
}
```
If `settings.language` is undefined or unrecognized, it falls back safely to `'fr'`.
