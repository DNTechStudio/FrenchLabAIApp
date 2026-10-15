/**
 * App: Main orchestrator for DELF-DALF Lab Speaking App
 */

import { ExamPhases } from './types/index.js';
import { i18n } from './core/i18n/I18nManager.js';
import { SessionRepository } from './core/storage/SessionRepository.js';
import { AudioStore } from './core/storage/AudioStore.js';
import { AudioRecorder } from './core/audio/AudioRecorder.js';
import { SpeechRecognizer } from './core/speech/SpeechRecognizer.js';
import { VoiceSynthesizer } from './core/speech/VoiceSynthesizer.js';
import { DelfB2EvaluationEngine } from './core/evaluation/DelfB2EvaluationEngine.js';
import { DebateEngine } from './core/evaluation/DebateEngine.js';
import { ExamFlowStateMachine } from './core/ExamFlowStateMachine.js';

import { renderModeSwitcher, getActiveMode, APP_MODES } from './ui/components/ModeSwitcher.js';
import { renderLanguagePicker } from './ui/components/LanguagePicker.js';
import { SelectionView } from './ui/views/SelectionView.js';
import { PreparationView } from './ui/views/PreparationView.js';
import { MonologueView } from './ui/views/MonologueView.js';
import { DebateView } from './ui/views/DebateView.js';
import { ReportView } from './ui/views/ReportView.js';
import { PracticeView } from './ui/views/PracticeView.js';
import { ConversationView } from './ui/views/ConversationView.js';

export class App {
  constructor() {
    this.sessionRepo = new SessionRepository();
    this.audioStore = new AudioStore();
    this.audioRecorder = new AudioRecorder();
    this.speechRecognizer = new SpeechRecognizer();
    this.voiceSynthesizer = new VoiceSynthesizer();
    this.evalEngine = new DelfB2EvaluationEngine();
    this.debateEngine = new DebateEngine();

    this.activeMode = getActiveMode();
    this.activeViewInstance = null;

    this.machine = new ExamFlowStateMachine({
      sessionRepository: this.sessionRepo,
      onPhaseChange: (phase, session) => this.handlePhaseChange(phase, session)
    });
  }

  init() {
    this.setupGlobalShortcuts();
    this.setupHeaderActions();
    this.updateStepperUI(ExamPhases.SELECTION);

    if (this.activeMode === APP_MODES.PRACTICE) {
      this.handleModeChange(APP_MODES.PRACTICE);
      return;
    }
    if (this.activeMode === APP_MODES.CONVERSATION) {
      this.handleModeChange(APP_MODES.CONVERSATION);
      return;
    }

    // Check for previous session in storage
    const saved = this.sessionRepo.getActiveSession();
    if (saved && saved.phase && saved.phase !== ExamPhases.SELECTION) {
      const confirmResume = confirm(`Une session d'examen non terminée (« ${saved.triggerDocument?.title || 'Document DELF'} ») a été détectée. Souhaitez-vous la reprendre ?`);
      if (confirmResume) {
        this.machine.restoreSession(saved);
        return;
      } else {
        this.sessionRepo.clearActiveSession();
      }
    }

    this.renderView(ExamPhases.SELECTION);
  }

  handlePhaseChange(phase, session) {
    this.updateStepperUI(phase);
    this.renderView(phase, session);
  }

  renderView(phase, session = this.machine.session) {
    if (this.activeViewInstance && typeof this.activeViewInstance.destroy === 'function') {
      this.activeViewInstance.destroy();
    }

    const container = document.getElementById('view-viewport');
    if (!container) return;
    container.innerHTML = '';

    switch (phase) {
      case ExamPhases.SELECTION:
        this.activeViewInstance = new SelectionView({
          onSelectDocument: (doc) => {
            this.machine.initSession(doc);
          }
        });
        container.appendChild(this.activeViewInstance.render());
        break;

      case ExamPhases.PREPARATION:
        this.activeViewInstance = new PreparationView({
          session,
          onUpdateScratchpad: (notes) => this.machine.updateScratchpad(notes),
          onConcludePreparation: () => this.machine.transitionTo(ExamPhases.MONOLOGUE)
        });
        container.appendChild(this.activeViewInstance.render());
        break;

      case ExamPhases.MONOLOGUE:
        this.activeViewInstance = new MonologueView({
          session,
          audioRecorder: this.audioRecorder,
          speechRecognizer: this.speechRecognizer,
          audioStore: this.audioStore,
          onFinishMonologue: (result) => {
            this.machine.recordMonologueResult(result);
            this.machine.transitionTo(ExamPhases.DEBATE);
          }
        });
        container.appendChild(this.activeViewInstance.render());
        break;

      case ExamPhases.DEBATE:
        this.activeViewInstance = new DebateView({
          session,
          debateEngine: this.debateEngine,
          voiceSynthesizer: this.voiceSynthesizer,
          audioRecorder: this.audioRecorder,
          speechRecognizer: this.speechRecognizer,
          audioStore: this.audioStore,
          onFinishDebate: async () => {
            this.triggerEvaluationLoading();
          }
        });
        container.appendChild(this.activeViewInstance.render());
        break;

      case ExamPhases.REPORT:
        this.activeViewInstance = new ReportView({
          session,
          onRestartSameTopic: () => {
            this.machine.initSession(session.triggerDocument);
          },
          onNewExam: () => {
            this.sessionRepo.clearActiveSession();
            this.machine.transitionTo(ExamPhases.SELECTION);
          }
        });
        container.appendChild(this.activeViewInstance.render());
        break;

      default:
        this.renderView(ExamPhases.SELECTION);
    }
  }

  async triggerEvaluationLoading() {
    const container = document.getElementById('view-viewport');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 4rem 2rem; max-width: 600px; margin: 2rem auto;">
        <div style="font-size: 3rem; margin-bottom: 1rem; animation: pulse-dot-anim 1.5s infinite;">
          ⚖️
        </div>
        <h2 style="font-size: var(--text-2xl); margin-bottom: 0.75rem;">
          Calcul de la Note Officielle DELF B2...
        </h2>
        <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
          Analyse de la structuration de l'exposé (/9), de la pertinence des réparties du débat (/6), de la richesse lexicale (/4) et de la précision morphosyntaxique (/5)...
        </p>
        <div class="progress-bar-track" style="height: 10px; max-width: 400px; margin: 0 auto;">
          <div class="progress-bar-fill" style="width: 100%; animation: pulse-recording 1.2s infinite;"></div>
        </div>
      </div>
    `;

    try {
      const report = await this.evalEngine.evaluateSession({
        triggerDocument: this.machine.session.triggerDocument,
        monologue: this.machine.session.monologue,
        debateTurns: this.machine.session.debateTurns
      });

      setTimeout(() => {
        this.machine.setEvaluationReport(report);
      }, 1200);

    } catch (err) {
      console.error('Evaluation error:', err);
      alert("Erreur lors de l'évaluation : " + err.message);
      this.machine.transitionTo(ExamPhases.SELECTION);
    }
  }

  updateStepperUI(currentPhase) {
    const steps = [
      { id: 'step-select', phase: ExamPhases.SELECTION, key: 'stepper.select' },
      { id: 'step-prep', phase: ExamPhases.PREPARATION, key: 'stepper.prep' },
      { id: 'step-mono', phase: ExamPhases.MONOLOGUE, key: 'stepper.mono' },
      { id: 'step-debate', phase: ExamPhases.DEBATE, key: 'stepper.debate' },
      { id: 'step-report', phase: ExamPhases.REPORT, key: 'stepper.report' }
    ];

    let foundActive = false;
    steps.forEach(s => {
      const elem = document.getElementById(s.id);
      if (!elem) return;
      elem.classList.remove('active', 'completed');

      const span = elem.querySelector('span');
      if (span && s.key) {
        span.textContent = i18n.t(s.key);
      }

      if (s.phase === currentPhase) {
        elem.classList.add('active');
        foundActive = true;
      } else if (!foundActive) {
        elem.classList.add('completed');
      }
    });
  }

  setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('mic-permission-modal');
        if (modal) modal.remove();
      }
    });
  }

  setupHeaderActions() {
    const modeSlot = document.getElementById('mode-switcher-slot');
    if (modeSlot) {
      modeSlot.innerHTML = '';
      modeSlot.appendChild(renderModeSwitcher({
        onModeChange: (newMode) => this.handleModeChange(newMode)
      }));
    }

    const pickerSlot = document.getElementById('language-picker-slot');
    if (pickerSlot) {
      pickerSlot.innerHTML = '';
      pickerSlot.appendChild(renderLanguagePicker());
    }

    const resetBtn = document.getElementById('reset-exam-btn');
    if (resetBtn) {
      resetBtn.textContent = i18n.t('header.reset');
      resetBtn.addEventListener('click', () => {
        if (confirm("Voulez-vous vraiment réinitialiser la session en cours et revenir au choix du sujet ?")) {
          this.sessionRepo.clearActiveSession();
          this.machine.transitionTo(ExamPhases.SELECTION);
        }
      });
    }

    i18n.subscribe(() => {
      this.updateStepperUI(this.machine.currentPhase);
      if (resetBtn) {
        resetBtn.textContent = i18n.t('header.reset');
      }
      if (this.activeMode === APP_MODES.PRACTICE) {
        this.renderPracticeMode();
      } else if (this.activeMode === APP_MODES.CONVERSATION) {
        this.renderConversationMode();
      } else if (this.machine.currentPhase === ExamPhases.SELECTION || this.machine.currentPhase === ExamPhases.REPORT) {
        this.renderView(this.machine.currentPhase, this.machine.session);
      }
    });
  }

  handleModeChange(newMode) {
    this.activeMode = newMode;
    const stepper = document.querySelector('.stepper');
    const resetBtn = document.getElementById('reset-exam-btn');

    if (newMode === APP_MODES.PRACTICE) {
      if (stepper) stepper.style.display = 'none';
      if (resetBtn) resetBtn.style.display = 'none';
      this.renderPracticeMode();
    } else if (newMode === APP_MODES.CONVERSATION) {
      if (stepper) stepper.style.display = 'none';
      if (resetBtn) resetBtn.style.display = 'none';
      this.renderConversationMode();
    } else {
      if (stepper) stepper.style.display = 'flex';
      if (resetBtn) resetBtn.style.display = 'inline-flex';
      this.updateStepperUI(this.machine.currentPhase);
      this.renderView(this.machine.currentPhase, this.machine.session);
    }
  }

  renderPracticeMode() {
    if (this.activeViewInstance && typeof this.activeViewInstance.destroy === 'function') {
      this.activeViewInstance.destroy();
    }

    const container = document.getElementById('view-viewport');
    if (!container) return;
    container.innerHTML = '';

    this.activeViewInstance = new PracticeView({
      audioRecorder: this.audioRecorder,
      speechRecognizer: this.speechRecognizer,
      voiceSynthesizer: this.voiceSynthesizer
    });
    container.appendChild(this.activeViewInstance.render());
  }

  renderConversationMode() {
    if (this.activeViewInstance && typeof this.activeViewInstance.destroy === 'function') {
      this.activeViewInstance.destroy();
    }

    const container = document.getElementById('view-viewport');
    if (!container) return;
    container.innerHTML = '';

    this.activeViewInstance = new ConversationView({
      audioRecorder: this.audioRecorder,
      speechRecognizer: this.speechRecognizer,
      voiceSynthesizer: this.voiceSynthesizer
    });
    container.appendChild(this.activeViewInstance.render());
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
