# Data Model: Multilingual Support & Pedagogical Scaffolding

**Feature**: `002-multilingual-support` | **Date**: 2026-09-28

---

## 1. Entities

### `SupportedLocale`
Enum representing supported language codes:
```typescript
type SupportedLocale = 'fr' | 'en' | 'zh' | 'vi';
```

### `LanguageMetadata`
```typescript
interface LanguageMetadata {
  code: SupportedLocale;
  name: string;        // e.g. "Tiếng Việt"
  englishName: string; // e.g. "Vietnamese"
  flag: string;        // e.g. "🇻🇳"
}
```

### `TranslationBundle`
Key-value nested dictionary containing localized UI labels:
- `header`: Brand titles, language picker, reset button.
- `stepper`: Steps 1–5 names and status tooltips.
- `selection`: Topic catalog, filters, random draw button.
- `prep`: 10-minute timer labels, scratchpad tab titles, placeholder guidance.
- `monologue`: Speaking window status, waveform status, record/stop buttons.
- `debate`: Turn counter, examiner listening/speaking badge, caption toggles.
- `report`: Rubric headers, pass/fail labels, export button.
- `pedagogy`: Multilingual grammar explanations, connector translations, action plan steps.
