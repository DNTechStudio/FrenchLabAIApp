# Data Model & Configuration: Buy Me a Coffee Support Button

**Feature**: [spec.md]((03)%20Area%20Techs/TEC-2026-07%20Spec-kit%20AI/(01)%20Projects/TEC-2026-07%20PRO-05%20DELF-DALF%20Lab%20Writing/DELF-DALF%20Lab%20Writing%20Application/specs/002-buy-me-a-coffee/spec.md) | **Branch**: `002-buy-me-a-coffee` | **Date**: 2026-09-22

## 1. Entities & Configuration

### SupportConfig Interface
Defines the configurable parameters for the donation / creator support button.

```typescript
export interface SupportConfig {
  /** The destination URL for the donation page (e.g. Buy Me a Coffee / Ko-fi) */
  url: string;
  /** Primary label displayed on desktop screens */
  label: string;
  /** Full descriptive accessibility label and title */
  ariaLabel: string;
  /** Whether the button is visible */
  enabled: boolean;
}
```

### Default Constants (`src/domain/constants.ts`)

```typescript
export const DEFAULT_SUPPORT_CONFIG: SupportConfig = {
  url: 'https://buymeacoffee.com/writingdelfb2',
  label: 'Offrez-moi un café',
  ariaLabel: 'Offrez-moi un café — Soutenir le projet Writing DELF B2',
  enabled: true,
};
```

---

## 2. Component State & Props

### HeaderProps (`src/components/Header.tsx`)
Updated to accept optional `supportConfig`:

```typescript
interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  activeProvider: string;
  supportConfig?: SupportConfig;
}
```

If not explicitly passed via props, `Header` automatically falls back to `DEFAULT_SUPPORT_CONFIG`.

---

## 3. Storage Schema Impact

No breaking schema migrations are required in `localStorage`. The default configuration is a constant, with future extensibility to allow users or self-hosters to override the URL in `UserSettings` if needed.
