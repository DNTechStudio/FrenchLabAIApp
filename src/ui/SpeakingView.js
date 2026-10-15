/**
 * Speaking View Coordinator (Pillar II - PRO-06 High-Fidelity Integration)
 * Mounts 100% of DELF-DALF Lab Speaking into #view-speaking.
 */

import { App as SpeakingApp } from '../modules/speaking/app.js';

export class SpeakingView {
  constructor({ container }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.speakingAppInstance = null;
    this.isInitialized = false;
  }

  render() {
    if (!this.container) return;

    if (this.isInitialized) return; // Prevent re-mounting and losing state

    this.container.innerHTML = `
      <div class="app-container" id="speaking-app-container">
        <!-- Header Navigation & Stepper -->
        <header class="app-header">
          <div class="brand-box">
            <div class="brand-icon">🎙️</div>
            <div>
              <div class="brand-title">DELF-DALF Lab Speaking</div>
              <div class="brand-subtitle">Simulateur d'Épreuve Orale — France Éducation international</div>
            </div>
          </div>

          <!-- Global App Mode Switcher -->
          <div id="mode-switcher-slot"></div>

          <!-- Examination Phase Stepper -->
          <nav class="stepper" aria-label="Progression de l'épreuve">
            <div id="step-select" class="step-item active">
              <span>1. Sujet</span>
            </div>
            <div class="step-divider"></div>
            <div id="step-prep" class="step-item">
              <span>2. Préparation (10m)</span>
            </div>
            <div class="step-divider"></div>
            <div id="step-mono" class="step-item">
              <span>3. Exposé Oral</span>
            </div>
            <div class="step-divider"></div>
            <div id="step-debate" class="step-item">
              <span>4. Débat</span>
            </div>
            <div class="step-divider"></div>
            <div id="step-report" class="step-item">
              <span>5. Bilan</span>
            </div>
          </nav>

          <!-- Header Utility Actions -->
          <div class="header-actions">
            <div id="language-picker-slot"></div>
            <button id="reset-exam-btn" class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: var(--text-xs);" title="Réinitialiser l'examen">
              🔄 Nouveau
            </button>
          </div>
        </header>

        <!-- Main Viewport for Speaking Phases -->
        <main id="view-viewport" class="main-content"></main>
      </div>
    `;

    try {
      this.speakingAppInstance = new SpeakingApp();
      this.speakingAppInstance.init();
      this.isInitialized = true;
    } catch (e) {
      console.error('Speaking App initialization failed:', e);
    }
  }
}
