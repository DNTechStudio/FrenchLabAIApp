/**
 * ReportView: Official DELF B2 25-Point Diagnostic Scorecard and Pedagogical Feedback
 */

import { i18n } from '../../core/i18n/I18nManager.js';
import { renderScoreCard } from '../components/ScoreCard.js';
import { renderTranscriptAnnotator } from '../components/TranscriptAnnotator.js';

export class ReportView {
  constructor({ session, onRestartSameTopic, onNewExam }) {
    this.session = session;
    this.report = session.evaluationReport;
    this.onRestartSameTopic = onRestartSameTopic;
    this.onNewExam = onNewExam;
  }

  render() {
    const view = document.createElement('div');
    view.className = 'view-container';

    const currentLocale = i18n.getLocale();
    const { totalScore, isPassing, lexicalRecommendations, qualitativeSynthesis } = this.report;

    view.innerHTML = `
      <!-- Hero Header -->
      <div class="glass-panel report-hero-header">
        <div>
          <span class="badge badge-primary" style="margin-bottom: 0.5rem;">${i18n.t('report.badge')}</span>
          <h1 style="font-size: var(--text-2xl); margin-bottom: 0.25rem;">
            ${i18n.t('report.diploma_title')}
          </h1>
          <div style="font-size: var(--text-sm); color: var(--text-muted);">
            ${i18n.t('report.exam_info')} • ${i18n.t('monologue.subject_prefix')} « ${this.session.triggerDocument?.title || 'Document DELF'} »
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;">
          <div class="report-total-score-badge">
            <span class="report-score-number">${totalScore}</span>
            <span class="report-score-max">${i18n.t('report.score_out_of')}</span>
            <span class="badge ${isPassing ? 'badge-success' : 'badge-danger'}" style="margin-top: 0.5rem; font-size: 0.65rem;">
              ${isPassing ? i18n.t('report.admitted') : i18n.t('report.not_admitted')}
            </span>
          </div>

          <div class="report-actions" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn btn-primary print-report-btn">
              ${i18n.t('report.print_btn')}
            </button>
            <button class="btn btn-secondary restart-doc-btn">
              ${i18n.t('report.retry_btn')}
            </button>
            <button class="btn btn-secondary new-exam-btn">
              ${i18n.t('report.new_btn')}
            </button>
          </div>
        </div>
      </div>

      <!-- ScoreCard Slot -->
      <div class="scorecard-slot">
        <!-- Rendered ScoreCard -->
      </div>

      <!-- Qualitative Feedback & Action Plan -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
        <!-- Strengths & Weaknesses -->
        <div class="glass-panel">
          <h3 style="font-size: var(--text-base); margin-bottom: 1rem; color: #93c5fd;">
            ${i18n.t('report.qualitative_title')}
          </h3>
          <div style="margin-bottom: 1rem;">
            <div style="font-size: var(--text-xs); font-weight: 700; color: #6ee7b7; text-transform: uppercase; margin-bottom: 0.375rem;">
              ${i18n.t('report.strengths_title')}
            </div>
            <ul style="padding-left: 1.25rem; font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">
              ${(qualitativeSynthesis?.strengths || []).map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>

          <div>
            <div style="font-size: var(--text-xs); font-weight: 700; color: #fca5a5; text-transform: uppercase; margin-bottom: 0.375rem;">
              ${i18n.t('report.weaknesses_title')}
            </div>
            <ul style="padding-left: 1.25rem; font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">
              ${(qualitativeSynthesis?.weaknesses || []).map(w => `<li>${w}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Connecteurs logiques B2/C1 -->
        <div class="glass-panel">
          <h3 style="font-size: var(--text-base); margin-bottom: 1rem; color: #a78bfa;">
            ${i18n.t('report.connectors_title')}
          </h3>
          <p style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.75rem;">
            ${i18n.t('report.connectors_desc')}
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
            ${(lexicalRecommendations || []).map(con => {
              const french = typeof con === 'string' ? con : con.french;
              const translation = typeof con === 'object' ? (con[currentLocale] || con.en || '') : '';
              return `
                <span class="badge" style="background: rgba(167, 139, 250, 0.15); color: #c4b5fd; border: 1px solid rgba(167, 139, 250, 0.3); font-size: var(--text-xs); padding: 0.35rem 0.65rem;">
                  + <strong>${french}</strong> ${translation ? `<span style="opacity: 0.8; font-size: 0.75rem; margin-left: 0.25rem;">(${translation})</span>` : ''}
                </span>
              `;
            }).join('')}
          </div>

          <div style="font-size: var(--text-xs); font-weight: 700; color: #fbbf24; text-transform: uppercase; margin-bottom: 0.375rem;">
            ${i18n.t('report.action_plan_title')}
          </div>
          <ol style="padding-left: 1.25rem; font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">
            ${(qualitativeSynthesis?.actionPlan || []).map(a => `<li>${a}</li>`).join('')}
          </ol>
        </div>
      </div>

      <!-- Verbatim Transcript & Annotations -->
      <div class="transcript-slot">
        <!-- Rendered Transcript -->
      </div>
    `;

    // Render ScoreCard
    const scoreSlot = view.querySelector('.scorecard-slot');
    if (scoreSlot) {
      scoreSlot.appendChild(renderScoreCard(this.report));
    }

    // Render Transcript Annotator
    const transSlot = view.querySelector('.transcript-slot');
    if (transSlot) {
      transSlot.appendChild(renderTranscriptAnnotator({
        monologueTranscript: this.session.monologue?.transcript,
        debateTurns: this.session.debateTurns || [],
        linguisticErrors: this.report.linguisticErrors || []
      }));
    }

    // Event listeners
    view.querySelector('.print-report-btn')?.addEventListener('click', () => {
      window.print();
    });

    view.querySelector('.restart-doc-btn')?.addEventListener('click', () => {
      this.onRestartSameTopic();
    });

    view.querySelector('.new-exam-btn')?.addEventListener('click', () => {
      this.onNewExam();
    });

    return view;
  }
}
