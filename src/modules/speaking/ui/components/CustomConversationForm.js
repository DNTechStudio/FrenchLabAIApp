/**
 * CustomConversationForm: Interactive builder for personalized French situational conversation scenarios
 * Includes AI idea synthesis & auto-completion from rough drafts in any language
 */

import { CONVERSATION_CATEGORIES } from '../../data/conversation/conversationScenarios.js';
import { i18n } from '../../core/i18n/I18nManager.js';

export class CustomConversationForm {
  constructor({ onSubmit = () => {}, onCancel = () => {}, onOpenChange = () => {} } = {}) {
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;
    this.onOpenChange = onOpenChange;
    this.isOpen = false;
    this.selectedCategory = CONVERSATION_CATEGORIES[0].id;
    this.selectedParticipantCount = 2;
    this.container = null;
  }

  toggle() {
    this.setOpen(!this.isOpen);
  }

  setOpen(open) {
    this.isOpen = Boolean(open);
    if (this.container) {
      this.container.style.display = this.isOpen ? 'block' : 'none';
      if (this.isOpen) {
        this.container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    this.onOpenChange(this.isOpen);
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'glass-panel custom-conversation-form-card';
    this.container.style.marginBottom = '1.5rem';
    this.container.style.display = this.isOpen ? 'block' : 'none';
    this.container.style.border = '1px solid rgba(168, 85, 247, 0.4)';
    this.container.style.background = 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)';

    this.updateDOM();
    return this.container;
  }

  updateDOM() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid rgba(168, 85, 247, 0.2); padding-bottom: 0.75rem;">
        <div>
          <span class="badge" style="background: rgba(168, 85, 247, 0.25); border: 1px solid #a855f7; color: #d8b4fe; font-size: 0.7rem;">
            ✨ ${i18n.t('conversation.custom_badge') || 'Scénario Personnalisé'}
          </span>
          <h3 style="font-size: var(--text-lg); margin-top: 0.25rem;">
            ${i18n.t('conversation.custom_form_heading') || 'Créer votre propre scénario de conversation'}
          </h3>
        </div>
        <button type="button" class="btn btn-secondary cancel-form-btn" style="padding: 0.35rem 0.75rem; font-size: var(--text-xs);">
          ✖ ${i18n.t('conversation.cancel_btn') || 'Fermer'}
        </button>
      </div>

      <!-- AI Brainstorm Draft Box -->
      <div style="background: rgba(168, 85, 247, 0.12); border: 1px dashed rgba(168, 85, 247, 0.5); border-radius: var(--radius-md); padding: 0.85rem; margin-bottom: 1.25rem;">
        <label style="display: block; font-size: var(--text-xs); font-weight: 700; color: #d8b4fe; margin-bottom: 0.35rem;">
          💡 ${i18n.t('conversation.ai_draft_label') || 'Votre idée brute (en français, tiếng Việt, English...)'} :
        </label>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <input 
            type="text" 
            class="ai-conv-draft-input" 
            placeholder="${i18n.t('conversation.ai_draft_placeholder') || 'ex: nhổ răng khôn đau đớn / négocier augmentation avec mon patron...'}" 
            style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.3); border: 1px solid rgba(168, 85, 247, 0.4); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: #ffffff; font-size: var(--text-xs);"
          />
          <button type="button" class="btn btn-primary ai-conv-generate-btn" style="padding: 0.5rem 1rem; font-size: var(--text-xs); background: #9333ea; border-color: #a855f7;">
            ✨ ${i18n.t('conversation.ai_generate_btn') || 'Structurer avec l’IA'}
          </button>
        </div>
      </div>

      <!-- Main Scenario Form -->
      <form class="custom-conv-form" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: var(--text-xs); font-weight: 700; margin-bottom: 0.35rem;">
            Titre de la situation <span style="color: #f87171;">*</span>
          </label>
          <input 
            type="text" 
            name="title" 
            class="conv-title-input" 
            placeholder="ex: Consultation d'urgence chez le dentiste pour une rage de dents"
            style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: var(--text-color); font-size: var(--text-xs);"
            required
          />
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <!-- Category Selection -->
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: var(--text-xs); font-weight: 700; margin-bottom: 0.35rem;">
              Thématique de la situation <span style="color: #f87171;">*</span>
            </label>
            <select name="category" class="conv-category-select" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: var(--text-color); font-size: var(--text-xs);">
              ${CONVERSATION_CATEGORIES.map(c => `
                <option value="${c.id}" ${this.selectedCategory === c.id ? 'selected' : ''}>
                  ${c.icon} ${c.label}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Participant Count Toggle -->
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: var(--text-xs); font-weight: 700; margin-bottom: 0.35rem;">
              Nombre d'intervenants <span style="color: #f87171;">*</span>
            </label>
            <div style="display: flex; gap: 0.5rem;">
              <button type="button" class="btn part-count-btn ${this.selectedParticipantCount === 2 ? 'btn-primary' : 'btn-secondary'}" data-count="2" style="flex: 1; padding: 0.45rem 0.75rem; font-size: var(--text-xs);">
                👥 2 personnes
              </button>
              <button type="button" class="btn part-count-btn ${this.selectedParticipantCount === 3 ? 'btn-primary' : 'btn-secondary'}" data-count="3" style="flex: 1; padding: 0.45rem 0.75rem; font-size: var(--text-xs);">
                👥 3 personnes
              </button>
            </div>
          </div>
        </div>

        <div>
          <label style="display: block; font-size: var(--text-xs); font-weight: 700; margin-bottom: 0.35rem;">
            Contexte et cadre de la scène (au moins 10 caractères) <span style="color: #f87171;">*</span>
          </label>
          <textarea 
            name="context" 
            class="conv-context-input" 
            rows="2"
            placeholder="Décrivez les circonstances : où se passe la scène, qui sont les personnages, quel est l'enjeu..."
            style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: var(--text-color); font-size: var(--text-xs); resize: vertical;"
            required
          ></textarea>
        </div>

        <div>
          <label style="display: block; font-size: var(--text-xs); font-weight: 700; margin-bottom: 0.35rem;">
            🎯 Objectif communicatif / Mission du candidat <span style="color: #f87171;">*</span>
          </label>
          <input 
            type="text" 
            name="objective" 
            class="conv-objective-input" 
            placeholder="ex: Convaincre la secrétaire d'obtenir une consultation d'urgence avant midi"
            style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: var(--text-color); font-size: var(--text-xs);"
            required
          />
        </div>

        <!-- Initial Turn Greeting -->
        <div>
          <label style="display: block; font-size: var(--text-xs); font-weight: 700; margin-bottom: 0.35rem;">
            🗣️ Première réplique de l'interlocuteur IA
          </label>
          <input 
            type="text" 
            name="initialTurn" 
            class="conv-initial-turn-input" 
            placeholder="ex: Bonjour, installez-vous. Que puis-je faire pour vous ?"
            style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; color: var(--text-color); font-size: var(--text-xs);"
          />
        </div>

        <div class="conv-form-error" style="color: #fca5a5; font-size: var(--text-xs); display: none;"></div>

        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem;">
          <button type="button" class="btn btn-secondary cancel-form-btn" style="padding: 0.5rem 1rem;">
            ${i18n.t('conversation.cancel_btn') || 'Annuler'}
          </button>
          <button type="submit" class="btn btn-primary submit-form-btn" style="padding: 0.5rem 1.25rem;">
            🚀 ${i18n.t('conversation.apply_scenario_btn') || 'Lancer ce scénario'}
          </button>
        </div>
      </form>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const cancelBtns = this.container.querySelectorAll('.cancel-form-btn');
    cancelBtns.forEach(btn => btn.addEventListener('click', () => {
      this.setOpen(false);
      this.onCancel();
    }));

    // Participant count toggles
    const partBtns = this.container.querySelectorAll('.part-count-btn');
    partBtns.forEach(btn => btn.addEventListener('click', () => {
      this.selectedParticipantCount = Number(btn.dataset.count);
      partBtns.forEach(b => {
        b.className = `btn part-count-btn ${b === btn ? 'btn-primary' : 'btn-secondary'}`;
      });
    }));

    // AI Generate Button
    const aiBtn = this.container.querySelector('.ai-conv-generate-btn');
    const draftInput = this.container.querySelector('.ai-conv-draft-input');
    aiBtn?.addEventListener('click', () => {
      this.handleAiGenerate(draftInput?.value);
    });

    // Form Submission
    const form = this.container.querySelector('.custom-conv-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
  }

  handleAiGenerate(rawDraft = '') {
    const draft = (rawDraft || '').trim().toLowerCase();
    const titleInput = this.container.querySelector('.conv-title-input');
    const contextInput = this.container.querySelector('.conv-context-input');
    const objectiveInput = this.container.querySelector('.conv-objective-input');
    const initialTurnInput = this.container.querySelector('.conv-initial-turn-input');
    const categorySelect = this.container.querySelector('.conv-category-select');

    let title = "Situation de communication pratique";
    let category = "quotidien";
    let context = "Vous participez à une conversation de la vie courante pour exprimer vos attentes.";
    let objective = "Exprimer votre demande clairement et convenir d'une solution mutuelle.";
    let initialTurn = "Bonjour, bienvenue ! En quoi puis-je vous aider aujourd'hui ?";

    if (draft.includes('dent') || draft.includes('răng') || draft.includes('mal') || draft.includes('docteur') || draft.includes('médical') || draft.includes('sante')) {
      category = 'sante';
      title = "Consultation dentaire imprévue pour une rage de dents";
      context = "Vous souffrez d'une vive douleur à une molaire et vous vous présentez en urgence au cabinet.";
      objective = "Expliquer l'intensité de la douleur dentaire et solliciter une prise en charge rapide.";
      initialTurn = "Cabinet dentaire du Dr Dupont, bonjour. Vous avez l'air de souffrir, asseyez-vous. Que vous arrive-t-il ?";
    } else if (draft.includes('travail') || draft.includes('bureau') || draft.includes('patron') || draft.includes('boss') || draft.includes('salaire') || draft.includes('lương') || draft.includes('congé') || draft.includes('job')) {
      category = 'travail';
      title = "Entretien avec votre responsable d'équipe";
      context = "Vous échangez en tête-à-tête avec votre manager sur l'organisation de vos missions et de vos horaires.";
      objective = "Défendre vos propositions avec méthode et trouver un accord satisfaisant.";
      initialTurn = "Bonjour, merci d'être venu. Je t'écoute, de quoi souhaitais-tu me parler aujourd'hui ?";
    } else if (draft.includes('papier') || draft.includes('visa') || draft.includes('séjour') || draft.includes('prefecture') || draft.includes('banque') || draft.includes('hành chính')) {
      category = 'administration';
      title = "Démarche administrative en préfecture ou mairie";
      context = "Vous devez régulariser un dossier administratif officiel et clarifier des pièces justificatives manquantes.";
      objective = "Remettre vos documents et obtenir une attestation de dépôt provisoire.";
      initialTurn = "Bonjour. Vous avez rendez-vous pour un dépôt de dossier administratif ? Avez-vous vos formulaires ?";
    } else if (draft.includes('cours') || draft.includes('ecole') || draft.includes('prof') || draft.includes('etudiant') || draft.includes('hoc') || draft.includes('truong')) {
      category = 'etudes';
      title = "Discussion méthodologique avec un enseignant";
      context = "Vous demandez des explications complémentaires sur un devoir noté et les critères d'évaluation.";
      objective = "Clarifier les attentes académiques et solliciter des conseils de progression.";
      initialTurn = "Bonjour. Vous souhaitiez faire le point sur vos derniers travaux ? Qu'est-ce qui vous pose question ?";
    }

    if (titleInput) titleInput.value = title;
    if (contextInput) contextInput.value = context;
    if (objectiveInput) objectiveInput.value = objective;
    if (initialTurnInput) initialTurnInput.value = initialTurn;
    if (categorySelect) categorySelect.value = category;

    // Visual flash highlight
    [titleInput, contextInput, objectiveInput, initialTurnInput].forEach(el => {
      if (el) {
        el.style.transition = 'box-shadow 0.3s ease';
        el.style.boxShadow = '0 0 12px rgba(168, 85, 247, 0.6)';
        setTimeout(() => { el.style.boxShadow = 'none'; }, 1000);
      }
    });
  }

  handleFormSubmit() {
    const errorBox = this.container.querySelector('.conv-form-error');
    if (errorBox) errorBox.style.display = 'none';

    const title = this.container.querySelector('.conv-title-input')?.value || '';
    const category = this.container.querySelector('.conv-category-select')?.value || this.selectedCategory;
    const context = this.container.querySelector('.conv-context-input')?.value || '';
    const objective = this.container.querySelector('.conv-objective-input')?.value || '';
    const initialTurnText = this.container.querySelector('.conv-initial-turn-input')?.value || '';

    try {
      const scenarioData = {
        title,
        category,
        participantCount: this.selectedParticipantCount,
        context,
        objective,
        initialTurnText,
        defaultLevel: 'B1'
      };

      this.onSubmit(scenarioData);
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = err.message;
        errorBox.style.display = 'block';
      }
    }
  }
}
