/**
 * DocumentCard: Renders the DELF B2 Trigger Document prompt card with optional bilingual glossary
 */

import { i18n } from '../../core/i18n/I18nManager.js';

export function renderDocumentCard(doc, { isSelectable = false, onSelect = null, onDelete = null } = {}) {
  const card = document.createElement('div');
  card.className = `glass-panel ${isSelectable ? 'topic-card-item' : ''}`;
  card.dataset.id = doc.id;

  const currentLocale = i18n.getLocale();

  card.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
        <div style="display: flex; gap: 0.375rem; align-items: center; flex-wrap: wrap;">
          <span class="badge badge-primary">${doc.category}</span>
          ${doc.isCustom ? `
            <span class="badge" style="background: rgba(168, 85, 247, 0.2); border: 1px solid #a855f7; color: #d8b4fe;">
              🎨 ${i18n.t('custom_topic.custom_badge') || 'Personnalisé'}
            </span>
          ` : ''}
        </div>
        <div style="display: flex; gap: 0.375rem; align-items: center;">
          <span class="badge" style="background: rgba(255, 255, 255, 0.08); color: var(--text-muted);">
            ${doc.wordCount} ${i18n.t('selection.words')} | ${i18n.t('selection.level')} ${doc.vocabularyLevel || 'B2'}
          </span>
          ${doc.isCustom && onDelete ? `
            <button type="button" class="btn btn-secondary delete-custom-doc-btn" 
                    title="${i18n.t('custom_topic.delete_btn') || 'Supprimer ce sujet'}" 
                    style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border-color: rgba(239, 68, 68, 0.3); color: #fca5a5;">
              🗑️
            </button>
          ` : ''}
        </div>
      </div>
      <h3 style="font-size: var(--text-lg); margin-bottom: 0.5rem; line-height: 1.4;">${doc.title}</h3>
      <div style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 1rem; font-style: italic;">
        ${i18n.t('selection.source')} ${doc.source}
      </div>
      <div style="font-size: var(--text-sm); line-height: 1.6; color: var(--text-secondary); margin-bottom: 1rem;">
        ${doc.content}
      </div>
    </div>

    <!-- Sample Problematique -->
    ${doc.problematiqueSample && doc.problematiqueSample.length > 0 ? `
      <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid var(--color-primary); padding: 0.75rem 1rem; border-radius: 0 var(--radius-md) var(--radius-md) 0; margin-top: 0.5rem;">
        <div style="font-size: var(--text-xs); font-weight: 700; color: var(--color-primary); text-transform: uppercase; margin-bottom: 0.25rem;">
          ${i18n.t('selection.problematique_sample')}
        </div>
        <ul style="padding-left: 1.25rem; font-size: var(--text-xs); color: var(--text-secondary); margin: 0;">
          ${doc.problematiqueSample.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <!-- Bilingual Glossary Toggle (if available) -->
    ${doc.glossary && doc.glossary.length > 0 ? `
      <div style="margin-top: 0.75rem;">
        <button class="btn btn-secondary toggle-glossary-btn" style="padding: 0.25rem 0.625rem; font-size: var(--text-xs); gap: 0.35rem;">
          ${i18n.t('glossary.view_btn')} (${doc.glossary.length})
        </button>
        <div class="glossary-drawer" style="display: none; margin-top: 0.5rem; background: rgba(15, 23, 42, 0.7); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem;">
          <div style="display: grid; gap: 0.5rem;">
            ${doc.glossary.map(item => {
              const translation = item[currentLocale] || item.en || item.fr || '';
              return `
                <div style="font-size: var(--text-xs); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.25rem;">
                  <strong style="color: #93c5fd;">${item.french}</strong>
                  <span style="color: #6ee7b7; font-style: italic;">➔ ${translation}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    ${isSelectable ? `
      <div style="margin-top: 1.25rem; text-align: right;">
        <button class="btn btn-secondary select-doc-btn" style="width: 100%;">
          ${i18n.t('selection.select_btn')}
        </button>
      </div>
    ` : ''}
  `;

  const glossaryBtn = card.querySelector('.toggle-glossary-btn');
  const glossaryDrawer = card.querySelector('.glossary-drawer');
  if (glossaryBtn && glossaryDrawer) {
    let isOpen = false;
    glossaryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      glossaryDrawer.style.display = isOpen ? 'block' : 'none';
      glossaryBtn.textContent = isOpen ? i18n.t('glossary.hide_btn') : `${i18n.t('glossary.view_btn')} (${doc.glossary.length})`;
    });
  }

  if (doc.isCustom && onDelete) {
    card.querySelector('.delete-custom-doc-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onDelete(doc);
    });
  }

  if (isSelectable && onSelect) {
    card.querySelector('.select-doc-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelect(doc);
    });
    card.addEventListener('click', () => onSelect(doc));
  }

  return card;
}
