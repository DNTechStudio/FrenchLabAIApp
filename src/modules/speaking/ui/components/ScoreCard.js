/**
 * ScoreCard: Renders the official 25-Point DELF B2 Score Grid with i18n
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export function renderScoreCard(evaluationReport) {
  const container = document.createElement('div');
  container.className = 'glass-panel';

  const { isPassing, scoreBreakdown } = evaluationReport;
  const { monologue, debat, linguistic } = scoreBreakdown;

  const monoPercent = Math.round((monologue.subtotal / 9.0) * 100);
  const debatPercent = Math.round((debat.subtotal / 6.0) * 100);
  const lexiquePercent = Math.round((linguistic.lexique / 4.0) * 100);
  const morphoPercent = Math.round((linguistic.morphosyntaxe / 5.0) * 100);
  const phonoPercent = Math.round((linguistic.phonologie / 1.0) * 100);

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
      <h3 style="font-size: var(--text-lg); display: flex; align-items: center; gap: 0.5rem;">
        ${i18n.t('report.grid_title')}
      </h3>
      <span class="badge ${isPassing ? 'badge-success' : 'badge-danger'}" style="font-size: var(--text-xs); padding: 0.375rem 0.875rem;">
        ${isPassing ? i18n.t('report.pass_badge') : i18n.t('report.fail_badge')}
      </span>
    </div>

    <div class="score-pill-box">
      <!-- 1. Monologue -->
      <div class="score-metric-card">
        <div class="score-metric-header">
          <span style="font-size: var(--text-xs); font-weight: 700; color: #93c5fd;">${i18n.t('report.part1_mono')}</span>
          <strong style="font-family: var(--font-family-mono); color: var(--text-primary);">${monologue.subtotal} / 9</strong>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${monoPercent}%;"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          Problématique (${monologue.presentationProblematique}/3) • Arguments (${monologue.argumentationExemples}/3) • Structure (${monologue.coherenceOrganisation}/3)
        </div>
      </div>

      <!-- 2. Débat -->
      <div class="score-metric-card">
        <div class="score-metric-header">
          <span style="font-size: var(--text-xs); font-weight: 700; color: #818cf8;">${i18n.t('report.part2_debat')}</span>
          <strong style="font-family: var(--font-family-mono); color: var(--text-primary);">${debat.subtotal} / 6</strong>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${debatPercent}%; background: linear-gradient(90deg, #6366f1, #a855f7);"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          Défense (${debat.defensePointDeVue}/3) • Réactivité (${debat.reactiviteInteraction}/3)
        </div>
      </div>

      <!-- 3. Lexique -->
      <div class="score-metric-card">
        <div class="score-metric-header">
          <span style="font-size: var(--text-xs); font-weight: 700; color: #34d399;">${i18n.t('report.lexique_title')}</span>
          <strong style="font-family: var(--font-family-mono); color: var(--text-primary);">${linguistic.lexique} / 4</strong>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${lexiquePercent}%; background: linear-gradient(90deg, #10b981, #059669);"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          Étendue lexicale et précision
        </div>
      </div>

      <!-- 4. Grammaire -->
      <div class="score-metric-card">
        <div class="score-metric-header">
          <span style="font-size: var(--text-xs); font-weight: 700; color: #f472b6;">${i18n.t('report.morpho_title')}</span>
          <strong style="font-family: var(--font-family-mono); color: var(--text-primary);">${linguistic.morphosyntaxe} / 5</strong>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${morphoPercent}%; background: linear-gradient(90deg, #ec4899, #f43f5e);"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          Complexité des phrases et syntaxe
        </div>
      </div>

      <!-- 5. Phonologie -->
      <div class="score-metric-card">
        <div class="score-metric-header">
          <span style="font-size: var(--text-xs); font-weight: 700; color: #fbbf24;">${i18n.t('report.phono_title')}</span>
          <strong style="font-family: var(--font-family-mono); color: var(--text-primary);">${linguistic.phonologie} / 1</strong>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width: ${phonoPercent}%; background: linear-gradient(90deg, #f59e0b, #d97706);"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          Intonation, prononciation et fluidité
        </div>
      </div>
    </div>
  `;

  return container;
}
