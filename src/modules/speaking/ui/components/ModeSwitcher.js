/**
 * ModeSwitcher: Header segmented control for toggling between Exam Mode and Practice Mode
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export const APP_MODES = {
  TEST: 'test',
  PRACTICE: 'practice',
  CONVERSATION: 'conversation'
};

const MODE_STORAGE_KEY = 'delf_speaking_active_mode';

export function getActiveMode() {
  try {
    const storage = typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
    if (storage) {
      const saved = storage.getItem(MODE_STORAGE_KEY);
      if (saved === APP_MODES.TEST || saved === APP_MODES.PRACTICE || saved === APP_MODES.CONVERSATION) {
        return saved;
      }
    }
  } catch (e) {}
  return APP_MODES.TEST;
}

export function setActiveMode(mode) {
  if (mode !== APP_MODES.TEST && mode !== APP_MODES.PRACTICE && mode !== APP_MODES.CONVERSATION) return;
  try {
    const storage = typeof window !== 'undefined' ? window.localStorage : (typeof localStorage !== 'undefined' ? localStorage : null);
    if (storage) {
      storage.setItem(MODE_STORAGE_KEY, mode);
    }
  } catch (e) {}
}

export function renderModeSwitcher({ onModeChange }) {
  const container = document.createElement('div');
  container.className = 'mode-switcher-container';

  const currentMode = getActiveMode();

  container.innerHTML = `
    <button class="mode-btn ${currentMode === APP_MODES.PRACTICE ? 'active' : ''}" data-mode="${APP_MODES.PRACTICE}" title="Entraînement libre et élévation IA multi-niveaux">
      🎙️ <span class="mode-label">${i18n.t('mode.practice') || 'Mode Entraînement'}</span>
    </button>
    <button class="mode-btn ${currentMode === APP_MODES.TEST ? 'active' : ''}" data-mode="${APP_MODES.TEST}" title="Simulateur officiel d'épreuve orale DELF B2">
      🎓 <span class="mode-label">${i18n.t('mode.test') || 'Mode Examen'}</span>
    </button>
    <button class="mode-btn ${currentMode === APP_MODES.CONVERSATION ? 'active' : ''}" data-mode="${APP_MODES.CONVERSATION}" title="Simulation de dialogues interactifs en situations réelles">
      💬 <span class="mode-label">${i18n.t('mode.conversation') || 'Mode Conversation'}</span>
    </button>
  `;

  const buttons = container.querySelectorAll('.mode-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMode = btn.dataset.mode;
      if (targetMode === getActiveMode()) return;

      setActiveMode(targetMode);
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (typeof onModeChange === 'function') {
        onModeChange(targetMode);
      }
    });
  });

  return container;
}
