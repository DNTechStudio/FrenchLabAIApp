/**
 * Sidebar View Component (TEC-2026-07 PRO-07)
 * Implements the user's wireframe layout.
 */

import { StorageManager } from '../core/storage/storage.js';

export class SidebarView {
  constructor({ container, router }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.router = router;
    this.currentLevel = StorageManager.getPreferences().cefrLevel || 'B2';
    this.currentLocale = StorageManager.getPreferences().locale || 'fr';
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="sidebar-brand">
        <div class="brand-icon">🇫🇷</div>
        <div class="brand-title">French Lab AI</div>
      </div>

      <nav class="sidebar-nav" aria-label="Navigation principale">
        <div class="nav-item" data-view="speaking" id="nav-speaking">
          <span class="nav-bullet"></span>
          <span class="nav-label">DELF-DALF Speaking</span>
        </div>
        <div class="nav-item" data-view="writing" id="nav-writing">
          <span class="nav-bullet"></span>
          <span class="nav-label">DELF-DALF Writing</span>
        </div>
        <div class="nav-item" data-view="dictation" id="nav-dictation">
          <span class="nav-bullet"></span>
          <span class="nav-label">Dictation</span>
        </div>
        <div class="nav-item" data-view="conversation" id="nav-conversation">
          <span class="nav-bullet"></span>
          <span class="nav-label">Daily Conversation</span>
        </div>
        <div class="nav-item" data-view="debate" id="nav-debate">
          <span class="nav-bullet"></span>
          <span class="nav-label">Debate</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="footer-controls-row">
          <select id="cefr-level-select" class="select-control" title="Sélectionner le niveau CECRL">
            <option value="A1" ${this.currentLevel === 'A1' ? 'selected' : ''}>Niveau A1</option>
            <option value="A2" ${this.currentLevel === 'A2' ? 'selected' : ''}>Niveau A2</option>
            <option value="B1" ${this.currentLevel === 'B1' ? 'selected' : ''}>Niveau B1</option>
            <option value="B2" ${this.currentLevel === 'B2' ? 'selected' : ''}>Niveau B2</option>
            <option value="C1" ${this.currentLevel === 'C1' ? 'selected' : ''}>Niveau C1</option>
            <option value="C2" ${this.currentLevel === 'C2' ? 'selected' : ''}>Niveau C2</option>
          </select>
          <select id="language-select" class="select-control" title="Langue de l'interface">
            <option value="fr" ${this.currentLocale === 'fr' ? 'selected' : ''}>🇫🇷 FR</option>
            <option value="vi" ${this.currentLocale === 'vi' ? 'selected' : ''}>🇻🇳 VI</option>
            <option value="en" ${this.currentLocale === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
            <option value="zh" ${this.currentLocale === 'zh' ? 'selected' : ''}>🇨🇳 ZH</option>
          </select>
        </div>
        <button id="btn-export-backup" class="btn-export-backup" title="Sauvegarder et exporter les données locales">
          <span>💾 Exporter Sauvegarde</span>
        </button>
      </div>
    `;

    this.bindEvents();
    this.updateActiveItem(this.router.getCurrentView());
  }

  bindEvents() {
    const navItems = this.container.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewKey = item.getAttribute('data-view');
        if (viewKey) {
          this.router.navigate(viewKey);
          this.updateActiveItem(viewKey);
        }
      });
    });

    const levelSelect = this.container.querySelector('#cefr-level-select');
    if (levelSelect) {
      levelSelect.addEventListener('change', (e) => {
        this.currentLevel = e.target.value;
        StorageManager.savePreferences({ cefrLevel: this.currentLevel });
        window.dispatchEvent(new CustomEvent('frenchlab:level-changed', { detail: { level: this.currentLevel } }));
      });
    }

    const langSelect = this.container.querySelector('#language-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.currentLocale = e.target.value;
        StorageManager.savePreferences({ locale: this.currentLocale });
        window.dispatchEvent(new CustomEvent('frenchlab:locale-changed', { detail: { locale: this.currentLocale } }));
      });
    }

    const exportBtn = this.container.querySelector('#btn-export-backup');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        StorageManager.exportBackupJSON();
      });
    }
  }

  updateActiveItem(activeViewKey) {
    const navItems = this.container.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-view') === activeViewKey) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}
