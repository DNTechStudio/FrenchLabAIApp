/**
 * LanguagePicker: Header dropdown component for switching interface languages
 */

import { i18n, SUPPORTED_LANGUAGES } from '../../core/i18n/I18nManager.js';

export function renderLanguagePicker() {
  const container = document.createElement('div');
  container.className = 'language-picker-container';
  container.style.cssText = `
    display: inline-flex;
    align-items: center;
    position: relative;
  `;

  const currentLocale = i18n.getLocale();

  container.innerHTML = `
    <select class="language-select-dropdown" aria-label="Choisir la langue d'interface" style="
      background: rgba(17, 24, 39, 0.85);
      color: var(--text-primary);
      border: 1px solid var(--border-card);
      border-radius: var(--radius-full);
      padding: 0.35rem 0.75rem;
      font-size: var(--text-xs);
      font-weight: 600;
      cursor: pointer;
      outline: none;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    ">
      ${SUPPORTED_LANGUAGES.map(lang => `
        <option value="${lang.code}" ${lang.code === currentLocale ? 'selected' : ''}>
          ${lang.flag} ${lang.name}
        </option>
      `).join('')}
    </select>
  `;

  const select = container.querySelector('.language-select-dropdown');
  select?.addEventListener('change', (e) => {
    const newLocale = e.target.value;
    i18n.setLocale(newLocale);
  });

  return container;
}
