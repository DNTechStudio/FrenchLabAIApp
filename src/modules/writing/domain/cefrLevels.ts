export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const ALL_CEFR_LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const DEFAULT_CEFR_LEVELS: CEFRLevel[] = ['B2'];

export interface CEFRLevelInfo {
  level: CEFRLevel;
  code: string;
  color: string;
  borderActive: string;
  badgeBg: string;
  badgeText: string;
}

export const CEFR_LEVEL_METADATA: Record<CEFRLevel, CEFRLevelInfo> = {
  A1: {
    level: 'A1',
    code: 'A1',
    color: '#10b981',       // Emerald
    borderActive: '#059669',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#10b981',
  },
  A2: {
    level: 'A2',
    code: 'A2',
    color: '#06b6d4',       // Cyan
    borderActive: '#0891b2',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeText: '#06b6d4',
  },
  B1: {
    level: 'B1',
    code: 'B1',
    color: '#3b82f6',       // Blue
    borderActive: '#2563eb',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeText: '#3b82f6',
  },
  B2: {
    level: 'B2',
    code: 'B2',
    color: '#8b5cf6',       // Violet (DELF B2 target)
    borderActive: '#7c3aed',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeText: '#8b5cf6',
  },
  C1: {
    level: 'C1',
    code: 'C1',
    color: '#ec4899',       // Pink / Rose
    borderActive: '#db2777',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    badgeText: '#ec4899',
  },
  C2: {
    level: 'C2',
    code: 'C2',
    color: '#f59e0b',       // Amber / Gold
    borderActive: '#d97706',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeText: '#f59e0b',
  },
};

export function isValidCEFRLevel(val: unknown): val is CEFRLevel {
  return typeof val === 'string' && (ALL_CEFR_LEVELS as readonly string[]).includes(val);
}

/**
 * Sanitizes an array of CEFR levels, ensuring between 1 and 2 valid unique levels.
 * Falls back to ['B2'] if empty, invalid, or corrupted.
 */
export function sanitizeSelectedLevels(input: unknown): CEFRLevel[] {
  if (!Array.isArray(input)) {
    return [...DEFAULT_CEFR_LEVELS];
  }

  const valid = input.filter(isValidCEFRLevel);
  const unique = Array.from(new Set(valid));

  if (unique.length === 0) {
    return [...DEFAULT_CEFR_LEVELS];
  }

  return unique.slice(0, 2);
}
