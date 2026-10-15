/**
 * ExamFlowStateMachine: Orchestrates the stages of the DELF B2 Oral Examination
 */

import { ExamPhases } from '../types/index.js';

export class ExamFlowStateMachine {
  constructor({ sessionRepository, onPhaseChange = null } = {}) {
    this.repo = sessionRepository;
    this.onPhaseChange = onPhaseChange;
    this.currentPhase = ExamPhases.SELECTION;
    this.session = null;
  }

  initSession(triggerDocument) {
    this.session = {
      id: 'session-' + Date.now(),
      createdAt: Date.now(),
      phase: ExamPhases.PREPARATION,
      triggerDocument,
      scratchpad: {
        rawNotes: '',
        introduction: '',
        problematique: '',
        plan: ['', ''],
        arguments: ['', '', ''],
        conclusion: ''
      },
      monologue: {
        audioKey: null,
        durationSeconds: 0,
        transcript: '',
        thesis: '',
        arguments: []
      },
      debateTurns: [],
      currentDebateTurnIndex: 0,
      evaluationReport: null
    };

    this.transitionTo(ExamPhases.PREPARATION);
    if (this.repo) this.repo.saveActiveSession(this.session);
    return this.session;
  }

  restoreSession(savedSession) {
    if (!savedSession) return false;
    this.session = savedSession;
    this.currentPhase = savedSession.phase || ExamPhases.SELECTION;
    if (this.onPhaseChange) this.onPhaseChange(this.currentPhase, this.session);
    return true;
  }

  transitionTo(nextPhase) {
    this.currentPhase = nextPhase;
    if (this.session) {
      this.session.phase = nextPhase;
      if (this.repo) this.repo.saveActiveSession(this.session);
    }
    if (this.onPhaseChange) {
      this.onPhaseChange(this.currentPhase, this.session);
    }
  }

  updateScratchpad(notesUpdate) {
    if (!this.session) return;
    this.session.scratchpad = { ...this.session.scratchpad, ...notesUpdate };
    if (this.repo) this.repo.saveActiveSession(this.session);
  }

  recordMonologueResult({ audioKey, durationSeconds, transcript }) {
    if (!this.session) return;
    this.session.monologue.audioKey = audioKey;
    this.session.monologue.durationSeconds = durationSeconds;
    this.session.monologue.transcript = transcript;
    if (this.repo) this.repo.saveActiveSession(this.session);
  }

  addDebateTurn(turn) {
    if (!this.session) return;
    this.session.debateTurns.push(turn);
    this.session.currentDebateTurnIndex = this.session.debateTurns.length;
    if (this.repo) this.repo.saveActiveSession(this.session);
  }

  setEvaluationReport(report) {
    if (!this.session) return;
    this.session.evaluationReport = report;
    if (this.repo) {
      this.repo.saveActiveSession(this.session);
      this.repo.saveCompletedSessionToHistory(this.session);
    }
    this.transitionTo(ExamPhases.REPORT);
  }
}
