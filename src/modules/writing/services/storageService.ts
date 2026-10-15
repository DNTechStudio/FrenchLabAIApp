import type { EssayDraft, UserSettings } from '../domain/types.ts';
import { sanitizeSelectedLevels } from '../domain/cefrLevels.ts';

const STORAGE_KEY = 'delf_b2_storage_v1';

export interface StoredData {
  version: 1;
  activePromptId: string;
  drafts: Record<string, EssayDraft>;
  settings: UserSettings;
}

const DEFAULT_SETTINGS: UserSettings = {
  provider: 'mock',
  theme: 'dark',
  language: 'fr',
  selectedLevels: ['B2'],
};

const DEFAULT_STORED_DATA: StoredData = {
  version: 1,
  activePromptId: 'lettre-maire-espaces-verts',
  drafts: {},
  settings: DEFAULT_SETTINGS,
};

export class StorageService {
  private static getRawData(): StoredData {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) {
        return DEFAULT_STORED_DATA;
      }
      const parsed = JSON.parse(serialized);
      if (parsed && parsed.version === 1) {
        const rawSettings = parsed.settings || {};
        return {
          ...DEFAULT_STORED_DATA,
          ...parsed,
          settings: {
            ...DEFAULT_SETTINGS,
            ...rawSettings,
            selectedLevels: sanitizeSelectedLevels(rawSettings.selectedLevels),
          },
          drafts: parsed.drafts || {},
        };
      }
      return DEFAULT_STORED_DATA;
    } catch {
      return DEFAULT_STORED_DATA;
    }
  }

  private static setRawData(data: StoredData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }

  public static loadSession(): StoredData {
    return this.getRawData();
  }

  public static getDraft(promptId: string): EssayDraft | null {
    const data = this.getRawData();
    return data.drafts[promptId] || null;
  }

  public static saveDraft(promptId: string, content: string, wordCount: number): void {
    const data = this.getRawData();
    data.activePromptId = promptId;
    data.drafts[promptId] = {
      promptId,
      content,
      wordCount,
      lastSavedAt: Date.now(),
    };
    this.setRawData(data);
  }

  public static clearDraft(promptId: string): void {
    const data = this.getRawData();
    delete data.drafts[promptId];
    this.setRawData(data);
  }

  public static saveActivePromptId(promptId: string): void {
    const data = this.getRawData();
    data.activePromptId = promptId;
    this.setRawData(data);
  }

  public static getSettings(): UserSettings {
    return this.getRawData().settings;
  }

  public static saveSettings(settings: Partial<UserSettings>): void {
    const data = this.getRawData();
    const updatedSettings = { ...data.settings, ...settings };
    if (settings.selectedLevels !== undefined) {
      updatedSettings.selectedLevels = sanitizeSelectedLevels(settings.selectedLevels);
    }
    data.settings = updatedSettings;
    this.setRawData(data);
  }
}
