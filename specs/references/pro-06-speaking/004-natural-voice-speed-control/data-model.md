# Data Model & State Contracts: Natural Voice & Speed Control

**Feature**: `004-natural-voice-speed-control` | **Date**: 2026-09-28

---

## 1. Speed Preset Data Model

```typescript
export interface SpeedOption {
  value: number;            // e.g. 0.75, 0.90, 1.00, 1.20
  labelKey: string;         // i18n translation key
  defaultLabel: string;     // fallback label
  badge: string;            // UI display badge (e.g. "0.75x", "1.0x")
  targetAudience: string;   // e.g. "A1-B1", "B2-C1"
}

export const SPEED_PRESETS: SpeedOption[] = [
  { value: 0.75, labelKey: 'practice.speed_slow', defaultLabel: '0.75x (Lent)', badge: '0.75x', targetAudience: 'A1-B1' },
  { value: 0.90, labelKey: 'practice.speed_moderate', defaultLabel: '0.9x (Modéré)', badge: '0.9x', targetAudience: 'B1-B2' },
  { value: 1.00, labelKey: 'practice.speed_normal', defaultLabel: '1.0x (Normal)', badge: '1.0x', targetAudience: 'B2-C1' },
  { value: 1.20, labelKey: 'practice.speed_fast', defaultLabel: '1.2x (Rapide)', badge: '1.2x', targetAudience: 'C1-C2' }
];
```

---

## 2. Voice Descriptor Data Model

```typescript
export interface VoiceDescriptor {
  name: string;             // Display name (e.g. "Microsoft Denise Online (Natural)")
  voiceURI: string;         // Unique browser URI
  lang: string;             // Language code (e.g. "fr-FR")
  qualityTier: number;      // 1 (Neural/Natural), 2 (Platform Enhanced), 3 (Standard)
  isDefault: boolean;       // True if top ranked
  gender?: 'female' | 'male' | 'neutral';
}
```

---

## 3. Client Storage Schema (`localStorage`)

| Storage Key | Type | Default Value | Description |
|---|---|---|---|
| `delf_speaking_tts_speed` | `number` | `1.0` | Global playback speed rate preference |
| `delf_speaking_tts_voice_uri` | `string` | `""` | User-selected voice URI preference |

---

## 4. VoiceSynthesizer Configuration Contract

```typescript
export interface SpeakOptions {
  text: string;
  rate?: number;            // Explicit rate (overrides default, clamped between 0.5 and 2.0)
  pitch?: number;           // Pitch multiplier (default: 1.0)
  voiceURI?: string;        // Specific voice URI override
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}
```
