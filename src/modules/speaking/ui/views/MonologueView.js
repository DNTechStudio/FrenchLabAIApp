/**
 * MonologueView: Live oral presentation with real-time waveform visualizer, speaking timer, and i18n
 */

import { ExamTimer } from '../../core/timer/ExamTimer.js';
import { WaveformVisualizer } from '../../core/audio/WaveformVisualizer.js';
import { showMicPermissionModal } from '../components/MicPermissionModal.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class MonologueView {
  constructor({ session, audioRecorder, speechRecognizer, audioStore, onFinishMonologue }) {
    this.session = session;
    this.audioRecorder = audioRecorder;
    this.speechRecognizer = speechRecognizer;
    this.audioStore = audioStore;
    this.onFinishMonologue = onFinishMonologue;
    this.timer = null;
    this.visualizer = null;
    this.recordedResult = null;
  }

  render() {
    const view = document.createElement('div');
    view.className = 'view-container';

    view.innerHTML = `
      <!-- Monologue Header -->
      <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary">${i18n.t('monologue.badge')}</span>
          <h2 style="font-size: var(--text-xl); margin-top: 0.25rem;">${i18n.t('monologue.title')}</h2>
          <div style="font-size: var(--text-xs); color: var(--text-muted);">
            ${i18n.t('monologue.subject_prefix')} « ${this.session.triggerDocument?.title || 'Sujet sélectionné'} »
          </div>
        </div>

        <!-- Speaking Window Status -->
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="timer-container" style="padding: 0.5rem 1.25rem;">
            <span class="timer-clock speaking-timer-text">00:00</span>
            <span class="timer-label speaking-status-badge">${i18n.t('monologue.ready_status')}</span>
          </div>
        </div>
      </div>

      <!-- Center Console: Waveform & Live Transcription -->
      <div class="monologue-console">
        <!-- Waveform Card -->
        <div class="waveform-container">
          <canvas class="waveform-canvas" width="700" height="110"></canvas>
          <div class="waveform-overlay-status" style="display: none;">
            <div class="pulse-dot"></div>
            <span style="font-weight: 600; color: var(--color-recording);">${i18n.t('monologue.mic_active')}</span>
          </div>
        </div>

        <!-- Live Transcription Area -->
        <div class="glass-panel" style="width: 100%; text-align: left; min-height: 120px; max-height: 200px; overflow-y: auto;">
          <div style="font-size: var(--text-xs); font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">
            ${i18n.t('monologue.transcript_label')}
          </div>
          <p class="live-transcript-text" style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-primary); font-style: italic;">
            ${i18n.t('monologue.transcript_placeholder')}
          </p>
        </div>

        <!-- Recording Action Buttons -->
        <div class="controls-row">
          <button class="btn btn-primary start-record-btn" style="padding: 0.875rem 1.75rem;">
            ${i18n.t('monologue.start_btn')}
          </button>
          <button class="btn btn-secondary pause-record-btn" style="display: none;">
            ${i18n.t('monologue.pause_btn')}
          </button>
          <button class="btn btn-danger stop-record-btn" style="display: none;">
            ${i18n.t('monologue.stop_btn')}
          </button>
        </div>

        <!-- Review Audio Card (shown after stopping) -->
        <div class="glass-panel review-card" style="width: 100%; display: none; text-align: left; border-color: rgba(16, 185, 129, 0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <strong style="color: #6ee7b7; font-size: var(--text-sm);">${i18n.t('monologue.success_msg')}</strong>
            <span class="review-duration-text badge badge-success"></span>
          </div>
          <audio class="monologue-audio-player" controls style="width: 100%; margin-bottom: 1rem; border-radius: var(--radius-md);"></audio>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn btn-secondary retry-record-btn">${i18n.t('monologue.retry_btn')}</button>
            <button class="btn btn-primary advance-to-debate-btn" style="box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);">
              ${i18n.t('monologue.advance_btn')}
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachLogic(view);
    return view;
  }

  attachLogic(view) {
    const canvas = view.querySelector('.waveform-canvas');
    const startBtn = view.querySelector('.start-record-btn');
    const pauseBtn = view.querySelector('.pause-record-btn');
    const stopBtn = view.querySelector('.stop-record-btn');
    const overlayStatus = view.querySelector('.waveform-overlay-status');
    const timerText = view.querySelector('.speaking-timer-text');
    const statusBadge = view.querySelector('.speaking-status-badge');
    const transcriptText = view.querySelector('.live-transcript-text');
    const reviewCard = view.querySelector('.review-card');
    const audioPlayer = view.querySelector('.monologue-audio-player');
    const reviewDuration = view.querySelector('.review-duration-text');
    const advanceBtn = view.querySelector('.advance-to-debate-btn');
    const retryBtn = view.querySelector('.retry-record-btn');

    this.visualizer = new WaveformVisualizer(canvas);
    this.visualizer.draw(null);

    this.timer = new ExamTimer({
      mode: 'elapsed',
      initialSeconds: 0,
      onTick: (seconds, formatted) => {
        if (timerText) timerText.textContent = formatted;
        const status = this.timer.getMonologueStatus();
        if (statusBadge) {
          statusBadge.textContent = status.label;
          statusBadge.style.color = status.color === 'green' ? 'var(--color-success)' : (status.color === 'red' ? 'var(--color-danger)' : 'var(--color-warning)');
        }
      }
    });

    startBtn?.addEventListener('click', async () => {
      try {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'inline-flex';
        overlayStatus.style.display = 'flex';
        reviewCard.style.display = 'none';

        this.audioRecorder.onWaveformSample = (data) => {
          this.visualizer.draw(data);
        };

        await this.audioRecorder.startRecording();
        this.timer.reset(0);
        this.timer.start();

        this.speechRecognizer.onInterimResult = (text) => {
          if (transcriptText) transcriptText.textContent = text;
        };
        this.speechRecognizer.onFinalResult = (text) => {
          if (transcriptText) transcriptText.textContent = text;
        };
        this.speechRecognizer.startListening();

      } catch (err) {
        console.error('Microphone error:', err);
        showMicPermissionModal(err.message || "Microphone inaccessible.");
        startBtn.style.display = 'inline-flex';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        overlayStatus.style.display = 'none';
      }
    });

    pauseBtn?.addEventListener('click', () => {
      if (this.audioRecorder.isPaused) {
        this.audioRecorder.resumeRecording();
        this.timer.resume();
        pauseBtn.textContent = i18n.t('monologue.pause_btn');
      } else {
        this.audioRecorder.pauseRecording();
        this.timer.pause();
        pauseBtn.textContent = i18n.t('monologue.resume_btn');
      }
    });

    stopBtn?.addEventListener('click', async () => {
      this.timer.stop();
      overlayStatus.style.display = 'none';
      pauseBtn.style.display = 'none';
      stopBtn.style.display = 'none';

      const finalTranscript = this.speechRecognizer.stopListening();
      this.recordedResult = await this.audioRecorder.stopRecording();
      this.visualizer.draw(null);

      const audioKey = `monologue-${this.session.id}`;
      await this.audioStore.saveAudioBlob(audioKey, this.recordedResult.blob);

      const audioUrl = URL.createObjectURL(this.recordedResult.blob);
      audioPlayer.src = audioUrl;
      reviewDuration.textContent = `${this.timer.getFormattedTime()} (${this.recordedResult.durationSeconds}s)`;
      reviewCard.style.display = 'block';

      if (transcriptText) {
        transcriptText.textContent = finalTranscript || '(Transcription complétée)';
      }
    });

    retryBtn?.addEventListener('click', () => {
      reviewCard.style.display = 'none';
      startBtn.style.display = 'inline-flex';
      this.timer.reset(0);
      if (timerText) timerText.textContent = '00:00';
    });

    advanceBtn?.addEventListener('click', () => {
      const finalTranscript = this.speechRecognizer.getTranscript() || '(Exposé oral sans transcription)';
      this.onFinishMonologue({
        audioKey: `monologue-${this.session.id}`,
        durationSeconds: this.recordedResult?.durationSeconds || this.timer.seconds,
        transcript: finalTranscript
      });
    });
  }

  destroy() {
    if (this.timer) this.timer.stop();
    if (this.audioRecorder) this.audioRecorder.cleanup();
    if (this.speechRecognizer) this.speechRecognizer.stopListening();
  }
}
