/**
 * Dictation View Controller (002-dictation-module)
 * 100% High-Fidelity UI Alignment with PRO-05 Mode Dictée Reference.
 */

import { DICTATION_EXERCISES } from '../data/dictations.js';
import {
  splitFrenchSentences,
  evaluateDictation
} from '../core/dictation/dictationEngine.js';
import { speechSynthesizer, SpeechSynthesizer } from '../core/speech/speechSynthesizer.js';
import { countFrenchWords } from '../core/writing/wordCounter.js';
import { AITextGenerator } from '../core/dictation/aiTextGenerator.js';
import { googleCloudTtsService, GOOGLE_CLOUD_FRENCH_VOICES } from '../core/speech/googleCloudTtsService.js';

export class DictationView {
  constructor({ container }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.currentExercise = DICTATION_EXERCISES.find(e => e.level === 'B1') || DICTATION_EXERCISES[0];
    this.sentences = [];
    this.activeSentenceIndex = 1;
    this.sentenceInputs = {}; // index -> string
    this.fullTextInput = '';
    this.viewTab = 'sentence'; // 'sentence' | 'full'
    this.playbackRate = 1.0;
    this.isPlaying = false;
    this.isPaused = false;
    this.evaluation = null;
    this.showCatalogModal = false;
    this.showApiKeyModal = false;
    this.isWindowEditing = false;
    this.windowEditText = '';

    // Global keyboard shortcuts (Ctrl+Left, Ctrl+Right, Ctrl+R, Ctrl+Space for Ecouter)
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);

    // Listen to global CEFR level changes from sidebar
    window.addEventListener('frenchlab:level-changed', (e) => {
      if (e.detail && e.detail.level) {
        const found = DICTATION_EXERCISES.find(ex => ex.level === e.detail.level);
        if (found) {
          this.loadExercise(found);
        }
      }
    });

    this.fallbackAlert = null;

    // Listen to speech synthesis voice changes
    speechSynthesizer.onVoicesChanged = () => {
      const voiceSelect = this.container?.querySelector('#dictation-voice-select');
      if (voiceSelect) {
        voiceSelect.innerHTML = this.renderVoiceOptions();
      }
    };

    // Listen to speech synthesis fallback events (Cloud voice -> local Web Speech)
    speechSynthesizer.onFallback = ({ error, requestedVoice, fallbackVoice }) => {
      let reason = error?.message || 'Service indisponible';
      if (error?.reason === 'API_KEY_SERVICE_BLOCKED' || (error?.message && error.message.includes('API_KEY_SERVICE_BLOCKED'))) {
        reason = "Clé API bloquée pour Text-to-Speech (erreur 403 API_KEY_SERVICE_BLOCKED). Activez l'API Cloud Text-to-Speech et autorisez-la dans votre console Google Cloud.";
      } else if (error?.code === 'NO_API_KEY' || error?.message === 'CHƯA_CÓ_API_KEY') {
        reason = 'Aucune clé API Google Cloud configurée.';
      }
      this.fallbackAlert = {
        requestedVoice,
        fallbackVoice,
        reason
      };
      this.render();
    };

    this.initExercise();
    this.loadDraft();
  }

  initExercise() {
    this.sentences = splitFrenchSentences(this.currentExercise.fullText);
    if (!this.sentences || this.sentences.length === 0) {
      this.sentences = [{ index: 1, text: this.currentExercise.fullText, wordCount: countFrenchWords(this.currentExercise.fullText) }];
    }
  }

  loadExercise(exercise) {
    speechSynthesizer.stop();
    this.isPlaying = false;
    this.isPaused = false;
    this.currentExercise = exercise;
    this.initExercise();
    this.activeSentenceIndex = 1;
    this.sentenceInputs = {};
    this.fullTextInput = '';
    this.evaluation = null;
    this.showCatalogModal = false;
    this.isWindowEditing = false;
    this.windowEditText = '';
    this.render();
  }

  render() {
    if (!this.container) return;

    const totalSentences = this.sentences.length;
    const currentSentence = this.sentences[this.activeSentenceIndex - 1] || this.sentences[0];
    const currentSentenceText = this.sentenceInputs[this.activeSentenceIndex] || '';

    // Calculate typed word counts
    const activeText = this.viewTab === 'sentence' ? currentSentenceText : this.fullTextInput;
    const typedWordCount = countFrenchWords(activeText);
    const expectedWords = this.viewTab === 'sentence'
      ? currentSentence.wordCount
      : countFrenchWords(this.currentExercise.fullText);

    // Progress percentage
    const progressPercent = Math.min(100, Math.round((this.activeSentenceIndex / totalSentences) * 100));

    // Play button states
    const playLabel = this.isPlaying ? '⏸ Pause' : (this.isPaused ? '► Reprendre' : '► Écouter');
    const playClasses = ['btn-deck-play'];
    if (this.isPlaying) playClasses.push('playing');
    if (this.isPaused) playClasses.push('paused');

    // French Diacritics
    const diacritics = ['é', 'è', 'ê', 'ë', 'à', 'â', 'ù', 'û', 'î', 'ï', 'ô', 'ç', 'œ', 'æ', '«', '»'];
    const diacriticsHtml = diacritics.map(char => `
      <button type="button" class="btn-deck-accent" data-char="${char}">${char}</button>
    `).join('');

    this.container.innerHTML = `
      <div class="dictation-pane-wrapper">
        <div class="dictation-master-card">
          <!-- 1. Top Header Row -->
          <div class="dictation-top-bar">
            <div class="top-bar-left">
              <button class="btn-redaction-back" id="btn-back-writing" title="Retour aux exercices de rédaction">
                ← Rédaction
              </button>

              <div class="mode-dictee-title">
                <span>🎧</span>
                <span>Mode Dictée</span>
              </div>

              <span class="badge-level-pill" id="btn-open-catalog" title="Cliquer pour changer de texte ou niveau" style="cursor: pointer;">
                ${this.currentExercise.level}
              </span>
            </div>

            <div class="top-bar-right">
              <div class="voice-selector-group" title="Sélectionner la voix de lecture en français">
                <span class="voice-label">🎙️ Voix :</span>
                <select id="dictation-voice-select" class="select-voice-pill" aria-label="Choisir la voix de dictée">
                  ${this.renderVoiceOptions()}
                </select>
                <button type="button" class="btn-voice-preview" id="btn-preview-voice" title="Écouter un extrait de cette voix">
                  🔊
                </button>
                <button type="button" class="btn-voice-settings" id="btn-open-voice-settings" title="Configurer les voix Google Cloud AI (Clé API)">
                  ⚙️
                </button>
              </div>

              <div class="speed-selector-group">
                <span class="speed-label">Vitesse :</span>
                <button class="btn-speed-pill ${this.playbackRate === 0.75 ? 'active' : ''}" id="btn-speed-075">
                  0.75x
                </button>
                <button class="btn-speed-pill ${this.playbackRate === 1.0 ? 'active' : ''}" id="btn-speed-100">
                  1.0x
                </button>
              </div>
            </div>
          </div>

          <!-- 1.2 Voice Fallback Alert Banner (if Cloud voice failed) -->
          ${this.renderFallbackBanner()}

          <!-- 1.5 Sample Text Window (Đoạn văn mẫu đọc chính tả) -->
          ${this.renderSampleTextWindow()}

          <!-- 2. Audio Control Deck Card -->
          <div class="dictation-deck-card">
            <div class="deck-stepper-header">
              <span class="deck-stepper-label">Phrase ${this.activeSentenceIndex} sur ${totalSentences}</span>
              <div class="deck-progress-bar">
                <div class="deck-progress-fill" style="width: ${progressPercent}%;"></div>
              </div>
            </div>

            <!-- Controls Row 1 (Navigation & Lecture principale) -->
            <div class="deck-controls-row-1">
              <button class="btn-deck-nav" id="btn-prev-sentence" ${this.activeSentenceIndex <= 1 ? 'disabled' : ''}>
                <span>◀ Précédent</span>
                <kbd class="shortcut-badge">Ctrl+←</kbd>
              </button>

              <button class="${playClasses.join(' ')}" id="btn-play-sentence">
                <span>${playLabel}</span>
                <kbd class="shortcut-badge">Ctrl+Space</kbd>
              </button>

              <button class="btn-deck-nav" id="btn-next-sentence" ${this.activeSentenceIndex >= totalSentences ? 'disabled' : ''}>
                <span>Suivant ▶</span>
                <kbd class="shortcut-badge">Ctrl+→</kbd>
              </button>
            </div>

            <!-- Controls Row 2 (Réécouter centré) -->
            <div class="deck-controls-row-2">
              <button class="btn-deck-replay" id="btn-replay-sentence">
                <span>🔁 Réécouter</span>
                <kbd class="shortcut-badge">Ctrl+R</kbd>
              </button>
            </div>
          </div>

          <!-- 3. Transcription Input Area -->
          <div class="transcription-area-box">
            <div class="transcription-mode-tabs">
              <button class="tab-pill ${this.viewTab === 'sentence' ? 'active' : ''}" id="tab-btn-sentence">
                Phrase ${this.activeSentenceIndex}
              </button>
              <button class="tab-pill ${this.viewTab === 'full' ? 'active' : ''}" id="tab-btn-full">
                Texte intégral (${totalSentences} phrases)
              </button>
            </div>

            <div class="transcription-textarea-wrapper">
              <textarea
                id="dictation-textarea"
                class="deck-textarea"
                placeholder="${this.viewTab === 'sentence'
                  ? `Écoutez la phrase ${this.activeSentenceIndex} et tapez ce que vous entendez en français...\n(Ctrl+Space: Écouter/Pause • Ctrl+R: Réécouter • Ctrl+Enter: Corriger • Ctrl+← / Ctrl+→: Điều hướng)`
                  : 'Tapez la transcription intégrale de la dictée ici...\n(Ctrl+Space: Écouter/Pause • Ctrl+R: Réécouter • Ctrl+Enter: Corriger • Ctrl+← / Ctrl+→: Điều hướng)'}"
                spellcheck="false"
              >${activeText}</textarea>
            </div>

            <!-- Accents Toolbar -->
            <div class="deck-accent-row">
              <span style="font-size: 0.75rem; color: #64748b; margin-right: 6px;">Accents :</span>
              ${diacriticsHtml}
            </div>

            <!-- 4. Action & Counter Bar -->
            <div class="deck-action-bar">
              <div class="deck-words-counter">
                Mots transcrits : <strong>${typedWordCount}</strong>
                <span style="color: #64748b; margin-left: 6px;">(Attendu : ~${expectedWords} mots)</span>
              </div>

              <div class="deck-action-buttons">
                <button class="btn-deck-clear" id="btn-clear-text" ${typedWordCount === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                  Effacer
                </button>

                <button class="btn-deck-submit" id="btn-evaluate-dictation" ${typedWordCount === 0 ? 'disabled' : ''}>
                  <span>🎯</span>
                  <span>Corriger ma dictée</span>
                  <kbd class="shortcut-badge btn-submit-badge">Ctrl+Enter</kbd>
                </button>
              </div>
            </div>
          </div>

          <!-- 5. Inline Evaluation / Correction Window -->
          ${this.evaluation ? this.renderCorrectionSection(this.evaluation) : ''}
        </div>
      </div>

      <!-- Optional Exercise Picker Modal -->
      ${this.showCatalogModal ? this.renderCatalogModal() : ''}

      <!-- Optional Voice Settings / API Key Modal -->
      ${this.showApiKeyModal ? this.renderApiKeyModal() : ''}
    `;

    this.bindEvents(currentSentence);
  }

  renderFallbackBanner() {
    if (!this.fallbackAlert) return '';
    const reqName = this.fallbackAlert.requestedVoice?.name || 'Google Cloud';
    const fallbackName = this.fallbackAlert.fallbackVoice?.name || 'Voix locale';
    return `
      <div class="voice-fallback-banner" id="voice-fallback-banner" role="alert">
        <div class="fallback-banner-left">
          <span class="fallback-banner-icon">⚠️</span>
          <div class="fallback-banner-texts">
            <div class="fallback-banner-title">
              Voix Cloud AI (<strong>${this.escapeHtml(reqName)}</strong>) indisponible : ${this.escapeHtml(this.fallbackAlert.reason)}
            </div>
            <div class="fallback-banner-desc">
              ➔ Bascule automatique sur la voix locale française du navigateur : <strong>${this.escapeHtml(fallbackName)}</strong>.
            </div>
          </div>
        </div>
        <div class="fallback-banner-actions">
          <button type="button" class="btn-fallback-action" id="btn-fix-voice-settings" title="Configurer ou vérifier la clé API Google Cloud">
            ⚙️ Configurer la clé
          </button>
          <button type="button" class="btn-fallback-close" id="btn-close-voice-fallback" aria-label="Fermer cette notification">
            ✕
          </button>
        </div>
      </div>
    `;
  }

  previewCurrentVoice() {
    const voice = speechSynthesizer.selectedVoice;
    if (!voice) return;
    const cleanName = voice.name ? voice.name.replace(/\s*\(.*\)/, '').trim() : 'Français';
    const isFemale = voice.gender === 'female' || /female|femme|claire|camille|elise|hortense/i.test(voice.name || '');
    const previewText = isFemale
      ? `Bonjour ! Je suis ${cleanName}. Prête pour votre dictée.`
      : `Bonjour ! Je suis ${cleanName}. Prêt pour votre dictée.`;

    speechSynthesizer.speakSentence(previewText, {
      rate: this.playbackRate || 1.0,
      lang: 'fr-FR'
    });
  }

  renderSampleTextWindow() {
    const ex = this.currentExercise;
    const wordCount = countFrenchWords(ex.fullText);
    const sentenceCount = this.sentences.length;
    const level = ex.level || 'B1';
    const category = ex.category || 'Général';
    const grammarPoints = ex.grammarPoints || ex.grammar || ['Conjugaison', 'Accords', 'Orthographe'];

    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const levelChipsHtml = levels.map(lvl => `
      <button type="button" class="btn-window-level ${lvl === level ? 'active' : ''}" data-window-level="${lvl}">
        ${lvl}
      </button>
    `).join('');

    if (this.isWindowEditing) {
      const editWords = countFrenchWords(this.windowEditText);
      const editSentences = splitFrenchSentences(this.windowEditText).length;
      return `
        <div class="dictation-sample-window" id="dictation-sample-window">
          <div class="sample-window-header">
            <div class="sample-window-title">
              <span>📝</span>
              <span>Saisie / Modification du texte modèle</span>
              <span class="sample-window-title-badge">${level}</span>
            </div>

            <div class="sample-window-controls">
              <span style="font-size:0.75rem; color:#94a3b8;">Niveau :</span>
              <div class="window-level-group">
                ${levelChipsHtml}
              </div>
            </div>
          </div>

          <div class="sample-edit-box">
            <textarea
              id="sample-window-textarea"
              class="sample-edit-textarea"
              placeholder="Collez ou tapez ici votre texte en français à dicter..."
            >${this.escapeHtml(this.windowEditText)}</textarea>

            <div class="sample-edit-bottom-bar">
              <span style="font-size:0.8rem; color:#94a3b8;" id="sample-edit-stats">
                📊 <strong>${editWords} mots</strong> • <strong>${editSentences} phrase${editSentences > 1 ? 's' : ''}</strong>
              </span>

              <div style="display:flex; gap:8px;">
                <button type="button" class="btn-window-cancel" id="btn-cancel-edit-sample">
                  Annuler
                </button>
                <button type="button" class="btn-window-validate" id="btn-validate-sample-text" ${editWords < 3 ? 'disabled' : ''}>
                  ✔ Valider pour la dictée
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="dictation-sample-window" id="dictation-sample-window">
        <div class="sample-window-header">
          <div class="sample-window-title">
            <span>📝</span>
            <span>Texte Modèle (Dictée)</span>
            <span class="sample-window-title-badge">${level}</span>
          </div>

          <div class="sample-window-controls">
            <div class="window-level-group">
              ${levelChipsHtml}
            </div>

            <button type="button" class="btn-window-action" id="btn-open-edit-sample" title="Coller ou saisir un texte personnalisé">
              📋 Coller un texte
            </button>

            <button type="button" class="btn-window-action" id="btn-sample-random-topic" title="Bốc thăm chủ đề ngẫu nhiên">
              🎲 Aléatoire
            </button>

            <button type="button" class="btn-window-action btn-ai-gen" id="btn-sample-generate-ai" title="Générer un texte authentique pour ce niveau">
              ✨ Générer IA
            </button>
          </div>
        </div>

        <div class="sample-passage-display">
          <span class="passage-quote-text">« ${this.escapeHtml(ex.fullText)} »</span>
        </div>

        <div class="sample-window-footer">
          <div class="sample-meta-left">
            <span><strong>${sentenceCount}</strong> phrase${sentenceCount > 1 ? 's' : ''}</span>
            <span>•</span>
            <span><strong>${wordCount}</strong> mots</span>
            <span>•</span>
            <span style="color:#cbd5e1;">Thème : <em>${this.escapeHtml(category)}</em></span>
          </div>

          <div class="sample-meta-right">
            ${grammarPoints.map(g => `<span class="ai-grammar-tag">📌 ${this.escapeHtml(g)}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderCatalogModal() {
    const list = DICTATION_EXERCISES.map(ex => `
      <div class="dictation-card ${ex.id === this.currentExercise.id ? 'active' : ''}" data-id="${ex.id}" style="padding: 14px; margin-bottom: 10px; cursor: pointer; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span class="badge-level-pill">${ex.level} • ${ex.category}</span>
          <span style="font-size: 0.8rem; color: #94a3b8;">${countFrenchWords(ex.fullText)} mots</span>
        </div>
        <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">${ex.title}</div>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 4px;">${ex.description}</div>
      </div>
    `).join('');

    return `
      <div id="catalog-modal-backdrop" style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;">
        <div style="background: rgba(13, 27, 42, 0.98); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 12px; width: 100%; max-width: 600px; max-height: 80vh; overflow-y: auto; padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 1.15rem; color: #fff;">📚 Choisir un texte de dictée (CECRL A1 - C2)</h3>
            <button id="btn-close-modal" style="background: transparent; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer;">✕</button>
          </div>
          <div>${list}</div>
        </div>
      </div>
    `;
  }

  renderApiKeyModal() {
    const hasKey = googleCloudTtsService.hasApiKey();
    const currentKey = googleCloudTtsService.getApiKey();

    const activeVoiceURI = speechSynthesizer.selectedVoice?.voiceURI || '';
    const activeVoiceId = speechSynthesizer.selectedVoice?.voiceId ||
      (activeVoiceURI ? activeVoiceURI.replace(/^gcloud:/, '') : 'fr-FR-Studio-B');

    const voiceOptions = GOOGLE_CLOUD_FRENCH_VOICES.map(v => {
      const isSelected = (v.voiceId === activeVoiceId || v.voiceURI === activeVoiceURI);
      return `
        <option value="${this.escapeHtml(v.voiceId)}" ${isSelected ? 'selected' : ''}>
          ${v.styleBadge || '🌟'} ${v.name} (${v.gender === 'female' ? 'Femme' : 'Homme'})
        </option>
      `;
    }).join('');

    return `
      <div id="voice-settings-modal-backdrop">
        <div class="modal-voice-settings" role="dialog" aria-modal="true" aria-labelledby="modal-voice-title">
          <div class="modal-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.3rem;">🎙️</span>
              <h3 id="modal-voice-title">Voix Google Cloud Text-to-Speech</h3>
            </div>
            <button type="button" class="btn-modal-close" id="btn-close-voice-settings" aria-label="Fermer">✕</button>
          </div>

          <div class="api-status-banner ${hasKey ? 'success' : 'info'}">
            <span>${hasKey ? '✅' : '💡'}</span>
            <span>${hasKey
              ? '<strong>Clé API active :</strong> Vous bénéficiez des voix de synthèse haute qualité Studio & Neural2.'
              : '<strong>Configuration requise :</strong> Ajoutez une clé API Google Cloud pour débloquer les voix naturelles Studio & Neural.'
            }</span>
          </div>

          <div class="api-info-box">
            💎 <strong>Gratuit chaque mois :</strong> Google Cloud offre <strong>1 000 000 de caractères/mois</strong> pour les voix Studio & Neural2 et <strong>4 000 000 de caractères/mois</strong> pour les voix WaveNet sans frais.
          </div>

          <div class="api-input-group">
            <label for="input-gcloud-api-key" class="api-label">Clé API Google Cloud (Text-to-Speech) :</label>
            <div class="api-input-wrapper">
              <input
                type="password"
                id="input-gcloud-api-key"
                class="input-api-key"
                placeholder="Collez votre clé API (ex: AIzaSy...)"
                value="${this.escapeHtml(currentKey || '')}"
                autocomplete="off"
                spellcheck="false"
              />
              <button type="button" class="btn-toggle-key-visibility" id="btn-toggle-key-visibility" title="Afficher/Masquer la clé">
                👁️
              </button>
            </div>
            <div class="api-key-hint">
              🔒 Votre clé reste stockée localement dans le <code>localStorage</code> de votre navigateur.
            </div>
          </div>

          <div class="api-test-section">
            <label class="api-label" for="select-test-cloud-voice">Voix de lecture par défaut & Test :</label>
            <div class="test-controls-row">
              <select id="select-test-cloud-voice" class="select-voice-pill">
                ${voiceOptions}
              </select>
              <button type="button" class="btn-test-voice" id="btn-test-cloud-voice">
                <span>🔊</span> <span>Tester la voix</span>
              </button>
            </div>
            <div id="test-voice-feedback" class="test-voice-feedback" style="display: none;"></div>
          </div>

          <div class="modal-footer-actions">
            ${hasKey ? `<button type="button" class="btn-api-delete" id="btn-delete-api-key">Supprimer la clé</button>` : '<div></div>'}
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn-api-cancel" id="btn-cancel-voice-settings">Fermer</button>
              <button type="button" class="btn-api-save" id="btn-save-api-key">💾 Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindVoiceSettingsModalEvents() {
    const backdrop = this.container.querySelector('#voice-settings-modal-backdrop');
    if (!backdrop) return;

    const closeBtn = this.container.querySelector('#btn-close-voice-settings');
    const cancelBtn = this.container.querySelector('#btn-cancel-voice-settings');
    const toggleVisBtn = this.container.querySelector('#btn-toggle-key-visibility');
    const apiKeyInput = this.container.querySelector('#input-gcloud-api-key');
    const saveBtn = this.container.querySelector('#btn-save-api-key');
    const deleteBtn = this.container.querySelector('#btn-delete-api-key');
    const testBtn = this.container.querySelector('#btn-test-cloud-voice');
    const voiceSelect = this.container.querySelector('#select-test-cloud-voice');
    const feedbackEl = this.container.querySelector('#test-voice-feedback');

    const closeModal = () => {
      this.showApiKeyModal = false;
      this.render();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    if (toggleVisBtn && apiKeyInput) {
      toggleVisBtn.addEventListener('click', () => {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        toggleVisBtn.textContent = isPassword ? '🔒' : '👁️';
      });
    }

    if (voiceSelect) {
      voiceSelect.addEventListener('change', () => {
        const val = voiceSelect.value;
        if (val) {
          speechSynthesizer.setVoice('gcloud:' + val);
        }
      });
    }

    if (saveBtn && apiKeyInput) {
      saveBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        googleCloudTtsService.saveApiKey(key);
        this.fallbackAlert = null;
        const chosenVoiceId = voiceSelect ? voiceSelect.value : null;
        if (chosenVoiceId) {
          speechSynthesizer.setVoice('gcloud:' + chosenVoiceId);
        } else if (key && !speechSynthesizer.selectedVoice?.isCloud) {
          speechSynthesizer.setVoice('gcloud:fr-FR-Studio-B');
        }
        closeModal();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        googleCloudTtsService.saveApiKey('');
        const localVoices = speechSynthesizer.getFrenchVoices({ includeCloud: false });
        if (localVoices.length > 0) {
          speechSynthesizer.setVoice(localVoices[0].voiceURI);
        }
        closeModal();
      });
    }

    if (testBtn) {
      let activeAudio = null;
      testBtn.addEventListener('click', async () => {
        const enteredKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        const effectiveKey = enteredKey || googleCloudTtsService.getApiKey();
        if (!effectiveKey) {
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#f87171';
            feedbackEl.textContent = '⚠️ Veuillez entrer une clé API pour tester la voix Google Cloud.';
          }
          if (apiKeyInput) apiKeyInput.focus();
          return;
        }

        const voiceId = voiceSelect ? voiceSelect.value : 'fr-FR-Studio-B';
        // Đồng bộ hóa ngay giọng đang test vào synthesizer
        speechSynthesizer.setVoice('gcloud:' + voiceId);
        const sampleText = 'Bonjour ! Bienvenue dans French Lab AI. Je lis votre dictée avec une voix naturelle.';

        if (feedbackEl) {
          feedbackEl.style.display = 'block';
          feedbackEl.style.color = '#38bdf8';
          feedbackEl.textContent = '⏳ Synthèse vocale Google Cloud en cours...';
        }
        testBtn.disabled = true;

        try {
          if (activeAudio) {
            try { activeAudio.pause(); } catch (e) {}
          }
          const { audioUrl, fromCache } = await googleCloudTtsService.synthesize({
            text: sampleText,
            voiceId,
            rate: 1.0,
            apiKey: effectiveKey
          });

          if (feedbackEl) {
            feedbackEl.style.color = '#6ee7b7';
            feedbackEl.textContent = fromCache ? '⚡ Lecture en cours (depuis le cache)...' : '🔊 Lecture en cours (audio Google Cloud)...';
          }

          activeAudio = new Audio(audioUrl);
          activeAudio.onended = () => {
            testBtn.disabled = false;
            if (feedbackEl) {
              feedbackEl.textContent = '✅ Test réussi ! La voix fonctionne parfaitement.';
            }
          };
          activeAudio.onerror = () => {
            testBtn.disabled = false;
            if (feedbackEl) {
              feedbackEl.style.color = '#f87171';
              feedbackEl.textContent = '❌ Erreur de lecture audio.';
            }
          };
          await activeAudio.play();
        } catch (err) {
          testBtn.disabled = false;
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = '#f87171';
            feedbackEl.textContent = `❌ ${err.message || 'Erreur lors de la synthèse vocale.'}`;
          }
        }
      });
    }
  }

  bindEvents(currentSentence) {
    this.bindSampleWindowEvents();

    const textarea = this.container.querySelector('#dictation-textarea');
    const playBtn = this.container.querySelector('#btn-play-sentence');
    const replayBtn = this.container.querySelector('#btn-replay-sentence');
    const prevBtn = this.container.querySelector('#btn-prev-sentence');
    const nextBtn = this.container.querySelector('#btn-next-sentence');
    const clearBtn = this.container.querySelector('#btn-clear-text');
    const submitBtn = this.container.querySelector('#btn-evaluate-dictation');
    const speed075 = this.container.querySelector('#btn-speed-075');
    const speed100 = this.container.querySelector('#btn-speed-100');
    const tabSentence = this.container.querySelector('#tab-btn-sentence');
    const tabFull = this.container.querySelector('#tab-btn-full');
    const backBtn = this.container.querySelector('#btn-back-writing');
    const catalogBadge = this.container.querySelector('#btn-open-catalog');

    // Textarea input
    if (textarea) {
      textarea.addEventListener('input', () => {
        if (this.viewTab === 'sentence') {
          this.sentenceInputs[this.activeSentenceIndex] = textarea.value;
          this.fullTextInput = this.sentences.map((_, i) => this.sentenceInputs[i + 1] || '').filter(Boolean).join(' ');
        } else {
          this.fullTextInput = textarea.value;
        }
        this.saveDraft();
        // Update words count dynamically
        const count = countFrenchWords(textarea.value);
        const countEl = this.container.querySelector('.deck-words-counter strong');
        if (countEl) countEl.textContent = String(count);
        if (clearBtn) clearBtn.disabled = count === 0;
        if (submitBtn) submitBtn.disabled = count === 0;
      });
    }

    // Audio Play / Pause
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.playCurrentSentence();
      });
    }

    // Prev / Next (Immediately speaks the new sentence)
    if (prevBtn) prevBtn.addEventListener('click', () => this.handlePrev(true));
    if (nextBtn) nextBtn.addEventListener('click', () => this.handleNext(true));

    // Clear
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (this.viewTab === 'sentence') {
          this.sentenceInputs[this.activeSentenceIndex] = '';
        } else {
          this.fullTextInput = '';
        }
        this.saveDraft();
        this.render();
      });
    }

    // Submit
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitEvaluation();
      });
    }

    // Inline correction panel actions (006-inline-dictation-correction)
    const hideCorrectionBtn = this.container.querySelector('#btn-hide-correction');
    if (hideCorrectionBtn) {
      hideCorrectionBtn.addEventListener('click', () => {
        this.evaluation = null;
        this.render();
      });
    }

    const retryDictationBtn = this.container.querySelector('#btn-retry-dictation');
    if (retryDictationBtn) {
      retryDictationBtn.addEventListener('click', () => {
        this.evaluation = null;
        this.sentenceInputs = {};
        this.fullTextInput = '';
        this.activeSentenceIndex = 1;
        this.saveDraft();
        this.render();
      });
    }

    // Speed pills
    if (speed075) {
      speed075.addEventListener('click', () => {
        this.playbackRate = 0.75;
        this.render();
      });
    }
    if (speed100) {
      speed100.addEventListener('click', () => {
        this.playbackRate = 1.0;
        this.render();
      });
    }

    // Voice selector
    const voiceSelect = this.container.querySelector('#dictation-voice-select');
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val) {
          if (val.startsWith('gcloud:') && !googleCloudTtsService.hasApiKey()) {
            this.showApiKeyModal = true;
            this.render();
            return;
          }
          this.fallbackAlert = null;
          speechSynthesizer.setVoice(val);
          // Jouer un court extrait de la voix choisie pour confirmation sonore immédiate
          this.previewCurrentVoice();
        }
      });
    }

    // Voice Preview button
    const previewVoiceBtn = this.container.querySelector('#btn-preview-voice');
    if (previewVoiceBtn) {
      previewVoiceBtn.addEventListener('click', () => {
        this.previewCurrentVoice();
      });
    }

    // Voice Fallback Banner actions
    const fixVoiceBtn = this.container.querySelector('#btn-fix-voice-settings');
    if (fixVoiceBtn) {
      fixVoiceBtn.addEventListener('click', () => {
        this.showApiKeyModal = true;
        this.render();
      });
    }

    const closeFallbackBtn = this.container.querySelector('#btn-close-voice-fallback');
    if (closeFallbackBtn) {
      closeFallbackBtn.addEventListener('click', () => {
        this.fallbackAlert = null;
        this.render();
      });
    }

    // Voice Settings button
    const openVoiceSettingsBtn = this.container.querySelector('#btn-open-voice-settings');
    if (openVoiceSettingsBtn) {
      openVoiceSettingsBtn.addEventListener('click', () => {
        this.showApiKeyModal = true;
        this.render();
      });
    }

    // Tabs
    if (tabSentence) {
      tabSentence.addEventListener('click', () => {
        this.viewTab = 'sentence';
        this.render();
      });
    }
    if (tabFull) {
      tabFull.addEventListener('click', () => {
        this.viewTab = 'full';
        this.fullTextInput = this.sentences.map((_, i) => this.sentenceInputs[i + 1] || '').filter(Boolean).join(' ');
        this.render();
      });
    }

    // Accents insertion
    this.container.querySelectorAll('.btn-deck-accent').forEach(btn => {
      btn.addEventListener('click', () => {
        const char = btn.getAttribute('data-char');
        if (textarea && char) {
          const start = textarea.selectionStart || 0;
          const end = textarea.selectionEnd || 0;
          const val = textarea.value;
          textarea.value = val.substring(0, start) + char + val.substring(end);
          textarea.setSelectionRange(start + char.length, start + char.length);
          textarea.focus();
          textarea.dispatchEvent(new Event('input'));
        }
      });
    });

    // Back to writing view
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.hash = '#writing';
      });
    }


    if (catalogBadge) {
      catalogBadge.addEventListener('click', () => {
        this.showCatalogModal = true;
        this.render();
      });
    }

    // Modal close & select
    const closeBtn = this.container.querySelector('#btn-close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.showCatalogModal = false;
        this.render();
      });
    }

    const backdrop = this.container.querySelector('#catalog-modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.showCatalogModal = false;
          this.render();
        }
      });
    }

    this.container.querySelectorAll('#catalog-modal-backdrop .dictation-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const found = DICTATION_EXERCISES.find(ex => ex.id === id);
        if (found) {
          this.loadExercise(found);
        }
      });
    });

    // Voice Settings Modal events
    this.bindVoiceSettingsModalEvents();
  }

  /**
   * Tạo danh sách tùy chọn giọng đọc tiếng Pháp cho dropdown (chia nhóm Cloud AI & Web Speech)
   */
  renderVoiceOptions() {
    const voices = speechSynthesizer.getFrenchVoices();
    if (!voices || voices.length === 0) {
      return '<option value="">Voix système par défaut</option>';
    }
    const currentVoiceURI = speechSynthesizer.selectedVoice?.voiceURI;
    const hasApiKey = googleCloudTtsService.hasApiKey();

    const cloudVoices = voices.filter(v => v.isCloud);
    const localVoices = voices.filter(v => !v.isCloud);

    let html = '';
    if (cloudVoices.length > 0) {
      const cloudOptions = cloudVoices.map(v => {
        const isSelected = (v.voiceURI === currentVoiceURI);
        let label = SpeechSynthesizer.formatVoiceName(v);
        if (!hasApiKey) {
          label += ' (Clé requise 🔑)';
        }
        return `<option value="${this.escapeHtml(v.voiceURI)}" ${isSelected ? 'selected' : ''}>${this.escapeHtml(label)}</option>`;
      }).join('');
      html += `<optgroup label="✨ Google Cloud AI (Studio & Neural)">${cloudOptions}</optgroup>`;
    }

    if (localVoices.length > 0) {
      const localOptions = localVoices.map(v => {
        const isSelected = (v.voiceURI === currentVoiceURI) || (!currentVoiceURI && !cloudVoices.length && v === localVoices[0]);
        const label = SpeechSynthesizer.formatVoiceName(v);
        return `<option value="${this.escapeHtml(v.voiceURI)}" ${isSelected ? 'selected' : ''}>${this.escapeHtml(label)}</option>`;
      }).join('');
      html += `<optgroup label="🗣️ Web Speech (Local & Hors-ligne)">${localOptions}</optgroup>`;
    }

    return html || '<option value="">Voix système par défaut</option>';
  }

  /**
   * Đồng bộ hóa trạng thái giao diện nút Play/Pause/Resume
   * - isPlaying && !isPaused: '⏸ Pause' (màu cam, class 'playing')
   * - isPaused: '► Reprendre' (màu xanh lá, class 'paused')
   * - Idle: '► Écouter' (màu tím/xanh chuẩn)
   */
  updatePlayButtonUI() {
    const playBtn = this.container?.querySelector('#btn-play-sentence');
    if (!playBtn) return;
    const span = playBtn.querySelector('span');
    if (this.isPlaying && !this.isPaused) {
      playBtn.classList.remove('paused');
      playBtn.classList.add('playing');
      if (span) span.textContent = '⏸ Pause';
    } else if (this.isPaused) {
      playBtn.classList.remove('playing');
      playBtn.classList.add('paused');
      if (span) span.textContent = '► Reprendre';
    } else {
      playBtn.classList.remove('playing', 'paused');
      if (span) span.textContent = '► Écouter';
    }
  }

  /**
   * Lùi về câu trước (Ctrl + Mũi tên trái).
   * Tự động phát âm ngay câu mới nếu autoPlay = true.
   */
  handlePrev(autoPlay = true) {
    speechSynthesizer.stop();
    this.isPlaying = false;
    this.isPaused = false;
    if (this.activeSentenceIndex > 1) {
      this.activeSentenceIndex--;
      if (autoPlay) {
        this.isPlaying = true;
      }
      this.render();
      if (autoPlay) {
        this.playCurrentSentence();
      }
    } else if (autoPlay) {
      // Re-read current sentence if already at first sentence
      this.playCurrentSentence();
    }
    this.focusTextarea();
  }

  /**
   * Tiến sang câu kế tiếp (Ctrl + Mũi tên phải).
   * Tự động phát âm ngay câu mới nếu autoPlay = true.
   */
  handleNext(autoPlay = true) {
    speechSynthesizer.stop();
    this.isPlaying = false;
    this.isPaused = false;
    if (this.activeSentenceIndex < this.sentences.length) {
      this.activeSentenceIndex++;
      if (autoPlay) {
        this.isPlaying = true;
      }
      this.render();
      if (autoPlay) {
        this.playCurrentSentence();
      }
    } else if (autoPlay) {
      // Re-read current sentence if already at last sentence
      this.playCurrentSentence();
    }
    this.focusTextarea();
  }

  focusTextarea() {
    const textarea = this.container?.querySelector('#dictation-textarea');
    if (textarea) {
      textarea.focus();
      const len = textarea.value.length;
      textarea.setSelectionRange(len, len);
    }
  }

  /**
   * Soumettre la dictée et calculer l'évaluation pédagogique
   * (Déclenché par le bouton ou le raccourci Ctrl+Enter / Cmd+Enter)
   */
  submitEvaluation() {
    const textarea = this.container ? this.container.querySelector('#dictation-textarea') : document.getElementById('dictation-textarea');
    if (textarea) {
      if (this.viewTab === 'sentence') {
        this.sentenceInputs[this.activeSentenceIndex] = textarea.value;
        this.fullTextInput = this.sentences.map((_, i) => this.sentenceInputs[i + 1] || '').filter(Boolean).join(' ');
      } else {
        this.fullTextInput = textarea.value;
        // Parse full text into sentence inputs if user typed in full text tab
        const parsed = splitFrenchSentences(this.fullTextInput);
        this.sentences.forEach((_, idx) => {
          if (parsed[idx]) {
            this.sentenceInputs[idx + 1] = parsed[idx].text;
          }
        });
      }
      this.saveDraft();
    }

    const currentText = this.viewTab === 'sentence'
      ? (this.sentenceInputs[this.activeSentenceIndex] || (textarea ? textarea.value : ''))
      : (this.fullTextInput || (textarea ? textarea.value : ''));

    // Guard against empty submission
    if (countFrenchWords(currentText) === 0) {
      return;
    }

    this.evaluation = evaluateDictation(this.currentExercise, this.sentenceInputs);
    this.render();
    setTimeout(() => {
      const panel = this.container ? this.container.querySelector('#dictation-correction-panel') : document.getElementById('dictation-correction-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  /**
   * Bộ xử lý phím tắt tập trung cho Dictation View:
   * - Ctrl+Enter (hoặc Cmd+Enter): Corriger ma dictée (từ bất kỳ đâu kể cả trong textarea)
   * - Space (ngoài ô nhập): Toggle Play / Pause / Resume
   * - Space (trong ô nhập): Gõ dấu cách bình thường (không toggle audio)
   * - Ctrl+R (hoặc Cmd+R): Phát lại câu hiện tại từ đầu (Replay, chặn reload trang)
   * - Ctrl+Left: Câu trước
   * - Ctrl+Right: Câu sau
   */
  handleKeyDown(e) {
    const el = document.getElementById('view-dictation');
    if (!el || el.style.display === 'none' || !el.classList.contains('active')) {
      return;
    }
    if (this.isWindowEditing) {
      return;
    }
    if (e.target && e.target.id === 'sample-window-textarea') {
      return;
    }

    const isInputTarget = e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT');
    const isSpace = e.code === 'Space' || e.key === ' ' || e.keyCode === 32;
    const isR = e.key === 'r' || e.key === 'R' || e.code === 'KeyR';
    const isEnter = e.key === 'Enter' || e.code === 'Enter';

    // 0. CTRL+ENTER (hoặc CMD+ENTER): Đánh giá / Corriger ma dictée
    if ((e.ctrlKey || e.metaKey) && isEnter) {
      e.preventDefault();
      e.stopPropagation();
      this.submitEvaluation();
      return;
    }

    // 1. CTRL+R (hoặc CMD+R): Phát lại câu hiện tại từ đầu (Replay)
    if ((e.ctrlKey || e.metaKey) && isR) {
      e.preventDefault();
      e.stopPropagation();
      this.playCurrentSentence();
      return;
    }

    // 2. CTRL+SPACE (hoặc CMD+SPACE): Bật/tắt phát âm (Play / Pause / Resume) cho nút Écouter
    if ((e.ctrlKey || e.metaKey) && isSpace) {
      e.preventDefault();
      e.stopPropagation();
      this.togglePlayPause();
      return;
    }

    // 3. Phím Space khi đang gõ văn bản trong textarea/input: Cho phép chèn dấu cách tự nhiên
    if (isSpace && isInputTarget && !e.ctrlKey && !e.metaKey && !e.altKey) {
      return; // Browser tự chèn dấu cách bình thường
    }

    // 4. Phím CTRL+LEFT / CTRL+RIGHT điều hướng câu
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') {
        e.preventDefault();
        e.stopPropagation();
        this.handlePrev(true);
      } else if (e.key === 'ArrowRight' || e.code === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        this.handleNext(true);
      }
    }
  }

  /**
   * Bật/tắt trạng thái phát âm:
   * - Đang phát -> Tạm dừng (Pause), lưu vị trí từ
   * - Đang tạm dừng -> Đọc tiếp (Resume) từ vị trí từ đó
   * - Chưa phát -> Phát từ đầu câu
   */
  togglePlayPause() {
    if (this.isPlaying && !this.isPaused) {
      // Audio is playing -> Pause it!
      speechSynthesizer.pause();
      this.isPlaying = false;
      this.isPaused = true;
      this.updatePlayButtonUI();
    } else if (this.isPaused) {
      // Audio is paused -> Resume it!
      speechSynthesizer.resume();
      this.isPaused = false;
      this.isPlaying = true;
      this.updatePlayButtonUI();
    } else {
      // Idle -> Play current sentence from beginning
      this.playCurrentSentence();
    }
  }

  playCurrentSentence() {
    const currentSentence = this.sentences[this.activeSentenceIndex - 1];
    if (!currentSentence || !currentSentence.text) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.updatePlayButtonUI();

    speechSynthesizer.speakSentence(currentSentence.text, {
      rate: this.playbackRate,
      lang: 'fr-FR',
      onStart: () => {
        this.isPlaying = true;
        this.isPaused = false;
        this.updatePlayButtonUI();
      },
      onEnd: () => {
        if (this.isPaused) return;
        this.isPlaying = false;
        this.isPaused = false;
        this.updatePlayButtonUI();
      },
      onError: () => {
        if (this.isPaused) return;
        this.isPlaying = false;
        this.isPaused = false;
        this.updatePlayButtonUI();
      }
    });
  }

  // --- INLINE CORRECTION SECTION (006-inline-dictation-correction) ---
  renderCorrectionSection(ev) {
    if (!ev) return '';

    const sentenceDiffsHtml = ev.sentenceResults.map((s, idx) => {
      const tokensHtml = s.tokens.map(tok => {
        if (tok.type === 'equal') {
          return `<span style="color: #f1f5f9;">${tok.word} </span>`;
        } else if (tok.type === 'replace') {
          return `<span style="background: rgba(239, 68, 68, 0.25); color: #fca5a5; text-decoration: line-through; padding: 2px 4px; border-radius: 3px;">${tok.actual}</span> <span style="background: rgba(16, 185, 129, 0.25); color: #6ee7b7; font-weight: 600; padding: 2px 4px; border-radius: 3px;">${tok.expected} </span>`;
        } else if (tok.type === 'missing') {
          return `<span style="background: rgba(245, 158, 11, 0.25); color: #fcd34d; font-style: italic; padding: 2px 4px; border-radius: 3px;">[omis: ${tok.expected}] </span>`;
        } else if (tok.type === 'insertion') {
          return `<span style="background: rgba(239, 68, 68, 0.25); color: #fca5a5; padding: 2px 4px; border-radius: 3px;">[en trop: ${tok.actual}] </span>`;
        }
        return '';
      }).join('');

      return `
        <div class="correction-sentence-card">
          <div class="correction-sentence-header">
            <span>Phrase ${idx + 1}</span>
            <span style="color: ${s.accuracy >= 80 ? '#10b981' : '#f59e0b'};">Précision : ${s.accuracy}%</span>
          </div>
          <div class="correction-sentence-body">
            ${tokensHtml}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div id="dictation-correction-panel">
        <div class="correction-header">
          <div class="correction-header-left">
            <h3 class="correction-header-title">
              <span>🎯</span>
              <span>Rapport de Correction</span>
            </h3>
            <span class="badge-level-pill">${this.currentExercise.level}</span>
          </div>

          <div class="correction-header-actions">
            <button class="btn-correction-action btn-hide" id="btn-hide-correction" title="Masquer la correction sans effacer votre texte">
              ✕ Masquer
            </button>
            <button class="btn-correction-action btn-retry" id="btn-retry-dictation" title="Recommencer cet exercice à zéro">
              🔄 Recommencer
            </button>
          </div>
        </div>

        <div class="correction-stats-card">
          <div>
            <div class="correction-score-big">${ev.overallAccuracy}%</div>
            <div class="correction-score-label">Exactitude orthographique globale</div>
          </div>

          <div class="correction-chips-grid">
            <div class="correction-stat-chip">
              <div class="correction-stat-chip-val" style="color: #ffffff;">${ev.totalCorrect}/${ev.totalExpected}</div>
              <div class="correction-stat-chip-label">Mots justes</div>
            </div>
            <div class="correction-stat-chip">
              <div class="correction-stat-chip-val" style="color: #f59e0b;">${ev.mistakeSummary.homophone}</div>
              <div class="correction-stat-chip-label">Homophones</div>
            </div>
            <div class="correction-stat-chip">
              <div class="correction-stat-chip-val" style="color: #38bdf8;">${ev.mistakeSummary.agreement}</div>
              <div class="correction-stat-chip-label">Accords</div>
            </div>
          </div>
        </div>

        <div class="correction-pedagogical-banner">
          <strong>Bilan pédagogique :</strong> ${ev.cefrFeedback}
        </div>

        <div>
          <h4 class="correction-details-title">Correction détaillée :</h4>
          ${sentenceDiffsHtml}
        </div>
      </div>
    `;
  }

  // --- PERSISTENCE ---
  saveDraft() {
    try {
      const draft = {
        exerciseId: this.currentExercise.id,
        level: this.currentExercise.level,
        activeSentenceIndex: this.activeSentenceIndex,
        sentenceInputs: this.sentenceInputs,
        fullTextInput: this.fullTextInput
      };
      localStorage.setItem('frenchlab_active_dictation', JSON.stringify(draft));
    } catch (e) {
      // Ignore
    }
  }

  loadDraft() {
    try {
      const raw = localStorage.getItem('frenchlab_active_dictation');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft && draft.exerciseId) {
          let found = DICTATION_EXERCISES.find(e => e.id === draft.exerciseId);
          if (!found) {
            try {
              const customList = JSON.parse(localStorage.getItem('frenchlab_custom_dictations') || '[]');
              found = customList.find(e => e.id === draft.exerciseId);
            } catch {
              // Ignore
            }
          }
          if (found) {
            this.currentExercise = found;
            this.initExercise();
            this.activeSentenceIndex = draft.activeSentenceIndex || 1;
            this.sentenceInputs = draft.sentenceInputs || {};
            this.fullTextInput = draft.fullTextInput || '';
          }
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  bindSampleWindowEvents() {
    // 1. Level chips
    this.container.querySelectorAll('.btn-window-level').forEach(chip => {
      chip.addEventListener('click', () => {
        const lvl = chip.getAttribute('data-window-level');
        if (lvl) {
          if (this.isWindowEditing) {
            this.currentExercise.level = lvl;
            this.render();
            const textarea = this.container.querySelector('#sample-window-textarea');
            if (textarea) {
              textarea.focus();
            }
            return;
          }
          const found = DICTATION_EXERCISES.find(e => e.level === lvl) || AITextGenerator.generateText({ level: lvl });
          this.loadExercise(found);
        }
      });
    });

    // 2. Open edit/paste mode
    const openEditBtn = this.container.querySelector('#btn-open-edit-sample');
    if (openEditBtn) {
      openEditBtn.addEventListener('click', () => {
        this.isWindowEditing = true;
        this.windowEditText = this.currentExercise.fullText;
        this.render();
        const textarea = this.container.querySelector('#sample-window-textarea');
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      });
    }

    // 3. Cancel edit mode
    const cancelEditBtn = this.container.querySelector('#btn-cancel-edit-sample');
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => {
        this.isWindowEditing = false;
        this.render();
      });
    }

    // 4. Edit textarea input listener for live counter
    const sampleTextarea = this.container.querySelector('#sample-window-textarea');
    if (sampleTextarea) {
      sampleTextarea.addEventListener('input', (e) => {
        this.windowEditText = e.target.value;
        const w = countFrenchWords(this.windowEditText);
        const s = splitFrenchSentences(this.windowEditText).length;
        const statsEl = this.container.querySelector('#sample-edit-stats');
        if (statsEl) {
          statsEl.innerHTML = `📊 <strong>${w} mots</strong> • <strong>${s} phrase${s > 1 ? 's' : ''}</strong>`;
        }
        const valBtn = this.container.querySelector('#btn-validate-sample-text');
        if (valBtn) {
          valBtn.disabled = w < 3;
        }
      });
    }

    // 5. Validate and launch custom text
    const validateBtn = this.container.querySelector('#btn-validate-sample-text');
    if (validateBtn) {
      validateBtn.addEventListener('click', () => {
        const trimmed = this.windowEditText.trim();
        if (countFrenchWords(trimmed) >= 3) {
          const customEx = {
            id: `custom-${Date.now()}`,
            title: `Texte personnalisé (${this.currentExercise.level || 'B1'})`,
            level: this.currentExercise.level || 'B1',
            category: 'Texte Personnalisé',
            fullText: trimmed,
            source: 'copy-paste',
            grammarPoints: ['Texte Libre'],
            createdAt: new Date().toISOString()
          };
          this.saveCustomExercise(customEx);
          this.isWindowEditing = false;
          this.loadExercise(customEx);
        }
      });
    }

    // 6. AI Generate button
    const aiGenBtn = this.container.querySelector('#btn-sample-generate-ai');
    if (aiGenBtn) {
      aiGenBtn.addEventListener('click', () => {
        const gen = AITextGenerator.generateText({ level: this.currentExercise.level || 'B1' });
        this.saveCustomExercise(gen);
        this.loadExercise(gen);
      });
    }

    // 7. AI Random Topic button
    const randomTopicBtn = this.container.querySelector('#btn-sample-random-topic');
    if (randomTopicBtn) {
      randomTopicBtn.addEventListener('click', () => {
        const randomTopic = AITextGenerator.getRandomTopic();
        const gen = AITextGenerator.generateText({ level: randomTopic.level, category: randomTopic.category });
        this.saveCustomExercise(gen);
        this.loadExercise(gen);
      });
    }
  }

  saveCustomExercise(exercise) {
    try {
      const key = 'frenchlab_custom_dictations';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const filtered = list.filter(item => item.fullText.trim() !== exercise.fullText.trim());
      filtered.unshift(exercise);
      if (filtered.length > 50) filtered.length = 50;
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {
      // Ignore
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
