/**
 * ScratchpadDrawer: Structured digital note-taking scratchpad with i18n support
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export class ScratchpadDrawer {
  constructor(initialData = {}, { onUpdate = null } = {}) {
    this.data = {
      rawNotes: initialData.rawNotes || '',
      introduction: initialData.introduction || '',
      problematique: initialData.problematique || '',
      planPart1: initialData.plan?.[0] || '',
      planPart2: initialData.plan?.[1] || '',
      arguments: initialData.arguments?.join('\n') || '',
      conclusion: initialData.conclusion || ''
    };
    this.onUpdate = onUpdate;
    this.activeTab = 'intro';
    this.debounceTimer = null;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'glass-panel scratchpad-container';

    container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-size: var(--text-base); display: flex; align-items: center; gap: 0.5rem;">
          ${i18n.t('prep.scratchpad_title')}
        </h3>
        <span class="save-indicator badge badge-success" style="font-size: 0.65rem;">
          ${i18n.t('prep.saved')}
        </span>
      </div>

      <div class="scratchpad-tabs">
        <button class="scratchpad-tab-btn ${this.activeTab === 'intro' ? 'active' : ''}" data-tab="intro">
          ${i18n.t('prep.tab_intro')}
        </button>
        <button class="scratchpad-tab-btn ${this.activeTab === 'plan' ? 'active' : ''}" data-tab="plan">
          ${i18n.t('prep.tab_plan')}
        </button>
        <button class="scratchpad-tab-btn ${this.activeTab === 'args' ? 'active' : ''}" data-tab="args">
          ${i18n.t('prep.tab_args')}
        </button>
        <button class="scratchpad-tab-btn ${this.activeTab === 'concl' ? 'active' : ''}" data-tab="concl">
          ${i18n.t('prep.tab_concl')}
        </button>
        <button class="scratchpad-tab-btn ${this.activeTab === 'free' ? 'active' : ''}" data-tab="free">
          ${i18n.t('prep.tab_free')}
        </button>
      </div>

      <div class="tab-content-area" style="flex: 1; display: flex; flex-direction: column;">
        <!-- Tab content injected dynamically -->
      </div>
    `;

    this.attachEvents(container);
    this.renderActiveTab(container);
    return container;
  }

  renderActiveTab(container) {
    const contentArea = container.querySelector('.tab-content-area');
    if (!contentArea) return;

    if (this.activeTab === 'intro') {
      contentArea.innerHTML = `
        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.intro_label')}
        </label>
        <textarea class="scratchpad-textarea intro-input" style="min-height: 80px; margin-bottom: 0.75rem;" placeholder="Ex: De nos jours, la question de...">${this.data.introduction}</textarea>
        
        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.prob_label')}
        </label>
        <textarea class="scratchpad-textarea prob-input" style="min-height: 80px;" placeholder="Ex: Dans quelle mesure peut-on affirmer que... ?">${this.data.problematique}</textarea>
      `;
    } else if (this.activeTab === 'plan') {
      contentArea.innerHTML = `
        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.plan1_label')}
        </label>
        <textarea class="scratchpad-textarea plan1-input" style="min-height: 80px; margin-bottom: 0.75rem;" placeholder="D'une part, force est de constater que...">${this.data.planPart1}</textarea>

        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.plan2_label')}
        </label>
        <textarea class="scratchpad-textarea plan2-input" style="min-height: 80px;" placeholder="D'autre part, il ne faut pas sous-estimer les limites de...">${this.data.planPart2}</textarea>
      `;
    } else if (this.activeTab === 'args') {
      contentArea.innerHTML = `
        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.args_label')}
        </label>
        <textarea class="scratchpad-textarea args-input" style="flex: 1; min-height: 180px;" placeholder="- Argument 1 : ...\n  Exemple : ...\n- Argument 2 : ...\n  Exemple : ...">${this.data.arguments}</textarea>
      `;
    } else if (this.activeTab === 'concl') {
      contentArea.innerHTML = `
        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.concl_label')}
        </label>
        <textarea class="scratchpad-textarea concl-input" style="flex: 1; min-height: 180px;" placeholder="En conclusion, bien que... je préconise...">${this.data.conclusion}</textarea>
      `;
    } else {
      contentArea.innerHTML = `
        <label style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 0.25rem;">
          ${i18n.t('prep.free_label')}
        </label>
        <textarea class="scratchpad-textarea free-input" style="flex: 1; min-height: 180px;" placeholder="Mots-clés, connecteurs logiques...">${this.data.rawNotes}</textarea>
      `;
    }

    this.bindInputs(container);
  }

  attachEvents(container) {
    container.querySelectorAll('.scratchpad-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        container.querySelectorAll('.scratchpad-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeTab = e.currentTarget.dataset.tab;
        this.renderActiveTab(container);
      });
    });
  }

  bindInputs(container) {
    const inputs = container.querySelectorAll('textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.triggerSave(container);
      });
    });
  }

  triggerSave(container) {
    const indicator = container.querySelector('.save-indicator');
    if (indicator) {
      indicator.textContent = i18n.t('prep.saving');
      indicator.className = 'save-indicator badge badge-warning';
    }

    const intro = container.querySelector('.intro-input')?.value;
    const prob = container.querySelector('.prob-input')?.value;
    const plan1 = container.querySelector('.plan1-input')?.value;
    const plan2 = container.querySelector('.plan2-input')?.value;
    const args = container.querySelector('.args-input')?.value;
    const concl = container.querySelector('.concl-input')?.value;
    const free = container.querySelector('.free-input')?.value;

    if (intro !== undefined) this.data.introduction = intro;
    if (prob !== undefined) this.data.problematique = prob;
    if (plan1 !== undefined) this.data.planPart1 = plan1;
    if (plan2 !== undefined) this.data.planPart2 = plan2;
    if (args !== undefined) this.data.arguments = args;
    if (concl !== undefined) this.data.conclusion = concl;
    if (free !== undefined) this.data.rawNotes = free;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (indicator) {
        indicator.textContent = i18n.t('prep.saved');
        indicator.className = 'save-indicator badge badge-success';
      }
      if (this.onUpdate) {
        this.onUpdate({
          rawNotes: this.data.rawNotes,
          introduction: this.data.introduction,
          problematique: this.data.problematique,
          plan: [this.data.planPart1, this.data.planPart2],
          arguments: this.data.arguments.split('\n').filter(Boolean),
          conclusion: this.data.conclusion
        });
      }
    }, 400);
  }
}
