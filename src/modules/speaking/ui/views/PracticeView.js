/**
 * PracticeView: Main view for Practice Mode (Freeform Speech Recording & Dual-Level AI Elevation)
 */

import { PRACTICE_PROMPTS, generateSuggestedSpeech } from '../../data/practice/practicePrompts.js';
import { getRandomCombinedPracticePrompt, saveCustomPracticePrompt } from '../../data/practice/customPracticeStorage.js';
import { PracticeRecordingConsole } from '../components/PracticeRecordingConsole.js';
import { CefrDualLevelPicker } from '../components/CefrDualLevelPicker.js';
import { renderElevationComparisonCard } from '../components/ElevationComparisonCard.js';
import { CustomPracticeTopicForm } from '../components/CustomPracticeTopicForm.js';
import { PracticeElevationEngine } from '../../core/practice/PracticeElevationEngine.js';
import { CEFR_LEVELS } from '../../core/practice/CefrLevelDefinitions.js';
import { i18n } from '../../core/i18n/I18nManager.js';

const PRACTICE_STORAGE_KEY = 'delf_speaking_practice_session';

export class PracticeView {
  constructor({
    audioRecorder,
    speechRecognizer,
    voiceSynthesizer
  } = {}) {
    this.audioRecorder = audioRecorder;
    this.speechRecognizer = speechRecognizer;
    this.voiceSynthesizer = voiceSynthesizer;
    this.elevationEngine = new PracticeElevationEngine();

    this.currentTopic = this.loadSavedSession()?.topic || PRACTICE_PROMPTS[0];
    this.currentTranscript = this.loadSavedSession()?.transcript || '';
    this.selectedLevels = this.loadSavedSession()?.selectedLevels || ['B1', 'B2'];
    this.elevationResult = this.loadSavedSession()?.elevationResult || null;

    this.consoleComponent = null;
    this.levelPickerComponent = null;
    this.customTopicForm = null;
    this.container = null;
  }

  loadSavedSession() {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      if (storage) {
        const raw = storage.getItem(PRACTICE_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (e) {}
    return null;
  }

  saveSession() {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      if (storage) {
        storage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify({
          topic: this.currentTopic,
          transcript: this.currentTranscript,
          selectedLevels: this.selectedLevels,
          elevationResult: this.elevationResult
        }));
      }
    } catch (e) {}
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'view-container practice-view';

    this.renderWorkspaceDOM();
    if (this.elevationResult) {
      this.renderElevationResultDOM({ shouldScroll: false });
    }

    return this.container;
  }

  renderWorkspaceDOM() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const viewWrapper = document.createElement('div');

    // Hero Header with Random Draw & Custom Topic buttons
    viewWrapper.innerHTML = `
      <div class="glass-panel" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary" style="margin-bottom: 0.35rem;">
            🎙️ ${i18n.t('practice.badge') || 'Mode Entraînement Libre'}
          </span>
          <h1 style="font-size: var(--text-2xl); margin-bottom: 0.25rem;">
            ${i18n.t('practice.title') || 'Entraînement Oral & Évolution CEFR'}
          </h1>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            ${i18n.t('practice.subtitle') || 'Exprimez-vous spontanément, comparez vos propos sur 2 paliers au choix et perfectionnez votre français avec l’IA.'}
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary random-prompt-btn" style="padding: 0.45rem 0.85rem; font-size: var(--text-xs);">
            🎲 ${i18n.t('practice.new_prompt') || 'Changer de sujet'}
          </button>
          <button type="button" class="btn btn-secondary custom-prompt-toggle-btn" style="padding: 0.45rem 0.85rem; font-size: var(--text-xs); border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.15); color: #d8b4fe;">
            ✏️ ${i18n.t('practice.custom_topic_btn') || 'Sujet personnalisé'}
          </button>
        </div>
      </div>

      <!-- Inline Custom Topic Form Slot -->
      <div class="custom-prompt-slot"></div>

      <!-- Active Practice Topic Card Slot -->
      <div class="active-topic-card-slot"></div>

      <!-- Slots for Components -->
      <div class="recording-console-slot"></div>
      <div class="level-picker-slot"></div>

      <!-- Primary Action: Improve with AI -->
      <div style="text-align: center; margin: 2rem 0 1.5rem 0;">
        <button type="button" class="btn btn-primary trigger-elevation-btn" style="padding: 0.85rem 2.25rem; font-size: var(--text-base); font-weight: 700; box-shadow: var(--shadow-glow);">
          ✨ ${i18n.t('practice.improve_btn') || 'Améliorer avec l’IA'} →
        </button>
        <div class="elevation-validation-hint" style="font-size: 0.75rem; color: #fca5a5; margin-top: 0.5rem; display: none;"></div>
      </div>

      <!-- Dedicated Inline AI Speech Elevation Results Slot -->
      <div class="elevation-result-slot" style="margin-top: 1.5rem;"></div>
    `;

    this.container.appendChild(viewWrapper);

    // Mount Custom Practice Topic Form
    this.customTopicForm = new CustomPracticeTopicForm({
      onSubmit: (promptData) => {
        const saved = saveCustomPracticePrompt(promptData);
        this.currentTopic = saved;
        this.saveSession();
        this.renderActiveTopicCardDOM(this.container.querySelector('.active-topic-card-slot'));
        this.customTopicForm.setOpen(false);
      },
      onCancel: () => {
        this.customTopicForm.setOpen(false);
      },
      onOpenChange: (isOpen) => {
        this.setTopicMode(isOpen);
      }
    });
    this.container.querySelector('.custom-prompt-slot')?.appendChild(this.customTopicForm.render());

    // Render Active Topic Card
    this.renderActiveTopicCardDOM(this.container.querySelector('.active-topic-card-slot'));

    // Mount Recording Console
    this.consoleComponent = new PracticeRecordingConsole({
      audioRecorder: this.audioRecorder,
      speechRecognizer: this.speechRecognizer,
      initialTranscript: this.currentTranscript,
      onTranscriptChange: (text) => {
        this.currentTranscript = text;
        this.saveSession();
        this.validateState();
      }
    });
    this.container.querySelector('.recording-console-slot')?.appendChild(this.consoleComponent.render());

    // Mount Level Picker
    this.levelPickerComponent = new CefrDualLevelPicker({
      initialLevels: this.selectedLevels,
      onChange: (levels) => {
        this.selectedLevels = levels;
        this.saveSession();
        this.validateState();
      }
    });
    this.container.querySelector('.level-picker-slot')?.appendChild(this.levelPickerComponent.render());

    // Bind Toggle Custom Prompt Form
    this.container.querySelector('.custom-prompt-toggle-btn')?.addEventListener('click', () => {
      this.customTopicForm.toggle();
    });

    // Bind Change Topic (mutually exclusive with custom form)
    this.container.querySelector('.random-prompt-btn')?.addEventListener('click', () => {
      if (this.customTopicForm?.isOpen) {
        this.customTopicForm.setOpen(false);
      }
      this.currentTopic = getRandomCombinedPracticePrompt();
      this.saveSession();
      this.renderActiveTopicCardDOM(this.container.querySelector('.active-topic-card-slot'));
      this.setTopicMode(false);
    });

    // Initial topic mode (active topic card visible, custom form closed)
    this.setTopicMode(false);

    // Bind Improve with AI
    this.container.querySelector('.trigger-elevation-btn')?.addEventListener('click', () => {
      this.handleTriggerElevation();
    });

    this.validateState();
  }

  renderActiveTopicCardDOM(slot) {
    if (!slot) return;
    const isCustom = Boolean(this.currentTopic.isCustom);

    slot.innerHTML = `
      <div class="glass-panel" style="margin-bottom: 1.5rem; border-left: 4px solid ${isCustom ? 'var(--color-secondary)' : 'var(--color-accent)'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
          <div style="font-size: 0.7rem; font-weight: 700; color: #a78bfa; text-transform: uppercase;">
            Thématique : ${this.currentTopic.category}
          </div>
          ${isCustom ? `
            <span class="badge" style="background: rgba(168, 85, 247, 0.2); border: 1px solid #a855f7; color: #d8b4fe;">
              🎨 ${i18n.t('practice.custom_badge') || 'Personnalisé'}
            </span>
          ` : ''}
        </div>
        <h2 style="font-size: var(--text-lg); margin-bottom: 0.35rem; color: var(--text-primary);">
          « ${this.currentTopic.title} »
        </h2>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem;">
          ${this.currentTopic.description}
        </p>
        <div style="font-size: var(--text-xs); color: #93c5fd; background: rgba(59, 130, 246, 0.08); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
          💡 <em>Amorce suggérée : « ${this.currentTopic.starterSentence || ''} »</em>
        </div>
      </div>
    `;
  }

  setTopicMode(isCustomOpen) {
    const activeTopicSlot = this.container?.querySelector('.active-topic-card-slot');
    const customToggleBtn = this.container?.querySelector('.custom-prompt-toggle-btn');
    const randomBtn = this.container?.querySelector('.random-prompt-btn');

    // Mutually exclusive: if custom topic form is open, hide the active topic card and vice versa
    if (activeTopicSlot) {
      activeTopicSlot.style.display = isCustomOpen ? 'none' : 'block';
    }

    if (customToggleBtn) {
      if (isCustomOpen) {
        customToggleBtn.style.borderColor = '#a855f7';
        customToggleBtn.style.background = '#9333ea';
        customToggleBtn.style.color = '#ffffff';
        customToggleBtn.style.boxShadow = '0 0 12px rgba(168, 85, 247, 0.4)';
      } else {
        customToggleBtn.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        customToggleBtn.style.background = 'rgba(168, 85, 247, 0.15)';
        customToggleBtn.style.color = '#d8b4fe';
        customToggleBtn.style.boxShadow = 'none';
      }
    }

    if (randomBtn) {
      if (!isCustomOpen) {
        randomBtn.style.borderColor = 'rgba(59, 130, 246, 0.6)';
        randomBtn.style.background = 'rgba(59, 130, 246, 0.18)';
        randomBtn.style.color = '#93c5fd';
      } else {
        randomBtn.style.borderColor = '';
        randomBtn.style.background = '';
        randomBtn.style.color = '';
      }
    }
  }

  validateState() {
    const hint = this.container?.querySelector('.elevation-validation-hint');
    const btn = this.container?.querySelector('.trigger-elevation-btn');
    if (!btn || !hint) return;

    const hasValidLevels = this.selectedLevels.length >= 1 && this.selectedLevels.length <= 2;

    if (!hasValidLevels) {
      btn.style.opacity = '0.6';
      hint.textContent = i18n.t('practice.hint_need_levels') || i18n.t('practice.hint_need_two_levels') || 'Veuillez sélectionner au moins 1 niveau (maximum 2) CEFR.';
      hint.style.display = 'block';
    } else {
      btn.style.opacity = '1';
      hint.style.display = 'none';
    }
  }

  handleTriggerElevation() {
    if (this.selectedLevels.length < 1 || this.selectedLevels.length > 2) {
      this.selectedLevels = ['B1', 'B2'];
    }

    // Ensure selectedLevels is always sorted in ascending CEFR order (A1 -> A2 -> B1 -> B2 -> C1 -> C2)
    this.selectedLevels.sort((a, b) => CEFR_LEVELS.indexOf(a) - CEFR_LEVELS.indexOf(b));

    let isSuggested = false;
    let transcriptToElevate = this.currentTranscript.trim();

    // If user has not spoken or written anything, AI suggests the answer itself
    if (!transcriptToElevate) {
      transcriptToElevate = generateSuggestedSpeech(this.currentTopic);
      this.currentTranscript = transcriptToElevate;
      isSuggested = true;
      if (this.consoleComponent && typeof this.consoleComponent.setTranscript === 'function') {
        this.consoleComponent.setTranscript(transcriptToElevate);
      }
    }

    try {
      this.elevationResult = this.elevationEngine.elevateSpeech({
        originalTranscript: transcriptToElevate,
        levels: this.selectedLevels,
        locale: i18n.getLocale()
      });
      this.elevationResult.isAiSuggested = isSuggested;

      this.saveSession();
      this.renderElevationResultDOM({ shouldScroll: true });
    } catch (err) {
      console.error('Elevation error:', err);
      alert("Erreur lors de l'élévation IA : " + err.message);
    }
  }

  renderElevationResultDOM({ shouldScroll = true } = {}) {
    if (!this.container) return;
    const slot = this.container.querySelector('.elevation-result-slot');
    if (!slot) return;
    slot.innerHTML = '';

    if (!this.elevationResult) return;

    const comparisonDOM = renderElevationComparisonCard({
      elevationResult: this.elevationResult,
      voiceSynthesizer: this.voiceSynthesizer,
      onRestart: () => {
        this.elevationResult = null;
        this.saveSession();
        slot.innerHTML = '';
        const consoleEl = this.container.querySelector('.recording-console-slot');
        if (consoleEl && typeof consoleEl.scrollIntoView === 'function') {
          consoleEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });

    slot.appendChild(comparisonDOM);

    if (shouldScroll && typeof slot.scrollIntoView === 'function') {
      setTimeout(() => {
        slot.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  destroy() {
    if (this.consoleComponent) {
      this.consoleComponent.destroy();
    }
    if (this.voiceSynthesizer) {
      this.voiceSynthesizer.stop?.();
    }
  }
}
