/**
 * ConversationScenarioCard: Displays the active situational scenario,
 * CEFR level selector (A1-C2), participants roster (2 or 3 pers), mission objective, and scenario controls
 */

import { CEFR_LEVELS } from '../../core/practice/CefrLevelDefinitions.js';
import { CONVERSATION_CATEGORIES } from '../../data/conversation/conversationScenarios.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class ConversationScenarioCard {
  constructor({
    scenario,
    currentLevel = 'B1',
    onLevelChange = () => {},
    onRandomScenario = () => {},
    onToggleCustomForm = () => {}
  } = {}) {
    this.scenario = scenario;
    this.currentLevel = currentLevel;
    this.onLevelChange = onLevelChange;
    this.onRandomScenario = onRandomScenario;
    this.onToggleCustomForm = onToggleCustomForm;
    this.container = null;
  }

  setScenario(newScenario, level = null) {
    this.scenario = newScenario;
    if (level && CEFR_LEVELS.includes(level)) {
      this.currentLevel = level;
    }
    this.updateDOM();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'glass-panel conversation-scenario-card';
    this.container.style.marginBottom = '1.5rem';
    this.container.style.borderLeft = '4px solid var(--color-primary)';
    this.updateDOM();
    return this.container;
  }

  updateDOM() {
    if (!this.container || !this.scenario) return;

    const catObj = CONVERSATION_CATEGORIES.find(c => c.id === this.scenario.category) || {
      id: this.scenario.category,
      label: this.scenario.category,
      icon: '💬'
    };

    const is3Pers = this.scenario.participantCount === 3;
    const isCustom = Boolean(this.scenario.isCustom);

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
          <span class="badge badge-primary" style="font-size: var(--text-xs); padding: 0.25rem 0.65rem;">
            ${catObj.icon} ${catObj.label}
          </span>
          <span class="badge" style="background: ${is3Pers ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)'}; color: ${is3Pers ? '#d8b4fe' : '#93c5fd'}; border: 1px solid ${is3Pers ? 'rgba(168, 85, 247, 0.4)' : 'rgba(59, 130, 246, 0.4)'}; font-size: var(--text-xs);">
            👥 ${is3Pers ? (i18n.t('conversation.dialogue_3p') || 'Dialogue à 3') : (i18n.t('conversation.dialogue_2p') || 'Dialogue à 2')}
          </span>
          ${isCustom ? `
            <span class="badge" style="background: rgba(234, 179, 8, 0.2); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.4); font-size: var(--text-xs);">
              🎨 ${i18n.t('conversation.custom_badge') || 'Personnalisé'}
            </span>
          ` : ''}
        </div>

        <!-- CEFR Level Selector Dropdown -->
        <div style="display: flex; align-items: center; gap: 0.4rem; font-size: var(--text-xs); color: var(--text-muted);">
          <span>🎯 ${i18n.t('conversation.level_label') || 'Niveau CEFR'} :</span>
          <select class="conv-level-select" style="background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-color); border-radius: var(--radius-sm); padding: 0.25rem 0.5rem; font-weight: 700; font-size: 0.8rem; cursor: pointer;">
            ${CEFR_LEVELS.map(lvl => `
              <option value="${lvl}" ${this.currentLevel === lvl ? 'selected' : ''}>
                ${lvl}
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px;">
          <h2 style="font-size: var(--text-xl); margin-bottom: 0.35rem; color: var(--text-primary);">
            « ${this.scenario.title} »
          </h2>
          <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem;">
            ${this.scenario.context}
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary random-scenario-btn" style="padding: 0.45rem 0.85rem; font-size: var(--text-xs);">
            🎲 ${i18n.t('conversation.change_scenario') || 'Changer de scénario'}
          </button>
          <button type="button" class="btn btn-secondary custom-scenario-toggle-btn" style="padding: 0.45rem 0.85rem; font-size: var(--text-xs); border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.15); color: #d8b4fe;">
            ✏️ ${i18n.t('conversation.custom_scenario_btn') || 'Scénario personnalisé'}
          </button>
        </div>
      </div>

      <!-- Communicative Mission Objective Banner -->
      <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid #3b82f6; border-radius: var(--radius-sm); padding: 0.6rem 0.85rem; margin-bottom: 0.75rem; font-size: var(--text-xs); color: #bfdbfe;">
        <strong>🎯 ${i18n.t('conversation.objective_title') || 'Votre Mission'} :</strong> ${this.scenario.objective}
      </div>

      <!-- Characters Roster -->
      <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;">
        ${(this.scenario.characters || []).map(c => `
          <div style="display: flex; align-items: center; gap: 0.4rem; background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.35rem 0.65rem; font-size: 0.75rem;">
            <span>${c.isUser ? '🧑' : (c.voiceGender === 'female' ? '👩' : '👨')}</span>
            <div>
              <span style="font-weight: 700; color: ${c.isUser ? '#60a5fa' : '#e2e8f0'};">${c.name}</span>
              <span style="color: var(--text-muted); font-size: 0.7rem; margin-left: 0.25rem;">(${c.role || ''})</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    this.container.querySelector('.conv-level-select')?.addEventListener('change', (e) => {
      this.currentLevel = e.target.value;
      this.onLevelChange(this.currentLevel);
    });

    this.container.querySelector('.random-scenario-btn')?.addEventListener('click', () => {
      this.onRandomScenario();
    });

    this.container.querySelector('.custom-scenario-toggle-btn')?.addEventListener('click', () => {
      this.onToggleCustomForm();
    });
  }
}
