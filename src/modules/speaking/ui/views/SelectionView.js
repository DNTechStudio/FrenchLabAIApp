/**
 * SelectionView: Topic browser, category filter, custom topic composer, and "Tirage au sort" (Random draw)
 */

import { TRIGGER_DOCUMENTS, getRandomTriggerDocument } from '../../data/documents/triggerDocuments.js';
import { getCustomTopics, saveCustomTopic, deleteCustomTopic } from '../../data/documents/customTopicsStorage.js';
import { renderDocumentCard } from '../components/DocumentCard.js';
import { CustomTopicForm } from '../components/CustomTopicForm.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class SelectionView {
  constructor({ onSelectDocument }) {
    this.onSelectDocument = onSelectDocument;
    this.selectedCategory = 'ALL';
    this.customTopicForm = null;
    this.viewContainer = null;
  }

  render() {
    this.viewContainer = document.createElement('div');
    this.viewContainer.className = 'view-container selection-view';
    this.renderDOM();
    return this.viewContainer;
  }

  renderDOM() {
    if (!this.viewContainer) return;
    this.viewContainer.innerHTML = '';

    const customTopics = getCustomTopics();
    const hasCustomTopics = customTopics.length > 0;

    // Extract categories
    const categories = ['ALL'];
    if (hasCustomTopics) {
      categories.push('CUSTOM');
    }
    const standardCategories = [...new Set(TRIGGER_DOCUMENTS.map(d => d.category))];
    categories.push(...standardCategories);

    // If current selected category is no longer valid, reset to ALL
    if (!categories.includes(this.selectedCategory)) {
      this.selectedCategory = 'ALL';
    }

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '1.75rem';

    wrapper.innerHTML = `
      <!-- Hero Section -->
      <div class="glass-panel" style="background: linear-gradient(135deg, rgba(30, 58, 138, 0.4), rgba(15, 23, 42, 0.8)); text-align: center; padding: 2.5rem 1.5rem;">
        <span class="badge badge-primary" style="margin-bottom: 0.75rem;">
          ${i18n.t('selection.badge') || 'Épreuve Orale • DELF B2'}
        </span>
        <h1 style="font-size: var(--text-3xl); margin-bottom: 0.75rem;">
          ${i18n.t('selection.hero_title') || 'Choix du Document Déclencheur'}
        </h1>
        <p style="max-width: 650px; margin: 0 auto 1.75rem auto; font-size: var(--text-base); color: var(--text-secondary);">
          ${i18n.t('selection.hero_desc') || 'Sélectionnez un sujet pour démarrer vos 30 minutes de préparation, ou tentez un tirage au sort comme à l’examen officiel.'}
        </p>

        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-primary random-draw-btn" style="padding: 0.875rem 2rem; font-size: var(--text-base); box-shadow: 0 0 25px rgba(59, 130, 246, 0.5);">
            🎲 ${i18n.t('selection.random_btn') || 'Tirage au sort (Aléatoire)'}
          </button>
          <button type="button" class="btn btn-secondary custom-topic-toggle-btn" style="padding: 0.875rem 1.75rem; font-size: var(--text-base); border-color: rgba(147, 197, 253, 0.4); background: rgba(30, 58, 138, 0.25);">
            ✏️ ${i18n.t('selection.custom_topic_btn') || 'Sujet personnalisé'}
          </button>
        </div>
      </div>

      <!-- Inline Expandable Custom Topic Form Slot -->
      <div class="custom-topic-slot"></div>

      <!-- Categories Filter Tabs -->
      <div class="category-tabs-row" style="display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.25rem;">
        ${categories.map(cat => {
          let label = cat;
          if (cat === 'ALL') label = i18n.t('selection.all_categories') || 'Tous les sujets';
          else if (cat === 'CUSTOM') label = `✏️ ${i18n.t('custom_topic.saved_tab') || 'Mes Sujets'} (${customTopics.length})`;

          const isActive = cat === this.selectedCategory;
          return `
            <button type="button" class="btn btn-secondary filter-tab-btn ${isActive ? 'active' : ''}" 
                    data-cat="${cat}" 
                    style="font-size: var(--text-xs); padding: 0.375rem 0.875rem; border-radius: var(--radius-full); ${isActive ? 'background: rgba(59, 130, 246, 0.2); border-color: var(--color-primary); color: #93c5fd;' : ''}">
              ${label}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Documents Catalog Grid -->
      <div class="topic-cards-grid">
        <!-- Rendered cards -->
      </div>
    `;

    this.viewContainer.appendChild(wrapper);

    // Mount Custom Topic Form
    this.customTopicForm = new CustomTopicForm({
      onSubmit: (topicData) => {
        const savedDoc = saveCustomTopic(topicData);
        if (this.onSelectDocument) {
          this.onSelectDocument(savedDoc);
        }
      },
      onCancel: () => {
        this.customTopicForm.setOpen(false);
      }
    });

    wrapper.querySelector('.custom-topic-slot')?.appendChild(this.customTopicForm.render());

    // Bind Hero Actions
    wrapper.querySelector('.random-draw-btn')?.addEventListener('click', () => {
      const randomDoc = getRandomTriggerDocument();
      if (this.onSelectDocument) {
        this.onSelectDocument(randomDoc);
      }
    });

    wrapper.querySelector('.custom-topic-toggle-btn')?.addEventListener('click', () => {
      this.customTopicForm.toggle();
    });

    // Bind Category Filter Tabs
    wrapper.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.dataset.cat;
        wrapper.querySelectorAll('.filter-tab-btn').forEach(b => {
          b.style.background = '';
          b.style.borderColor = '';
          b.style.color = '';
          b.classList.remove('active');
        });
        e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.color = '#93c5fd';
        e.currentTarget.classList.add('active');
        this.renderCards(wrapper.querySelector('.topic-cards-grid'));
      });
    });

    // Render Cards in Grid
    this.renderCards(wrapper.querySelector('.topic-cards-grid'));
  }

  renderCards(grid) {
    if (!grid) return;
    grid.innerHTML = '';

    const customTopics = getCustomTopics();
    let displayList = [];

    if (this.selectedCategory === 'CUSTOM') {
      displayList = customTopics;
    } else if (this.selectedCategory === 'ALL') {
      // Custom topics first, then standard documents
      displayList = [...customTopics, ...TRIGGER_DOCUMENTS];
    } else {
      const filteredCustom = customTopics.filter(d => d.category === this.selectedCategory);
      const filteredStandard = TRIGGER_DOCUMENTS.filter(d => d.category === this.selectedCategory);
      displayList = [...filteredCustom, ...filteredStandard];
    }

    if (displayList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📭</div>
          <p>${i18n.t('selection.no_documents') || 'Aucun sujet dans cette catégorie pour le moment.'}</p>
        </div>
      `;
      return;
    }

    displayList.forEach(doc => {
      const card = renderDocumentCard(doc, {
        isSelectable: true,
        onSelect: (selectedDoc) => {
          if (this.onSelectDocument) {
            this.onSelectDocument(selectedDoc);
          }
        },
        onDelete: doc.isCustom ? (docToDelete) => {
          deleteCustomTopic(docToDelete.id);
          this.renderDOM();
        } : null
      });
      grid.appendChild(card);
    });
  }
}
