/**
 * SpeechSpeedController: Interactive segmented pill buttons to adjust TTS playback velocity
 */

import { SPEED_PRESETS, getSavedSpeed, saveSpeed } from '../../core/speech/voicePresets.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class SpeechSpeedController {
  constructor({ currentSpeed = null, onSpeedChange = () => {} } = {}) {
    this.currentSpeed = currentSpeed ?? getSavedSpeed(1.0);
    this.onSpeedChange = onSpeedChange;
    this.container = null;
  }

  getSpeed() {
    return this.currentSpeed;
  }

  setSpeed(speed) {
    if (typeof speed !== 'number' || isNaN(speed)) return;
    this.currentSpeed = speed;
    saveSpeed(speed);
    this.onSpeedChange(this.currentSpeed);
    this.updateActiveBtn();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'speech-speed-group';
    this.container.setAttribute('role', 'group');
    this.container.setAttribute('aria-label', i18n.t('practice.speed_label') || 'Vitesse de lecture');

    this.container.innerHTML = SPEED_PRESETS.map(preset => {
      const isActive = Math.abs(preset.value - this.currentSpeed) < 0.01;
      const label = i18n.t(preset.labelKey) || preset.defaultLabel;
      return `
        <button 
          type="button" 
          class="speech-speed-btn ${isActive ? 'active' : ''}" 
          data-speed="${preset.value}" 
          title="${label} (${preset.targetAudience})"
          aria-pressed="${isActive}"
        >
          ${preset.badge}
        </button>
      `;
    }).join('');

    this.container.querySelectorAll('.speech-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.dataset.speed);
        this.setSpeed(val);
      });
    });

    return this.container;
  }

  updateActiveBtn() {
    if (!this.container) return;
    this.container.querySelectorAll('.speech-speed-btn').forEach(btn => {
      const val = parseFloat(btn.dataset.speed);
      const isActive = Math.abs(val - this.currentSpeed) < 0.01;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }
}
