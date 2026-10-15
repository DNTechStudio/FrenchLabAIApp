# Technical Research & Architecture Decisions: Multilingual UI Support

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/003-language-options/spec.md) | **Branch**: `003-language-options` | **Date**: 2026-09-22

## 1. Technical Objectives & Constraints

- **Zero Heavy External Runtime Dependencies**: External i18n libraries (like `i18next` + plugins) add bundle bloat (>50 KB), asynchronous loading delays, and complexity that would break the zero-dependency requirements of the single-file distribution (`standalone.html`).
- **Instantaneous Language Switching (<50ms)**: Swapping languages must be synchronous, in-memory, and immediate without causing screen flickering, draft resets, or re-renders of the text editor.
- **Type-Safe Dictionary Architecture**: Using TypeScript key mappings ensures compile-time detection of missing translation keys across all 4 languages (French, English, Chinese, Vietnamese).
- **100% Offline Distribution Parity**: The exact same dictionary tokens and language switcher must function natively in [`standalone.html`](file:///f:/My%20Drive/%2803%29%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/%2801%29%20Projects/TEC-2026-07%20PRO-05%20Writing%20DELF%20B2%20Application/WritingDELFB2/standalone.html).

---

## 2. Options Considered

### Option A: External i18n Library (`react-i18next` / `formatjs`)
- **Pros**: Established ecosystem, pluralization rules, translation file extraction tooling.
- **Cons**: 
  - Substantial bundle size increase.
  - Requires asynchronous HTTP loading or custom build configuration.
  - Incompatible with `standalone.html`'s zero-dependency script-tag architecture.
- **Verdict**: **Rejected**.

### Option B: Lightweight Typed Dictionary & Context/Prop System (Recommended)
- **Pros**:
  - Pure TypeScript/JavaScript objects with 0 external dependencies.
  - Instantaneous in-memory lookup (`t.header.settings`).
  - Total compile-time guarantee: TypeScript checks that `en`, `zh`, and `vi` dictionaries contain every single key present in `fr`.
  - Seamlessly embeddable in `standalone.html`.
  - Total memory footprint < 15 KB.
- **Verdict**: **Accepted**.

---

## 3. Language Codes & Metadata

```typescript
export type SupportedLanguage = 'fr' | 'en' | 'zh' | 'vi';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;        // Native display name
  shortLabel: string;  // Compact label for mobile
  flag: string;        // Emoji / visual icon
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', shortLabel: 'FR', flag: '🇫🇷' },
  { code: 'en', name: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'zh', name: '中文', shortLabel: 'ZH', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', shortLabel: 'VI', flag: '🇻🇳' }
];
```

---

## 4. UI Placement & Responsiveness

- **Header Placement**: Positioned in `.header-actions` right next to the "Buy Me a Coffee" button and theme toggle.
- **Compact Mobile Mode (<=768px)**: Displays flag + short code (`🇫🇷 FR`, `🇬🇧 EN`, `🇨🇳 ZH`, `🇻🇳 VI`) within a clean pill selector, preventing header line wrapping.
- **Synchronization**: The language selector is also mirrored inside `SettingsModal.tsx` for unified configuration.
