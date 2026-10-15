/**
 * DebateView: Interactive oral debate with spoken AI Examiner, candidate rebuttal, and i18n
 */

import { renderDebateTurnChat } from '../components/DebateTurnChat.js';
import { WaveformVisualizer } from '../../core/audio/WaveformVisualizer.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class DebateView {
  constructor({ session, debateEngine, voiceSynthesizer, audioRecorder, speechRecognizer, audioStore, onFinishDebate }) {
    this.session = session;
    this.debateEngine = debateEngine;
    this.voiceSynthesizer = voiceSynthesizer;
    this.audioRecorder = audioRecorder;
    this.speechRecognizer = speechRecognizer;
    this.audioStore = audioStore;
    this.onFinishDebate = onFinishDebate;

    this.currentTurnIndex = (session.debateTurns?.length || 0) + 1;
    this.maxTurns = 3;
    this.currentQuestionText = '';
    this.isRecordingReply = false;
    this.visualizer = null;
  }

  render() {
    const view = document.createElement('div');
    view.className = 'view-container';

    this.currentQuestionText = this.debateEngine.generateExaminerQuestion(
      this.currentTurnIndex,
      this.session.triggerDocument,
      this.session.monologue?.transcript || ''
    );

    view.innerHTML = `
      <!-- Debate Header -->
      <div class="glass-panel" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary">${i18n.t('debate.badge')}</span>
          <h2 style="font-size: var(--text-xl); margin-top: 0.25rem;">${i18n.t('debate.title')}</h2>
        </div>
        <div>
          <span class="badge badge-success" style="font-size: var(--text-xs); padding: 0.375rem 0.75rem;">
            ${i18n.t('debate.turn_prefix')} ${this.currentTurnIndex} / ${this.maxTurns}
          </span>
        </div>
      </div>

      <!-- Debate Chat & Interaction Area -->
      <div class="debate-interaction-card">
        <div class="chat-container-slot">
          <!-- Injected debate chat turn -->
        </div>

        <!-- Candidate Reply Console -->
        <div class="glass-panel candidate-reply-console" style="border-color: rgba(99, 102, 241, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <strong style="font-size: var(--text-sm); color: #818cf8;">${i18n.t('debate.reply_title')}</strong>
            <span class="rebuttal-status-badge badge badge-secondary">${i18n.t('debate.waiting_status')}</span>
          </div>

          <!-- Waveform for reply -->
          <div class="waveform-container" style="height: 80px; margin-bottom: 1rem;">
            <canvas class="debate-waveform-canvas" width="650" height="80"></canvas>
          </div>

          <!-- Live reply transcript preview -->
          <div style="background: rgba(10, 14, 23, 0.5); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem; min-height: 60px; margin-bottom: 1rem; font-size: var(--text-sm); color: var(--text-secondary); font-style: italic;">
            <span class="reply-transcript-text">${i18n.t('debate.reply_hint')}</span>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button class="btn btn-primary start-reply-btn" style="padding: 0.75rem 1.5rem;">
              ${i18n.t('debate.start_reply_btn')}
            </button>
            <button class="btn btn-danger stop-reply-btn" style="display: none; padding: 0.75rem 1.5rem;">
              ${i18n.t('debate.stop_reply_btn')}
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachLogic(view);
    return view;
  }

  attachLogic(view) {
    const chatSlot = view.querySelector('.chat-container-slot');
    const canvas = view.querySelector('.debate-waveform-canvas');
    const startReplyBtn = view.querySelector('.start-reply-btn');
    const stopReplyBtn = view.querySelector('.stop-reply-btn');
    const replyStatus = view.querySelector('.rebuttal-status-badge');
    const replyTranscript = view.querySelector('.reply-transcript-text');

    this.visualizer = new WaveformVisualizer(canvas);
    this.visualizer.draw(null);

    // Render Chat Bubble with i18n
    const chatComponent = renderDebateTurnChat({
      turnIndex: this.currentTurnIndex,
      maxTurns: this.maxTurns,
      questionText: this.currentQuestionText,
      isExaminerSpeaking: true,
      onReplayQuestion: (text) => {
        this.voiceSynthesizer.speak(text);
      }
    });
    chatSlot?.appendChild(chatComponent);

    this.voiceSynthesizer.speak(this.currentQuestionText);

    startReplyBtn?.addEventListener('click', async () => {
      try {
        this.voiceSynthesizer.cancel();
        startReplyBtn.style.display = 'none';
        stopReplyBtn.style.display = 'inline-flex';
        replyStatus.textContent = i18n.t('debate.recording_status');
        replyStatus.className = 'rebuttal-status-badge badge badge-recording';

        this.audioRecorder.onWaveformSample = (data) => {
          this.visualizer.draw(data);
        };

        await this.audioRecorder.startRecording();
        this.isRecordingReply = true;

        this.speechRecognizer.onInterimResult = (text) => {
          if (replyTranscript) replyTranscript.textContent = text;
        };
        this.speechRecognizer.onFinalResult = (text) => {
          if (replyTranscript) replyTranscript.textContent = text;
        };
        this.speechRecognizer.startListening();

      } catch (err) {
        console.error('Mic error:', err);
        alert("Erreur micro : " + err.message);
      }
    });

    stopReplyBtn?.addEventListener('click', async () => {
      this.isRecordingReply = false;
      stopReplyBtn.style.display = 'none';
      replyStatus.textContent = i18n.t('debate.done_status');
      replyStatus.className = 'rebuttal-status-badge badge badge-success';

      const finalReplyText = this.speechRecognizer.stopListening();
      const recorded = await this.audioRecorder.stopRecording();
      this.visualizer.draw(null);

      const audioKey = `debate-turn-${this.session.id}-${this.currentTurnIndex}`;
      await this.audioStore.saveAudioBlob(audioKey, recorded.blob);

      const completedTurn = {
        turnIndex: this.currentTurnIndex,
        examinerQuestionText: this.currentQuestionText,
        candidateAudioKey: audioKey,
        candidateDurationSeconds: recorded.durationSeconds,
        candidateTranscript: finalReplyText || '(Réponse enregistrée)'
      };

      if (this.currentTurnIndex < this.maxTurns) {
        this.session.debateTurns.push(completedTurn);
        this.currentTurnIndex++;
        const parent = view.parentElement;
        if (parent) {
          const nextView = this.render();
          parent.replaceChild(nextView, view);
        }
      } else {
        this.session.debateTurns.push(completedTurn);
        this.onFinishDebate(this.session.debateTurns);
      }
    });
  }

  destroy() {
    this.voiceSynthesizer.cancel();
    if (this.audioRecorder) this.audioRecorder.cleanup();
    if (this.speechRecognizer) this.speechRecognizer.stopListening();
  }
}
