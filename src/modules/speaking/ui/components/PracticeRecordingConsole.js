/**
 * PracticeRecordingConsole: Audio capture, speech-to-text, and editable transcript editor for Practice Mode
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export class PracticeRecordingConsole {
  constructor({
    audioRecorder,
    speechRecognizer,
    initialTranscript = '',
    onTranscriptChange = () => {}
  } = {}) {
    this.audioRecorder = audioRecorder;
    this.speechRecognizer = speechRecognizer;
    this.transcript = initialTranscript;
    this.onTranscriptChange = onTranscriptChange;
    this.recognitionLang = 'fr-FR';

    this.isRecording = false;
    this.isPaused = false;
    this.recordDuration = 0;
    this.timerInterval = null;

    this.container = null;
  }

  getTranscript() {
    return this.transcript.trim();
  }

  setTranscript(text) {
    this.transcript = text;
    if (this.container) {
      const textarea = this.container.querySelector('.practice-transcript-box');
      if (textarea) textarea.value = text;
    }
    this.updateWordCount();
    this.onTranscriptChange(this.transcript);
  }

  clearTranscript() {
    this.setTranscript('');
    const textarea = this.container?.querySelector('.practice-transcript-box');
    if (textarea) textarea.focus();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'glass-panel practice-console-card';
    this.updateDOM();
    return this.container;
  }

  updateDOM() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h3 style="font-size: var(--text-base); margin-bottom: 0.15rem; display: flex; align-items: center; gap: 0.5rem;">
            🎤 ${i18n.t('practice.recording_title') || 'Votre intervention orale & Transcription'}
          </h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            ${i18n.t('practice.recording_desc') || 'Enregistrez votre prise de parole en français ou saisissez directement votre texte ci-dessous :'}
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="recording-indicator ${this.isRecording && !this.isPaused ? 'active' : ''}">
            <span class="indicator-dot ${this.isRecording && !this.isPaused ? 'pulsing' : ''}"></span>
            <span class="recording-status-text" style="font-size: var(--text-xs); font-weight: 600;">
              ${this.isRecording ? (this.isPaused ? 'En pause' : `Enregistrement (${this.formatTime(this.recordDuration)})`) : 'Prêt à enregistrer'}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons Row + Language Select -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          ${!this.isRecording ? `
            <button type="button" class="btn btn-primary start-rec-btn" style="padding: 0.5rem 1rem;">
              🎙️ ${i18n.t('practice.start_recording') || 'Commencer l’enregistrement'}
            </button>
          ` : `
            <button type="button" class="btn btn-secondary pause-rec-btn" style="padding: 0.5rem 1rem;">
              ${this.isPaused ? '▶️ Reprendre' : '⏸️ Pause'}
            </button>
            <button type="button" class="btn btn-danger stop-rec-btn" style="padding: 0.5rem 1rem;">
              ⏹️ ${i18n.t('practice.stop_recording') || 'Terminer'}
            </button>
          `}
        </div>

        <div style="display: flex; align-items: center; gap: 0.35rem; font-size: var(--text-xs); color: var(--text-muted);">
          <span>🗣️ Langue d'écoute :</span>
          <select class="practice-lang-select" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-color); border-radius: var(--radius-sm); padding: 0.25rem 0.5rem; font-size: 0.75rem;">
            <option value="fr-FR" ${this.recognitionLang === 'fr-FR' ? 'selected' : ''}>Français (fr-FR)</option>
            <option value="vi-VN" ${this.recognitionLang === 'vi-VN' ? 'selected' : ''}>Tiếng Việt (vi-VN)</option>
            <option value="en-US" ${this.recognitionLang === 'en-US' ? 'selected' : ''}>English (en-US)</option>
          </select>
        </div>
      </div>

      <!-- Real-time Speech Diagnostic & Status Banner -->
      <div class="speech-status-banner" style="font-size: 0.75rem; padding: 0.4rem 0.65rem; margin-bottom: 0.6rem; border-radius: var(--radius-sm); background: ${this.isRecording ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)'}; border: 1px solid ${this.isRecording ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)'}; color: ${this.isRecording ? '#93c5fd' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.4rem;">
        <span>${this.isRecording ? '🔴' : 'ℹ️'}</span>
        <span class="speech-status-banner-text">
          ${this.isRecording ? `Écoute active en direct (${this.recognitionLang}). Parlez dans votre micro, le texte s'affiche instantanément ci-dessous.` : `Reconnaissance vocale prête (${this.recognitionLang}). Cliquez sur « Commencer l’enregistrement » pour dicter en temps réel.`}
        </span>
      </div>

      <!-- Speech Error / Support Alert Box -->
      <div class="speech-error-box" style="display: none; padding: 0.6rem 0.85rem; margin-bottom: 0.75rem; border-radius: var(--radius-md); background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); font-size: var(--text-xs); color: #fca5a5;"></div>

      <!-- Editable Transcript Box -->
      <div style="position: relative;">
        <textarea 
          class="practice-transcript-box" 
          placeholder="${i18n.t('practice.transcript_placeholder') || 'Parlez dans votre micro ou écrivez ici votre texte en français...'}"
        >${this.transcript}</textarea>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; font-size: 0.75rem; color: var(--text-muted); flex-wrap: wrap; gap: 0.5rem;">
          <span>✏️ ${i18n.t('practice.transcript_edit_hint') || "Vous pouvez modifier manuellement ce texte avant l'analyse."}</span>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <button type="button" class="btn btn-secondary clear-transcript-btn" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.35rem;" title="${i18n.t('practice.clear_transcript_btn') || 'Effacer le texte'}">
              🗑️ ${i18n.t('practice.clear_transcript_btn') || 'Effacer le texte'}
            </button>
            <span class="word-count-badge">0 mot(s)</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateWordCount();
  }

  bindEvents() {
    const startBtn = this.container.querySelector('.start-rec-btn');
    startBtn?.addEventListener('click', () => this.startRecording());

    const pauseBtn = this.container.querySelector('.pause-rec-btn');
    pauseBtn?.addEventListener('click', () => this.togglePause());

    const stopBtn = this.container.querySelector('.stop-rec-btn');
    stopBtn?.addEventListener('click', () => this.stopRecording());

    const clearBtn = this.container.querySelector('.clear-transcript-btn');
    clearBtn?.addEventListener('click', () => this.clearTranscript());

    const langSelect = this.container.querySelector('.practice-lang-select');
    langSelect?.addEventListener('change', (e) => {
      this.recognitionLang = e.target.value;
      if (this.speechRecognizer && typeof this.speechRecognizer.setLanguage === 'function') {
        this.speechRecognizer.setLanguage(this.recognitionLang);
      }
      const bannerText = this.container.querySelector('.speech-status-banner-text');
      if (bannerText) {
        bannerText.textContent = this.isRecording 
          ? `Écoute active en direct (${this.recognitionLang}). Parlez dans votre micro, le texte s'affiche instantanément.` 
          : `Reconnaissance vocale prête (${this.recognitionLang}). Cliquez sur « Commencer l’enregistrement » pour dicter en temps réel.`;
      }
    });

    const textarea = this.container.querySelector('.practice-transcript-box');
    textarea?.addEventListener('input', (e) => {
      this.transcript = e.target.value;
      this.onTranscriptChange(this.transcript);
      this.updateWordCount();
    });
  }

  updateWordCount() {
    const badge = this.container?.querySelector('.word-count-badge');
    const clearBtn = this.container?.querySelector('.clear-transcript-btn');
    const hasText = Boolean(this.transcript.trim());
    const words = hasText ? this.transcript.trim().split(/\s+/).length : 0;
    if (badge) {
      badge.textContent = `${words} mot(s)`;
    }
    if (clearBtn) {
      clearBtn.disabled = !hasText;
      clearBtn.style.opacity = hasText ? '1' : '0.45';
      clearBtn.style.cursor = hasText ? 'pointer' : 'not-allowed';
    }
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  async startRecording() {
    if (this.isRecording) return;
    try {
      this.clearSpeechError();

      if (this.audioRecorder) {
        await this.audioRecorder.startRecording();
      }

      if (this.speechRecognizer) {
        if (!this.speechRecognizer.isSupported) {
          this.showSpeechError('not-supported');
        } else {
          if (typeof this.speechRecognizer.setLanguage === 'function') {
            this.speechRecognizer.setLanguage(this.recognitionLang);
          }
          this.speechRecognizer.onInterimResult = (liveText) => {
            this.handleLiveTranscript(liveText);
          };
          this.speechRecognizer.onFinalResult = (finalText) => {
            this.handleLiveTranscript(finalText);
          };
          this.speechRecognizer.onError = (err) => {
            console.warn('[PracticeRecordingConsole] STT Error:', err);
            this.showSpeechError(err);
          };
          this.speechRecognizer.startListening(this.transcript);
        }
      }

      this.isRecording = true;
      this.isPaused = false;
      this.recordDuration = 0;
      this.timerInterval = setInterval(() => {
        if (!this.isPaused) {
          this.recordDuration++;
          const statusText = this.container?.querySelector('.recording-status-text');
          if (statusText) {
            statusText.textContent = `Enregistrement (${this.formatTime(this.recordDuration)})`;
          }
        }
      }, 1000);

      this.updateDOM();
    } catch (err) {
      console.error('Recording start error:', err);
      alert("Impossible d'accéder au microphone : " + err.message);
    }
  }

  handleLiveTranscript(text) {
    if (!text) return;
    this.transcript = text;
    if (this.container) {
      const textarea = this.container.querySelector('.practice-transcript-box');
      if (textarea) {
        textarea.value = text;
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
    this.onTranscriptChange(this.transcript);
    this.updateWordCount();
  }

  showSpeechError(err) {
    const errorBox = this.container?.querySelector('.speech-error-box');
    if (!errorBox) return;

    if (err === 'not-supported') {
      errorBox.innerHTML = `ℹ️ <strong>Navigateur non compatible :</strong> La reconnaissance vocale en temps réel (Web Speech API) nécessite <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>. (Firefox/Safari ne supportent pas cette API). Vous pouvez saisir votre texte manuellement.`;
    } else if (err === 'not-allowed') {
      errorBox.innerHTML = `⚠️ <strong>Microphone refusé :</strong> Veuillez autoriser l'accès au micro dans votre navigateur (icône cadenas dans la barre d'adresse) pour activer la transcription en direct.`;
    } else if (err === 'network') {
      errorBox.innerHTML = `⚠️ <strong>Erreur réseau Google Speech :</strong> La reconnaissance vocale Web Speech de Chrome nécessite une connexion Internet active pour contacter les serveurs vocaux de Google.`;
    } else if (err === 'no-speech') {
      errorBox.innerHTML = `ℹ️ <strong>Aucune voix détectée :</strong> Le micro n'a capté aucun son. Rapprochez-vous du micro, vérifiez le volume ou parlez plus fort.`;
    } else {
      errorBox.innerHTML = `⚠️ <strong>Statut reconnaissance vocale :</strong> ${err}`;
    }
    errorBox.style.display = 'block';
  }

  clearSpeechError() {
    const errorBox = this.container?.querySelector('.speech-error-box');
    if (errorBox) {
      errorBox.style.display = 'none';
      errorBox.innerHTML = '';
    }
  }

  togglePause() {
    if (!this.isRecording) return;
    this.isPaused = !this.isPaused;
    if (this.audioRecorder) {
      if (this.isPaused) this.audioRecorder.pauseRecording?.();
      else this.audioRecorder.resumeRecording?.();
    }
    if (this.speechRecognizer) {
      if (this.isPaused) this.speechRecognizer.stopListening();
      else this.speechRecognizer.startListening(this.transcript);
    }
    this.updateDOM();
  }

  async stopRecording() {
    if (!this.isRecording) return;
    clearInterval(this.timerInterval);
    this.timerInterval = null;

    try {
      if (this.speechRecognizer) {
        const finalRecorded = this.speechRecognizer.stopListening();
        if (finalRecorded) {
          this.handleLiveTranscript(finalRecorded);
        }
      }
      if (this.audioRecorder) {
        await this.audioRecorder.stopRecording();
      }
    } catch (e) {
      console.warn('Stop recording note:', e);
    }

    this.isRecording = false;
    this.isPaused = false;
    this.updateDOM();
  }

  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.isRecording) {
      this.stopRecording();
    }
  }
}
