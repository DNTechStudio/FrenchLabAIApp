/**
 * PreparationView: 10-minute countdown preparation phase with document reader and digital scratchpad
 */

import { ExamTimer } from '../../core/timer/ExamTimer.js';
import { renderDocumentCard } from '../components/DocumentCard.js';
import { ScratchpadDrawer } from '../components/ScratchpadDrawer.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class PreparationView {
  constructor({ session, onUpdateScratchpad, onConcludePreparation }) {
    this.session = session;
    this.onUpdateScratchpad = onUpdateScratchpad;
    this.onConcludePreparation = onConcludePreparation;
    this.timer = null;
  }

  render() {
    const view = document.createElement('div');
    view.className = 'view-container';

    view.innerHTML = `
      <!-- Preparation Header & Timer Controls -->
      <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding: 1.25rem 1.5rem;">
        <div>
          <span class="badge badge-warning" style="margin-bottom: 0.25rem;">${i18n.t('prep.badge')}</span>
          <h2 style="font-size: var(--text-xl);">${i18n.t('prep.title')}</h2>
        </div>

        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div class="timer-container" style="padding: 0.5rem 1.25rem;">
            <span class="timer-clock prep-countdown-text">10:00</span>
            <span class="timer-label">${i18n.t('prep.time_remaining')}</span>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary pause-timer-btn" title="${i18n.t('prep.pause')} / ${i18n.t('prep.resume')}">${i18n.t('prep.pause')}</button>
            <button class="btn btn-secondary add-time-btn" title="${i18n.t('prep.add_time')}">${i18n.t('prep.add_time')}</button>
            <button class="btn btn-primary finish-prep-btn">
              ${i18n.t('prep.finish_btn')}
            </button>
          </div>
        </div>
      </div>

      <!-- Split Layout: Document & Scratchpad -->
      <div class="prep-split-layout">
        <!-- Left: Document Reader -->
        <div class="document-pane" style="display: flex; flex-direction: column;">
          <!-- Injected document card -->
        </div>

        <!-- Right: Digital Scratchpad -->
        <div class="scratchpad-pane" style="display: flex; flex-direction: column;">
          <!-- Injected scratchpad -->
        </div>
      </div>
    `;

    // Render Document Card
    const docPane = view.querySelector('.document-pane');
    if (docPane && this.session.triggerDocument) {
      docPane.appendChild(renderDocumentCard(this.session.triggerDocument));
    }

    // Render Scratchpad
    const scratchpadPane = view.querySelector('.scratchpad-pane');
    if (scratchpadPane) {
      const scratchpad = new ScratchpadDrawer(this.session.scratchpad || {}, {
        onUpdate: (data) => this.onUpdateScratchpad(data)
      });
      scratchpadPane.appendChild(scratchpad.render());
    }

    // Setup 10-Minute ExamTimer
    const countdownText = view.querySelector('.prep-countdown-text');
    const pauseBtn = view.querySelector('.pause-timer-btn');

    this.timer = new ExamTimer({
      mode: 'countdown',
      initialSeconds: 600,
      onTick: (_, formatted) => {
        if (countdownText) countdownText.textContent = formatted;
      },
      onComplete: () => {
        alert(i18n.t('prep.finish_btn'));
        this.onConcludePreparation();
      }
    });

    this.timer.start();

    pauseBtn?.addEventListener('click', () => {
      if (this.timer.isRunning) {
        this.timer.pause();
        pauseBtn.textContent = i18n.t('prep.resume');
      } else {
        this.timer.resume();
        pauseBtn.textContent = i18n.t('prep.pause');
      }
    });

    view.querySelector('.add-time-btn')?.addEventListener('click', () => {
      this.timer.adjustTime(60);
    });

    view.querySelector('.finish-prep-btn')?.addEventListener('click', () => {
      this.timer.stop();
      this.onConcludePreparation();
    });

    return view;
  }

  destroy() {
    if (this.timer) {
      this.timer.stop();
    }
  }
}
