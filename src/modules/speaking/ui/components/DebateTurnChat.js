/**
 * DebateTurnChat: Interactive turn-taking UI for the AI Examiner debate phase with i18n
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export function renderDebateTurnChat({ turnIndex, maxTurns = 3, questionText, isExaminerSpeaking = false, onReplayQuestion = null }) {
  const container = document.createElement('div');
  container.className = 'chat-stream';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="badge badge-primary">${i18n.t('debate.badge')} - ${i18n.t('debate.turn_prefix')} ${turnIndex} / ${maxTurns}</span>
        <span class="examiner-status-badge badge ${isExaminerSpeaking ? 'badge-warning' : 'badge-success'}">
          ${isExaminerSpeaking ? i18n.t('debate.examiner_speaking') : i18n.t('debate.candidate_turn')}
        </span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button class="btn btn-secondary replay-btn" style="padding: 0.25rem 0.625rem; font-size: var(--text-xs);">
          ${i18n.t('debate.replay_btn')}
        </button>
        <button class="btn btn-secondary toggle-caption-btn" style="padding: 0.25rem 0.625rem; font-size: var(--text-xs);">
          ${i18n.t('debate.toggle_caption')}
        </button>
      </div>
    </div>

    <!-- Examiner Chat Bubble -->
    <div class="chat-bubble chat-bubble-examiner">
      <div class="avatar-badge avatar-examiner">EX</div>
      <div style="flex: 1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <strong style="font-size: var(--text-sm); color: #93c5fd;">${i18n.t('debate.examiner_title')}</strong>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">${i18n.t('debate.examiner_role')}</span>
        </div>
        <div class="examiner-question-text" style="font-size: var(--text-base); line-height: 1.6; color: var(--text-primary); transition: all 0.2s;">
          ${questionText}
        </div>
      </div>
    </div>
  `;

  const questionElem = container.querySelector('.examiner-question-text');
  let isCaptionsVisible = true;

  container.querySelector('.toggle-caption-btn')?.addEventListener('click', () => {
    isCaptionsVisible = !isCaptionsVisible;
    if (questionElem) {
      questionElem.style.filter = isCaptionsVisible ? 'none' : 'blur(8px)';
      questionElem.style.userSelect = isCaptionsVisible ? 'auto' : 'none';
    }
  });

  container.querySelector('.replay-btn')?.addEventListener('click', () => {
    if (onReplayQuestion) onReplayQuestion(questionText);
  });

  return container;
}
