/**
 * Sovereign Storage Manager for French Lab AI Super-App (TEC-2026-07 PRO-07)
 * Handles LocalStorage persistence, autosave, and JSON backup/restore.
 */

const STORAGE_KEYS = {
  PREFERENCES: 'frenchlab_preferences',
  WRITING_DRAFT: 'frenchlab_writing_draft_',
  WRITING_HISTORY: 'frenchlab_writing_history',
  SPEAKING_HISTORY: 'frenchlab_speaking_history',
  CONVERSATION_HISTORY: 'frenchlab_conversation_history',
  DEBATE_HISTORY: 'frenchlab_debate_history',
  CUSTOM_SCENARIOS: 'frenchlab_custom_scenarios'
};

export class StorageManager {
  static getPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {
        activeModule: 'speaking',
        cefrLevel: 'B2',
        locale: 'fr',
        ttsSpeed: 1.0
      };
    } catch {
      return { activeModule: 'speaking', cefrLevel: 'B2', locale: 'fr', ttsSpeed: 1.0 };
    }
  }

  static savePreferences(prefs) {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  static saveWritingDraft(promptId, text) {
    try {
      if (!promptId) return;
      localStorage.setItem(`${STORAGE_KEYS.WRITING_DRAFT}${promptId}`, text || '');
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  }

  static getWritingDraft(promptId) {
    try {
      if (!promptId) return '';
      return localStorage.getItem(`${STORAGE_KEYS.WRITING_DRAFT}${promptId}`) || '';
    } catch {
      return '';
    }
  }

  static exportBackupJSON() {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      preferences: this.getPreferences(),
      data: {}
    };

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('frenchlab_')) {
          backup.data[key] = localStorage.getItem(key);
        }
      }

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `french-lab-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export backup failed:', e);
    }
  }
}
