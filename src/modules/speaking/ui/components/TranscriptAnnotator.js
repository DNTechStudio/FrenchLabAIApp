/**
 * TranscriptAnnotator: Displays verbatim transcript with interactive error correction highlights and i18n
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export function renderTranscriptAnnotator({ monologueTranscript, debateTurns = [], linguisticErrors = [] }) {
  const container = document.createElement('div');
  container.className = 'glass-panel';

  let annotatedMonologue = monologueTranscript || '(Aucun enregistrement disponible)';

  linguisticErrors.forEach(err => {
    if (err.originalSnippet) {
      const regex = new RegExp(`(${err.originalSnippet})`, 'gi');
      annotatedMonologue = annotatedMonologue.replace(
        regex,
        `<mark style="background: rgba(239, 68, 68, 0.25); color: #fca5a5; padding: 2px 6px; border-radius: 4px; border-bottom: 2px solid #ef4444; font-weight: 600;" title="${err.explanation}">$1</mark>`
      );
    }
  });

  container.innerHTML = `
    <h3 style="font-size: var(--text-lg); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
      ${i18n.t('report.transcript_title')}
    </h3>

    <!-- Monologue Section -->
    <div style="margin-bottom: 1.5rem;">
      <div style="font-size: var(--text-xs); font-weight: 700; color: #93c5fd; text-transform: uppercase; margin-bottom: 0.5rem;">
        ${i18n.t('report.part1_mono')}
      </div>
      <div style="background: rgba(10, 14, 23, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.25rem; font-size: var(--text-sm); line-height: 1.8; color: var(--text-secondary);">
        ${annotatedMonologue}
      </div>
    </div>

    <!-- Debate Section -->
    ${debateTurns.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <div style="font-size: var(--text-xs); font-weight: 700; color: #818cf8; text-transform: uppercase; margin-bottom: 0.5rem;">
          ${i18n.t('report.part2_debat')}
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${debateTurns.map((turn, i) => `
            <div style="background: rgba(10, 14, 23, 0.4); border-left: 3px solid #6366f1; padding: 0.75rem 1rem; border-radius: 0 var(--radius-md) var(--radius-md) 0;">
              <div style="font-size: var(--text-xs); color: #93c5fd; font-weight: 600; margin-bottom: 0.25rem;">
                Question ${i + 1} : ${turn.examinerQuestionText || ''}
              </div>
              <div style="font-size: var(--text-sm); color: var(--text-primary); line-height: 1.6;">
                Réponse : ${turn.candidateTranscript || ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Detected Errors List -->
    ${linguisticErrors.length > 0 ? `
      <div>
        <div style="font-size: var(--text-xs); font-weight: 700; color: #f87171; text-transform: uppercase; margin-bottom: 0.75rem;">
          ${i18n.t('report.errors_title')} (${linguisticErrors.length})
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 0.75rem;">
          ${linguisticErrors.map(err => {
            const currentLocale = i18n.getLocale();
            const explanation = (err.localizations && err.localizations[currentLocale]) || err.explanation;
            return `
              <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md); padding: 0.875rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                  <span style="font-size: var(--text-xs); color: #fca5a5; text-decoration: line-through;">« ${err.originalSnippet} »</span>
                  <span style="font-size: var(--text-xs); font-weight: 700; color: #6ee7b7;">➔ « ${err.suggestedCorrection} »</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.4;">
                  ${explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : `
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 0.875rem; color: #6ee7b7; font-size: var(--text-sm);">
        ${i18n.t('report.no_errors')}
      </div>
    `}
  `;

  return container;
}
