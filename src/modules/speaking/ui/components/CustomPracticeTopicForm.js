/**
 * CustomPracticeTopicForm: Inline expandable component for defining custom practice oral prompts
 */

import { validateCustomPracticePrompt } from '../../data/practice/customPracticeStorage.js';
import { TopicIdeaGenerator } from '../../core/practice/TopicIdeaGenerator.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export const PRACTICE_CATEGORIES = [
  'Société & Culture',
  'Travail & Nouveaux Modes de Vie',
  'Éducation & Formation',
  'Environnement & Écologie',
  'Santé & Bien-être',
  'Nouvelles Technologies & IA',
  'Loisirs & Tourisme'
];

export class CustomPracticeTopicForm {
  constructor({ onSubmit = null, onCancel = null, onOpenChange = null, initialData = {} } = {}) {
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.onOpenChange = onOpenChange;
    this.selectedCategory = initialData.category || PRACTICE_CATEGORIES[0];
    this.isOpen = false;
    this.container = null;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = `custom-practice-expandable ${this.isOpen ? 'open' : ''}`;

    this.container.innerHTML = `
      <div class="custom-practice-form-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
          <div>
            <span class="badge badge-accent" style="margin-bottom: 0.35rem; display: inline-block;">
              ✍️ ${i18n.t('practice.custom_form_badge') || 'Sujet d’Entraînement Personnalisé'}
            </span>
            <h2 style="font-size: var(--text-lg); font-weight: 700; color: #ffffff; margin: 0 0 0.25rem 0;">
              ${i18n.t('practice.custom_form_heading') || 'Rédiger votre propre sujet d’entraînement'}
            </h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">
              ${i18n.t('practice.custom_form_desc') || 'Définissez votre propre question de débat pour pratiquer l’oral et élever votre discours avec l’IA.'}
            </p>
          </div>
          <button type="button" class="btn btn-secondary close-practice-form-btn" style="padding: 0.35rem 0.75rem; font-size: var(--text-xs); border-radius: var(--radius-full);">
            ✕ ${i18n.t('practice.custom_cancel_btn') || 'Annuler'}
          </button>
        </div>

        <!-- AI Draft Assistant Banner -->
        <div class="custom-practice-ai-panel" style="background: rgba(124, 58, 237, 0.12); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: var(--radius-lg); padding: 0.85rem 1rem; margin-bottom: 0.75rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.5rem;">
            <label style="font-size: var(--text-xs); font-weight: 700; color: #d8b4fe; display: flex; align-items: center; gap: 0.35rem; margin: 0;">
              💡 ${i18n.t('practice.ai_draft_label') || 'Votre idée brute (en français, tiếng Việt, English...)'}
            </label>
            <span style="font-size: 0.7rem; color: #a78bfa;">
              ${i18n.t('practice.ai_draft_hint') || 'L’IA rédigera et structurera automatiquement votre sujet en français'}
            </span>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: stretch;">
            <input type="text" class="input practice-draft-input" 
                   placeholder="${i18n.t('practice.ai_draft_placeholder') || 'ex: trí tuệ nhân tạo trong giáo dục / remote work impact on jobs'}" 
                   style="flex: 1; font-size: var(--text-xs); background: rgba(15, 23, 42, 0.6); border-color: rgba(168, 85, 247, 0.3);" />
            <button type="button" class="btn btn-primary ai-generate-topic-btn" 
                    style="white-space: nowrap; padding: 0.45rem 1.1rem; font-size: var(--text-xs); font-weight: 700; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; box-shadow: 0 0 12px rgba(99, 102, 241, 0.35); cursor: pointer;">
              ✨ ${i18n.t('practice.ai_generate_btn') || 'Améliorer avec l’IA'}
            </button>
          </div>
        </div>

        <form class="custom-practice-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 1rem;">
          <!-- Titre & Catégorie -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #c4b5fd; margin-bottom: 0.35rem;">
                ${i18n.t('practice.custom_title_label') || 'Titre du sujet'} <span style="color: #f87171;">*</span>
              </label>
              <input type="text" name="practice-title" class="input practice-title-input" 
                     placeholder="${i18n.t('practice.custom_title_placeholder') || 'ex: L’impact des podcasts sur l’expression orale'}" 
                     style="width: 100%; font-size: var(--text-sm);" />
              <div class="field-error-hint title-error" style="color: #fca5a5; font-size: 0.7rem; margin-top: 0.25rem; display: none;"></div>
            </div>

            <div>
              <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #c4b5fd; margin-bottom: 0.35rem;">
                ${i18n.t('practice.custom_category_label') || 'Thématique'} <span style="color: #f87171;">*</span>
              </label>
              <div class="category-chips-group">
                ${PRACTICE_CATEGORIES.map(cat => `
                  <button type="button" class="category-chip-btn ${cat === this.selectedCategory ? 'active' : ''}" data-cat="${cat}">
                    ${cat}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Description / Pistes de réflexion -->
          <div>
            <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #c4b5fd; margin-bottom: 0.35rem;">
              ${i18n.t('practice.custom_desc_label') || 'Contexte et questions de réflexion'} <span style="color: #f87171;">*</span>
            </label>
            <textarea name="practice-desc" class="input practice-desc-textarea" rows="3" 
                      placeholder="${i18n.t('practice.custom_desc_placeholder') || 'Partagez votre point de vue et vos arguments sur ce thème (au moins 10 caractères)...'}" 
                      style="width: 100%; font-size: var(--text-sm); line-height: 1.5; resize: vertical;"></textarea>
            <div class="field-error-hint desc-error" style="color: #fca5a5; font-size: 0.7rem; margin-top: 0.25rem; display: none;"></div>
          </div>

          <!-- Amorce suggérée -->
          <div>
            <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #c4b5fd; margin-bottom: 0.35rem;">
              ${i18n.t('practice.custom_starter_label') || 'Amorce suggérée (optionnel)'}
            </label>
            <input type="text" name="practice-starter" class="input practice-starter-input" 
                   placeholder="${i18n.t('practice.custom_starter_placeholder') || 'ex: Selon mon expérience personnelle avec les langues étrangère, ...'}" 
                   style="width: 100%; font-size: var(--text-sm);" />
          </div>

          <!-- Actions -->
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem;">
            <button type="button" class="btn btn-secondary cancel-practice-bottom-btn" style="padding: 0.5rem 1.25rem; font-size: var(--text-xs);">
              ${i18n.t('practice.custom_cancel_btn') || 'Annuler'}
            </button>
            <button type="button" class="btn btn-primary apply-practice-topic-btn" style="padding: 0.5rem 1.5rem; font-size: var(--text-xs); font-weight: 600; box-shadow: 0 0 15px rgba(168, 85, 247, 0.4); background: linear-gradient(135deg, #7c3aed, #9333ea);">
              🚀 ${i18n.t('practice.custom_apply_btn') || 'Appliquer ce sujet'}
            </button>
          </div>
        </form>
      </div>
    `;

    this.bindEvents();
    return this.container;
  }

  bindEvents() {
    if (!this.container) return;

    const titleInput = this.container.querySelector('.practice-title-input');
    const descTextarea = this.container.querySelector('.practice-desc-textarea');

    titleInput?.addEventListener('input', () => this.clearError('title'));
    descTextarea?.addEventListener('input', () => this.clearError('desc'));

    // Category chips
    this.container.querySelectorAll('.category-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.dataset.cat;
        this.container.querySelectorAll('.category-chip-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Cancel
    const handleCancel = () => {
      this.setOpen(false);
      if (this.onCancel) this.onCancel();
    };

    this.container.querySelector('.close-practice-form-btn')?.addEventListener('click', handleCancel);
    this.container.querySelector('.cancel-practice-bottom-btn')?.addEventListener('click', handleCancel);

    // Submit
    this.container.querySelector('.apply-practice-topic-btn')?.addEventListener('click', () => {
      this.handleFormSubmit();
    });

    // AI Generate / Improve with AI button
    this.container.querySelector('.ai-generate-topic-btn')?.addEventListener('click', () => {
      this.handleAIGenerate();
    });

    // Enter key in draft input also triggers AI generation
    this.container.querySelector('.practice-draft-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleAIGenerate();
      }
    });
  }

  handleAIGenerate() {
    if (!this.container) return;

    const draftInput = this.container.querySelector('.practice-draft-input');
    const aiBtn = this.container.querySelector('.ai-generate-topic-btn');
    const rawDraft = draftInput?.value || '';

    // Show loading state
    if (aiBtn) {
      aiBtn.disabled = true;
      aiBtn.textContent = `✨ ${i18n.t('practice.ai_generating') || 'Génération en cours...'}`;
    }

    try {
      const generated = TopicIdeaGenerator.generateTopicFromDraft(rawDraft);

      // Populate Title
      const titleInput = this.container.querySelector('.practice-title-input');
      if (titleInput) {
        titleInput.value = generated.title;
        this.clearError('title');
        this.triggerFieldGlow(titleInput);
      }

      // Populate Category
      this.selectedCategory = generated.category;
      this.container.querySelectorAll('.category-chip-btn').forEach(btn => {
        if (btn.dataset.cat === generated.category) {
          btn.classList.add('active');
          this.triggerFieldGlow(btn);
        } else {
          btn.classList.remove('active');
        }
      });

      // Populate Description
      const descTextarea = this.container.querySelector('.practice-desc-textarea');
      if (descTextarea) {
        descTextarea.value = generated.description;
        this.clearError('desc');
        this.triggerFieldGlow(descTextarea);
      }

      // Populate Starter sentence
      const starterInput = this.container.querySelector('.practice-starter-input');
      if (starterInput) {
        starterInput.value = generated.starterSentence;
        this.triggerFieldGlow(starterInput);
      }
    } finally {
      if (aiBtn) {
        aiBtn.disabled = false;
        aiBtn.textContent = `✨ ${i18n.t('practice.ai_generate_btn') || 'Améliorer avec l’IA'}`;
      }
    }
  }

  triggerFieldGlow(element) {
    if (!element) return;
    element.classList.remove('field-highlight-glow');
    void element.offsetWidth; // Force DOM reflow
    element.classList.add('field-highlight-glow');
    setTimeout(() => {
      element.classList.remove('field-highlight-glow');
    }, 1500);
  }

  showError(field, message) {
    if (!this.container) return;
    const errEl = this.container.querySelector(`.${field}-error`);
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    }
  }

  clearError(field) {
    if (!this.container) return;
    const errEl = this.container.querySelector(`.${field}-error`);
    if (errEl) {
      errEl.textContent = '';
      errEl.style.display = 'none';
    }
  }

  setOpen(open) {
    this.isOpen = Boolean(open);
    if (this.container) {
      if (this.isOpen) {
        this.container.classList.add('open');
        this.container.querySelector('.practice-title-input')?.focus();
      } else {
        this.container.classList.remove('open');
      }
    }
    if (typeof this.onOpenChange === 'function') {
      this.onOpenChange(this.isOpen);
    }
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  getFormData() {
    if (!this.container) return {};
    const title = this.container.querySelector('.practice-title-input')?.value || '';
    const description = this.container.querySelector('.practice-desc-textarea')?.value || '';
    const starterSentence = this.container.querySelector('.practice-starter-input')?.value || '';

    return {
      title,
      category: this.selectedCategory,
      description,
      starterSentence
    };
  }

  handleFormSubmit() {
    const data = this.getFormData();
    const validation = validateCustomPracticePrompt(data);

    if (!validation.isValid) {
      if (validation.errors.title) {
        this.showError('title', i18n.t(validation.errors.title) || 'Le titre doit contenir au moins 5 caractères.');
      }
      if (validation.errors.description) {
        this.showError('desc', i18n.t(validation.errors.description) || 'La description doit contenir au moins 10 caractères.');
      }
      return;
    }

    if (this.onSubmit) {
      this.onSubmit(data);
    }
  }
}
