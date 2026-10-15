/**
 * ConversationTurnInput: Speech input console, live dictation, text editing,
 * clear button, CEFR suggestions, and reply submission for Conversation Mode
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export class ConversationTurnInput {
  constructor({
    audioRecorder,
    speechRecognizer,
    onSubmitTurn = () => {},
    suggestedReplies = []
  } = {}) {
    this.audioRecorder = audioRecorder;
    this.speechRecognizer = speechRecognizer;
    this.onSubmitTurn = onSubmitTurn;
    this.suggestedReplies = suggestedReplies;
    this.currentText = '';

    this.isRecording = false;
    this.recognitionLang = 'fr-FR';
    this.container = null;
  }

  setSuggestedReplies(suggestions = []) {
    this.suggestedReplies = suggestions;
    this.updateSuggestionsDOM();
  }

  setText(text) {
    this.currentText = text;
    if (this.container) {
      const textarea = this.container.querySelector('.conv-reply-box');
      if (textarea) textarea.value = text;
    }
    this.updateWordCount();
  }

  clearText() {
    this.setText('');
    if (this.speechRecognizer) {
      this.speechRecognizer.accumulatedTranscript = '';
    }
    const textarea = this.container?.querySelector('.conv-reply-box');
    if (textarea) textarea.focus();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'glass-panel conversation-input-card';
    this.container.style.marginTop = '1.25rem';
    this.container.style.position = 'sticky';
    this.container.style.bottom = '1rem';
    this.container.style.zIndex = '20';
    this.container.style.boxShadow = '0 -4px 20px rgba(0,0,0,0.4)';

    this.updateDOM();
    return this.container;
  }

  updateDOM() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button type="button" class="btn ${this.isRecording ? 'btn-danger' : 'btn-primary'} conv-rec-btn" style="padding: 0.45rem 0.9rem; font-size: var(--text-xs); font-weight: 700;">
            ${this.isRecording ? '⏹️ Terminer' : '🎙️ Parler au micro'}
          </button>
          <span class="conv-rec-status" style="font-size: 0.75rem; color: ${this.isRecording ? '#f87171' : 'var(--text-muted)'}; font-weight: 600;">
            ${this.isRecording ? '🔴 Écoute active...' : 'Prêt à parler'}
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 0.35rem; font-size: var(--text-xs); color: var(--text-muted);">
          <span>🗣️ Langue d'écoute :</span>
          <select class="conv-lang-select" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); color: var(--text-color); border-radius: var(--radius-sm); padding: 0.2rem 0.45rem; font-size: 0.75rem;">
            <option value="fr-FR" ${this.recognitionLang === 'fr-FR' ? 'selected' : ''}>Français (fr-FR)</option>
            <option value="vi-VN" ${this.recognitionLang === 'vi-VN' ? 'selected' : ''}>Tiếng Việt (vi-VN)</option>
            <option value="en-US" ${this.recognitionLang === 'en-US' ? 'selected' : ''}>English (en-US)</option>
          </select>
        </div>
      </div>

      <!-- Speech Error / Diagnostic Alert Box -->
      <div class="conv-speech-error-box" style="display: none; padding: 0.5rem 0.75rem; margin-bottom: 0.6rem; border-radius: var(--radius-sm); background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); font-size: var(--text-xs); color: #fca5a5;"></div>

      <!-- Reply Textarea -->
      <div style="position: relative;">
        <textarea 
          class="conv-reply-box" 
          rows="2"
          placeholder="${i18n.t('conversation.reply_placeholder') || 'Exprimez-vous au micro ou tapez votre réplique en français...'}"
          style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.6rem 0.85rem; color: var(--text-color); font-size: var(--text-sm); line-height: 1.5; resize: vertical;"
        >${this.currentText}</textarea>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.4rem; font-size: 0.75rem; color: var(--text-muted); flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <button type="button" class="btn btn-secondary conv-clear-btn" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 0.3rem;" title="Effacer le texte">
              🗑️ ${i18n.t('practice.clear_transcript_btn') || 'Effacer le texte'}
            </button>
            <span class="conv-word-count">0 mot(s)</span>
          </div>

          <button type="button" class="btn btn-primary conv-send-btn" style="padding: 0.45rem 1.25rem; font-size: var(--text-xs); font-weight: 700; box-shadow: var(--shadow-glow);">
            🚀 ${i18n.t('conversation.send_reply_btn') || 'Envoyer ma réplique'} →
          </button>
        </div>
      </div>

      <!-- Suggested Expressions Accordion -->
      <div class="conv-suggestions-slot" style="margin-top: 0.5rem;"></div>
    `;

    this.bindEvents();
    this.updateWordCount();
    this.updateSuggestionsDOM();
  }

  showSpeechError(err) {
    const errorBox = this.container?.querySelector('.conv-speech-error-box');
    if (!errorBox) return;

    if (err === 'not-supported') {
      errorBox.innerHTML = `ℹ️ <strong>Navigateur non compatible :</strong> La reconnaissance vocale Web Speech nécessite <strong>Google Chrome</strong> ou <strong>Microsoft Edge</strong>. Vous pouvez saisir votre réponse directement au clavier.`;
    } else if (err === 'not-allowed') {
      errorBox.innerHTML = `⚠️ <strong>Microphone refusé :</strong> Veuillez autoriser l'accès au micro dans votre navigateur (icône cadenas dans la barre d'adresse) pour dicter vos répliques.`;
    } else if (err === 'network') {
      errorBox.innerHTML = `⚠️ <strong>Erreur réseau :</strong> La reconnaissance vocale nécessite une connexion Internet active pour contacter les serveurs vocaux de Google.`;
    } else if (err === 'no-speech') {
      errorBox.innerHTML = `ℹ️ <strong>Aucune voix détectée :</strong> Le micro n'a capté aucun son. Parlez plus distinctement ou vérifiez votre micro.`;
    } else {
      errorBox.innerHTML = `⚠️ <strong>Statut micro :</strong> ${err}`;
    }
    errorBox.style.display = 'block';
  }

  clearSpeechError() {
    const errorBox = this.container?.querySelector('.conv-speech-error-box');
    if (errorBox) {
      errorBox.style.display = 'none';
    }
  }

  updateSuggestionsDOM() {
    const slot = this.container?.querySelector('.conv-suggestions-slot');
    if (!slot) return;

    if (!this.suggestedReplies || this.suggestedReplies.length === 0) {
      slot.innerHTML = '';
      return;
    }

    slot.innerHTML = `
      <details style="font-size: 0.75rem; color: #93c5fd; background: rgba(59, 130, 246, 0.08); padding: 0.4rem 0.75rem; border-radius: var(--radius-sm);">
        <summary style="cursor: pointer; font-weight: 600;">
          💡 Suggestions d'expressions pour votre réplique (cliquez pour insérer) :
        </summary>
        <div style="display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.45rem;">
          ${this.suggestedReplies.map(phrase => `
            <button type="button" class="suggestion-chip" data-phrase="${phrase.replace(/"/g, '&quot;')}" style="text-align: left; background: rgba(255,255,255,0.06); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-sm); padding: 0.35rem 0.6rem; color: #e2e8f0; font-size: 0.75rem; cursor: pointer; transition: background 0.2s;">
              « ${phrase} »
            </button>
          `).join('')}
        </div>
      </details>
    `;

    slot.querySelectorAll('.suggestion-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.dataset.phrase;
        this.setText(phrase);
        const textarea = this.container?.querySelector('.conv-reply-box');
        if (textarea) textarea.focus();
      });
    });
  }

  bindEvents() {
    const recBtn = this.container.querySelector('.conv-rec-btn');
    recBtn?.addEventListener('click', () => this.toggleRecording());

    const clearBtn = this.container.querySelector('.conv-clear-btn');
    clearBtn?.addEventListener('click', () => this.clearText());

    const sendBtn = this.container.querySelector('.conv-send-btn');
    sendBtn?.addEventListener('click', () => this.handleSubmit());

    const textarea = this.container.querySelector('.conv-reply-box');
    textarea?.addEventListener('input', (e) => {
      this.currentText = e.target.value;
      this.updateWordCount();
    });

    textarea?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSubmit();
      }
    });

    const langSelect = this.container.querySelector('.conv-lang-select');
    langSelect?.addEventListener('change', (e) => {
      this.recognitionLang = e.target.value;
      if (this.speechRecognizer && typeof this.speechRecognizer.setLanguage === 'function') {
        this.speechRecognizer.setLanguage(this.recognitionLang);
      }
    });
  }

  updateWordCount() {
    const badge = this.container?.querySelector('.conv-word-count');
    const clearBtn = this.container?.querySelector('.conv-clear-btn');
    const sendBtn = this.container?.querySelector('.conv-send-btn');

    const hasText = Boolean(this.currentText.trim());
    const words = hasText ? this.currentText.trim().split(/\s+/).length : 0;

    if (badge) badge.textContent = `${words} mot(s)`;
    if (clearBtn) {
      clearBtn.disabled = !hasText;
      clearBtn.style.opacity = hasText ? '1' : '0.45';
      clearBtn.style.cursor = hasText ? 'pointer' : 'not-allowed';
    }
    if (sendBtn) {
      sendBtn.disabled = !hasText;
      sendBtn.style.opacity = hasText ? '1' : '0.5';
    }
  }

  async toggleRecording() {
    if (this.isRecording) {
      await this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  updateRecordingUI(isRecording) {
    const recBtn = this.container?.querySelector('.conv-rec-btn');
    const statusText = this.container?.querySelector('.conv-rec-status');
    if (recBtn) {
      recBtn.className = `btn ${isRecording ? 'btn-danger' : 'btn-primary'} conv-rec-btn`;
      recBtn.textContent = isRecording ? '⏹️ Terminer' : '🎙️ Parler au micro';
    }
    if (statusText) {
      statusText.textContent = isRecording ? '🔴 Écoute active...' : 'Prêt à parler';
      statusText.style.color = isRecording ? '#f87171' : 'var(--text-muted)';
    }
  }

  handleLiveTranscript(text) {
    if (!text) return;
    this.currentText = text;
    if (this.container) {
      const textarea = this.container.querySelector('.conv-reply-box');
      if (textarea) {
        textarea.value = text;
        textarea.scrollTop = textarea.scrollHeight;
      }
    }
    this.updateWordCount();
  }

  async startRecording() {
    if (this.isRecording) return;
    try {
      this.clearSpeechError();

      if (this.audioRecorder && typeof this.audioRecorder.startRecording === 'function') {
        try {
          await this.audioRecorder.startRecording();
        } catch (e) {
          console.warn('[ConversationTurnInput] audioRecorder prompt note:', e);
        }
      }

      if (this.speechRecognizer) {
        if (this.speechRecognizer.isSupported === false) {
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
            console.warn('[ConversationTurnInput] Speech recognition warning:', err);
            this.showSpeechError(err);
          };

          if (typeof this.speechRecognizer.startListening === 'function') {
            this.speechRecognizer.startListening(this.currentText);
          } else if (typeof this.speechRecognizer.start === 'function') {
            this.speechRecognizer.start();
          }
        }
      }

      this.isRecording = true;
      this.updateRecordingUI(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      this.showSpeechError(err.message || 'error');
      await this.stopRecording();
    }
  }

  async stopRecording() {
    this.isRecording = false;
    this.updateRecordingUI(false);

    if (this.speechRecognizer) {
      if (typeof this.speechRecognizer.stopListening === 'function') {
        this.speechRecognizer.stopListening();
      } else if (typeof this.speechRecognizer.stop === 'function') {
        this.speechRecognizer.stop();
      }
    }

    if (this.audioRecorder && typeof this.audioRecorder.stopRecording === 'function') {
      try {
        await this.audioRecorder.stopRecording();
      } catch (e) {}
    }
  }

  handleSubmit() {
    const text = this.currentText.trim();
    if (!text) return;

    if (this.isRecording) {
      this.stopRecording();
    }

    if (this.speechRecognizer) {
      this.speechRecognizer.accumulatedTranscript = '';
    }

    this.onSubmitTurn(text);
    this.clearText();
  }

  destroy() {
    if (this.isRecording) {
      this.stopRecording();
    }
  }
}
