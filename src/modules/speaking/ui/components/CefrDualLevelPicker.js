/**
 * CefrDualLevelPicker: Interactive selector enforcing selection of exactly 2 CEFR levels (A1 to C2)
 */

import { CEFR_LEVELS, CEFR_METADATA } from '../../core/practice/CefrLevelDefinitions.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class CefrDualLevelPicker {
  constructor({ initialLevels = ['B1', 'B2'], onChange = () => {} } = {}) {
    this.selectedLevels = [...initialLevels].slice(0, 2);
    this.onChange = onChange;
    this.container = null;
  }

  getSelectedLevels() {
    return [...this.selectedLevels];
  }

  isValid() {
    return this.selectedLevels.length >= 1 && this.selectedLevels.length <= 2;
  }

  toggleLevel(level) {
    if (!CEFR_LEVELS.includes(level)) return;

    if (this.selectedLevels.includes(level)) {
      this.selectedLevels = this.selectedLevels.filter(l => l !== level);
    } else {
      if (this.selectedLevels.length >= 2) {
        this.selectedLevels.shift(); // Remove oldest to maintain max 2
      }
      this.selectedLevels.push(level);
    }

    this.onChange(this.getSelectedLevels());
    this.updateDOM();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'glass-panel cefr-picker-card';
    this.updateDOM();
    return this.container;
  }

  updateDOM() {
    if (!this.container) return;

    const count = this.selectedLevels.length;
    const isReady = this.isValid();

    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h3 style="font-size: var(--text-base); margin-bottom: 0.15rem; display: flex; align-items: center; gap: 0.5rem;">
            🎯 ${i18n.t('practice.choose_levels_title') || 'Choisissez vos niveaux cibles (maximum 2)'}
          </h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            ${i18n.t('practice.choose_levels_desc') || 'L’IA réécrira et élèvera votre texte oral selon le ou les paliers CEFR choisis (1 ou 2 au choix) :'}
          </p>
        </div>

        <span class="badge ${isReady ? 'badge-primary' : 'badge-warning'}" style="font-size: var(--text-xs); padding: 0.25rem 0.65rem;">
          ${count}/2 ${i18n.t('practice.levels_selected') || 'sélectionné(s)'} (max 2) ${isReady ? '✓' : ''}
        </span>
      </div>

      <div class="cefr-pills-row" role="group" aria-label="Sélection des niveaux CEFR">
        ${CEFR_LEVELS.map(lvl => {
          const isSelected = this.selectedLevels.includes(lvl);
          const meta = CEFR_METADATA[lvl];
          return `
            <button type="button" class="cefr-pill ${isSelected ? 'selected' : ''}" data-level="${lvl}" aria-pressed="${isSelected}">
              <span class="cefr-pill-code">${lvl}</span>
              <span class="cefr-pill-desc">${meta.name.split(' ')[0]}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;

    const buttons = this.container.querySelectorAll('.cefr-pill');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleLevel(btn.dataset.level);
      });
    });
  }
}
