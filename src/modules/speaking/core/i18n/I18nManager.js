/**
 * I18nManager: Core Internationalization Engine for DELF-DALF Lab Speaking App
 */

import fr from './locales/fr.js';
import en from './locales/en.js';
import zh from './locales/zh.js';
import vi from './locales/vi.js';

const STORAGE_KEY = 'delf_speaking_language_pref';

export const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: 'Français', englishName: 'French', flag: '🇫🇷' },
  { code: 'en', name: 'English', englishName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', englishName: 'Chinese', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', englishName: 'Vietnamese', flag: '🇻🇳' }
];

export class I18nManager {
  constructor(storage = (typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null))) {
    this.storage = storage;
    this.dictionaries = { fr, en, zh, vi };
    this.currentLocale = this.loadSavedLocale() || 'fr';
    this.listeners = new Set();
  }

  getStorage() {
    if (this.storage) return this.storage;
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if (typeof localStorage !== 'undefined') return localStorage;
    return null;
  }

  loadSavedLocale() {
    const storage = this.getStorage();
    if (!storage) return null;
    try {
      const saved = storage.getItem(STORAGE_KEY);
      if (saved && this.dictionaries[saved]) {
        return saved;
      }
    } catch (e) {}
    return null;
  }

  getLocale() {
    return this.currentLocale;
  }

  setLocale(locale) {
    if (!this.dictionaries[locale]) {
      console.warn(`[i18n] Unsupported locale: ${locale}. Defaulting to 'fr'.`);
      locale = 'fr';
    }
    if (this.currentLocale === locale) return;

    this.currentLocale = locale;
    const storage = this.getStorage();
    if (storage) {
      try {
        storage.setItem(STORAGE_KEY, locale);
      } catch (e) {}
    }

    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentLocale);
      } catch (err) {
        console.error('[i18n] Listener error:', err);
      }
    }
  }

  /**
   * Resolves translation key by dot notation with optional param interpolation
   * Example: i18n.t('selection.words') or i18n.t('timer.count', { count: 5 })
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.resolvePath(this.dictionaries[this.currentLocale], keys);

    // Fallback to French if missing
    if (value === undefined && this.currentLocale !== 'fr') {
      value = this.resolvePath(this.dictionaries.fr, keys);
    }

    if (value === undefined) {
      return key;
    }

    if (typeof value === 'string' && Object.keys(params).length > 0) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(new RegExp(`{${k}}`, 'g'), v);
      }
    }

    return value;
  }

  resolvePath(obj, pathArray) {
    if (!obj) return undefined;
    let current = obj;
    for (const segment of pathArray) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment];
      } else {
        return undefined;
      }
    }
    return current;
  }
}

// Global Singleton
export const i18n = new I18nManager();
