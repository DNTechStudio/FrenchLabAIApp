/**
 * CustomTopicForm: Inline expandable component for composing custom DELF B2 trigger documents
 */

import { countFrenchWords, validateCustomTopic } from '../../data/documents/customTopicsStorage.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export const DEFAULT_CATEGORIES = [
  'Société',
  'Travail & Nouveaux Modes de Vie',
  'Éducation',
  'Écologie & Consommation Durable',
  'Santé & Bien-être',
  'Nouvelles Technologies & IA',
  'Culture & Loisirs'
];

export class CustomTopicForm {
  constructor({ onSubmit = null, onCancel = null, initialData = {} } = {}) {
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.selectedCategory = initialData.category || DEFAULT_CATEGORIES[0];
    this.isOpen = false;
    this.container = null;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = `custom-topic-expandable ${this.isOpen ? 'open' : ''}`;

    this.container.innerHTML = `
      <div class="custom-topic-form-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
          <div>
            <span class="badge badge-accent" style="margin-bottom: 0.35rem; display: inline-block;">
              ✍️ ${i18n.t('custom_topic.badge') || 'Sujet d’Examen Personnalisé'}
            </span>
            <h2 style="font-size: var(--text-xl); font-weight: 700; color: #ffffff; margin: 0 0 0.25rem 0;">
              ${i18n.t('custom_topic.heading') || 'Rédiger ou coller votre propre sujet'}
            </h2>
            <p style="font-size: var(--text-xs); color: var(--text-muted); margin: 0;">
              ${i18n.t('custom_topic.desc') || 'Définissez votre article déclencheur pour simuler l’épreuve sur un thème d’actualité de votre choix.'}
            </p>
          </div>
          <button type="button" class="btn btn-secondary close-form-btn" style="padding: 0.35rem 0.75rem; font-size: var(--text-xs); border-radius: var(--radius-full);">
            ✕ ${i18n.t('custom_topic.cancel_btn') || 'Annuler'}
          </button>
        </div>

        <form class="custom-topic-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 1.25rem;">
          <!-- Top Row: Titre & Catégorie -->
          <div class="custom-topic-form-grid">
            <div>
              <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #93c5fd; margin-bottom: 0.35rem;">
                ${i18n.t('custom_topic.title_label') || 'Titre du document'} <span style="color: #f87171;">*</span>
              </label>
              <input type="text" name="topic-title" class="input topic-title-input" 
                     placeholder="${i18n.t('custom_topic.title_placeholder') || 'ex: La semaine de 4 jours : utopie ou nécessité ?'}" 
                     style="width: 100%; font-size: var(--text-sm);" />
              <div class="field-error-hint title-error" style="color: #fca5a5; font-size: 0.7rem; margin-top: 0.25rem; display: none;"></div>
            </div>

            <div>
              <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #93c5fd; margin-bottom: 0.35rem;">
                ${i18n.t('custom_topic.category_label') || 'Thématique'} <span style="color: #f87171;">*</span>
              </label>
              <div class="category-chips-group">
                ${DEFAULT_CATEGORIES.map(cat => `
                  <button type="button" class="category-chip-btn ${cat === this.selectedCategory ? 'active' : ''}" data-cat="${cat}">
                    ${cat}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Middle Row: Source & Problématique -->
          <div class="custom-topic-form-grid">
            <div>
              <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #93c5fd; margin-bottom: 0.35rem;">
                ${i18n.t('custom_topic.source_label') || 'Source et date (optionnel)'}
              </label>
              <input type="text" name="topic-source" class="input topic-source-input" 
                     placeholder="${i18n.t('custom_topic.source_placeholder') || 'ex: Le Monde, Octobre 2026'}" 
                     style="width: 100%; font-size: var(--text-sm);" />
            </div>

            <div>
              <label style="display: block; font-size: var(--text-xs); font-weight: 600; color: #93c5fd; margin-bottom: 0.35rem;">
                ${i18n.t('custom_topic.problematique_label') || 'Problématique ou question de débat'}
              </label>
              <input type="text" name="topic-problematique" class="input topic-problematique-input" 
                     placeholder="${i18n.t('custom_topic.problematique_placeholder') || 'ex: Faut-il généraliser la semaine de 4 jours sans perte de salaire ?'}" 
                     style="width: 100%; font-size: var(--text-sm);" />
            </div>
          </div>

          <!-- Article Text Area & Live Word Counter -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <label style="font-size: var(--text-xs); font-weight: 600; color: #93c5fd;">
                ${i18n.t('custom_topic.content_label') || 'Texte déclencheur (Article)'} <span style="color: #f87171;">*</span>
              </label>
              <span class="word-count-badge warning topic-word-counter">
                ⚠️ 0 ${i18n.t('custom_topic.words_count') || 'mots'} (min. 30)
              </span>
            </div>
            <textarea name="topic-content" class="input topic-content-textarea" rows="6" 
                      placeholder="${i18n.t('custom_topic.content_placeholder') || 'Collez ou rédigez ici votre article déclencheur (idéalement 150 à 250 mots)...'}" 
                      style="width: 100%; font-size: var(--text-sm); line-height: 1.6; resize: vertical;"></textarea>
            <div class="field-error-hint content-error" style="color: #fca5a5; font-size: 0.7rem; margin-top: 0.25rem; display: none;"></div>
          </div>

          <!-- Bottom Actions -->
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1rem;">
            <button type="button" class="btn btn-secondary cancel-bottom-btn" style="padding: 0.625rem 1.25rem; font-size: var(--text-sm);">
              ${i18n.t('custom_topic.cancel_btn') || 'Annuler'}
            </button>
            <button type="button" class="btn btn-primary submit-topic-btn" style="padding: 0.625rem 1.75rem; font-size: var(--text-sm); font-weight: 600; box-shadow: var(--shadow-glow);">
              🚀 ${i18n.t('custom_topic.start_btn') || 'Démarrer l’épreuve avec ce sujet'}
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

    const textarea = this.container.querySelector('.topic-content-textarea');
    const wordBadge = this.container.querySelector('.topic-word-counter');
    const titleInput = this.container.querySelector('.topic-title-input');
    const sourceInput = this.container.querySelector('.topic-source-input');
    const probInput = this.container.querySelector('.topic-problematique-input');

    // Real-time word counter
    textarea?.addEventListener('input', () => {
      this.updateWordCountBadge(textarea.value, wordBadge);
      this.clearError('content');
    });

    titleInput?.addEventListener('input', () => {
      this.clearError('title');
    });

    // Category chips
    this.container.querySelectorAll('.category-chip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.dataset.cat;
        this.container.querySelectorAll('.category-chip-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Cancel buttons
    const handleCancel = () => {
      this.setOpen(false);
      if (this.onCancel) this.onCancel();
    };

    this.container.querySelector('.close-form-btn')?.addEventListener('click', handleCancel);
    this.container.querySelector('.cancel-bottom-btn')?.addEventListener('click', handleCancel);

    // Submit button
    this.container.querySelector('.submit-topic-btn')?.addEventListener('click', () => {
      this.handleFormSubmit();
    });
  }

  updateWordCountBadge(text, badge) {
    if (!badge) return;
    const count = countFrenchWords(text);
    const wordsLabel = i18n.t('custom_topic.words_count') || 'mots';

    badge.className = 'word-count-badge';

    if (count < 30) {
      badge.classList.add('warning');
      badge.textContent = `⚠️ ${count} ${wordsLabel} (min. 30)`;
    } else if (count < 140) {
      badge.classList.add('acceptable');
      badge.textContent = `📝 ${count} ${wordsLabel} (court)`;
    } else if (count <= 270) {
      badge.classList.add('optimal');
      badge.textContent = `✅ ${count} ${wordsLabel} (DELF B2 idéal)`;
    } else {
      badge.classList.add('long');
      badge.textContent = `ℹ️ ${count} ${wordsLabel} (long)`;
    }
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
        this.container.querySelector('.topic-title-input')?.focus();
      } else {
        this.container.classList.remove('open');
      }
    }
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  getFormData() {
    if (!this.container) return {};
    const title = this.container.querySelector('.topic-title-input')?.value || '';
    const source = this.container.querySelector('.topic-source-input')?.value || '';
    const problematique = this.container.querySelector('.topic-problematique-input')?.value || '';
    const content = this.container.querySelector('.topic-content-textarea')?.value || '';

    return {
      title,
      category: this.selectedCategory,
      source: source || 'Document personnalisé du candidat',
      problematique,
      content
    };
  }

  handleFormSubmit() {
    const data = this.getFormData();
    const validation = validateCustomTopic(data);

    if (!validation.isValid) {
      if (validation.errors.title) {
        this.showError('title', i18n.t(validation.errors.title) || 'Le titre doit contenir au moins 5 caractères.');
      }
      if (validation.errors.content) {
        this.showError('content', i18n.t(validation.errors.content) || 'Le texte doit contenir au moins 30 mots pour une simulation DELF B2.');
      }
      return;
    }

    if (this.onSubmit) {
      this.onSubmit(data);
    }
  }
}
