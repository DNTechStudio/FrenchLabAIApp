/**
 * ConversationView: Main view for Conversation Mode (Situational Multi-Party Dialogues)
 * Coordinates Scenario Card, Custom Scenario Form, Turn-by-Turn Chat Stream with TTS audio, and Turn Input Console
 */

import { getRandomConversationScenario, CONVERSATION_SCENARIOS } from '../../data/conversation/conversationScenarios.js';
import { saveCustomConversationScenario, getRandomCombinedConversationScenario } from '../../data/conversation/customConversationStorage.js';
import { ConversationEngine } from '../../core/conversation/ConversationEngine.js';
import { ConversationScenarioCard } from '../components/ConversationScenarioCard.js';
import { CustomConversationForm } from '../components/CustomConversationForm.js';
import { ConversationTurnInput } from '../components/ConversationTurnInput.js';
import { SpeechSpeedController } from '../components/SpeechSpeedController.js';
import { getSavedSpeed } from '../../core/speech/voicePresets.js';
import { i18n } from '../../core/i18n/I18nManager.js';

const CONV_STORAGE_KEY = 'delf_speaking_conversation_session';

export class ConversationView {
  constructor({
    audioRecorder,
    speechRecognizer,
    voiceSynthesizer
  } = {}) {
    this.audioRecorder = audioRecorder;
    this.speechRecognizer = speechRecognizer;
    this.voiceSynthesizer = voiceSynthesizer;

    const saved = this.loadSavedSession();
    this.currentScenario = saved?.scenario || CONVERSATION_SCENARIOS[0];
    this.currentLevel = saved?.level || (this.currentScenario.defaultLevel || 'B1');

    this.engine = new ConversationEngine({
      scenario: this.currentScenario,
      level: this.currentLevel
    });

    // Restore saved turns if they match the current scenario
    if (Array.isArray(saved?.turns) && saved.turns.length > 0 && saved?.scenario?.id === this.currentScenario.id) {
      this.engine.turns = saved.turns;
    }

    this.scenarioCardComponent = null;
    this.customFormComponent = null;
    this.turnInputComponent = null;
    this.container = null;
  }

  loadSavedSession() {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      if (storage) {
        const raw = storage.getItem(CONV_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      }
    } catch (err) {}
    return null;
  }

  saveSession() {
    try {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
      if (storage) {
        storage.setItem(CONV_STORAGE_KEY, JSON.stringify({
          scenario: this.currentScenario,
          level: this.currentLevel,
          turns: this.engine.getTurns()
        }));
      }
    } catch (err) {}
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'view-container conversation-view';

    this.renderWorkspaceDOM();
    return this.container;
  }

  renderWorkspaceDOM() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const viewWrapper = document.createElement('div');

    viewWrapper.innerHTML = `
      <!-- Hero Header -->
      <div class="glass-panel" style="margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge badge-primary" style="margin-bottom: 0.35rem;">
            💬 ${i18n.t('conversation.badge') || 'Mode Conversation'}
          </span>
          <h1 style="font-size: var(--text-2xl); margin-bottom: 0.25rem;">
            ${i18n.t('conversation.title') || 'Dialogues en Situations Réelles'}
          </h1>
          <p style="font-size: var(--text-xs); color: var(--text-muted);">
            ${i18n.t('conversation.subtitle') || 'Entraînez-vous à l’oral dans des situations concrètes du quotidien, au travail, à l’université ou en consultation.'}
          </p>
        </div>

        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button type="button" class="btn btn-secondary restart-dialogue-btn" style="padding: 0.45rem 0.85rem; font-size: var(--text-xs);" title="Recommencer ce dialogue depuis le début">
            🔄 ${i18n.t('conversation.restart_dialogue') || 'Recommencer'}
          </button>
        </div>
      </div>

      <!-- Custom Scenario Form Slot -->
      <div class="custom-scenario-form-slot"></div>

      <!-- Active Scenario Card Slot -->
      <div class="scenario-card-slot"></div>

      <!-- Conversation Stream Card -->
      <div class="glass-panel conversation-stream-panel" style="margin-bottom: 1rem; min-height: 280px; max-height: 480px; overflow-y: auto; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; scroll-behavior: smooth;">
        <!-- Turns rendered here -->
      </div>

      <!-- Candidate Turn Input Console Slot -->
      <div class="turn-input-slot"></div>
    `;

    this.container.appendChild(viewWrapper);

    // 1. Mount Custom Scenario Form
    this.customFormComponent = new CustomConversationForm({
      onSubmit: (scenarioData) => {
        const saved = saveCustomConversationScenario(scenarioData);
        this.switchScenario(saved);
        this.customFormComponent.setOpen(false);
      },
      onCancel: () => {
        this.customFormComponent.setOpen(false);
      }
    });
    this.container.querySelector('.custom-scenario-form-slot')?.appendChild(this.customFormComponent.render());

    // 2. Mount Scenario Card
    this.scenarioCardComponent = new ConversationScenarioCard({
      scenario: this.currentScenario,
      currentLevel: this.currentLevel,
      onLevelChange: (lvl) => {
        this.currentLevel = lvl;
        this.engine.setLevel(lvl);
        this.saveSession();
        this.updateInputSuggestions();
      },
      onRandomScenario: () => {
        const rand = getRandomCombinedConversationScenario();
        this.switchScenario(rand);
      },
      onToggleCustomForm: () => {
        this.customFormComponent.toggle();
      }
    });
    this.container.querySelector('.scenario-card-slot')?.appendChild(this.scenarioCardComponent.render());

    // 3. Mount Turn Input Console
    this.turnInputComponent = new ConversationTurnInput({
      audioRecorder: this.audioRecorder,
      speechRecognizer: this.speechRecognizer,
      suggestedReplies: this.engine.getSuggestedReplies(),
      onSubmitTurn: (userText) => {
        this.handleUserReply(userText);
      }
    });
    this.container.querySelector('.turn-input-slot')?.appendChild(this.turnInputComponent.render());

    // 4. Render Conversation Stream Turns
    this.renderStreamTurns();

    // 5. Bind Restart Button
    this.container.querySelector('.restart-dialogue-btn')?.addEventListener('click', () => {
      this.engine.reset();
      this.saveSession();
      this.renderStreamTurns();
      this.updateInputSuggestions();
    });
  }

  switchScenario(newScenario) {
    this.currentScenario = newScenario;
    this.currentLevel = newScenario.defaultLevel || this.currentLevel || 'B1';
    this.engine = new ConversationEngine({
      scenario: this.currentScenario,
      level: this.currentLevel
    });
    this.saveSession();

    if (this.scenarioCardComponent) {
      this.scenarioCardComponent.setScenario(newScenario, this.currentLevel);
    }
    this.renderStreamTurns();
    this.updateInputSuggestions();
  }

  updateInputSuggestions() {
    if (this.turnInputComponent) {
      this.turnInputComponent.setSuggestedReplies(this.engine.getSuggestedReplies());
    }
  }

  handleUserReply(userText) {
    try {
      this.engine.processUserTurn(userText);
      this.saveSession();
      this.renderStreamTurns(true);
      this.updateInputSuggestions();
    } catch (err) {
      console.error('Failed to process user turn:', err);
      alert("Erreur lors de l'envoi de la réplique : " + err.message);
    }
  }

  renderStreamTurns(autoScroll = false) {
    const streamPanel = this.container?.querySelector('.conversation-stream-panel');
    if (!streamPanel) return;
    streamPanel.innerHTML = '';

    const turns = this.engine.getTurns();

    turns.forEach(turn => {
      const isUser = turn.isUser;
      const bubble = document.createElement('div');
      bubble.className = `conv-turn-bubble ${isUser ? 'user-turn' : 'ai-turn'}`;
      bubble.style.display = 'flex';
      bubble.style.flexDirection = 'column';
      bubble.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
      bubble.style.maxWidth = '85%';
      bubble.style.background = isUser ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      bubble.style.border = isUser ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--border-color)';
      bubble.style.borderRadius = 'var(--radius-md)';
      bubble.style.padding = '0.75rem 1rem';

      // Header row
      const headerRow = document.createElement('div');
      headerRow.style.display = 'flex';
      headerRow.style.justifyContent = 'space-between';
      headerRow.style.alignItems = 'center';
      headerRow.style.marginBottom = '0.35rem';
      headerRow.style.gap = '0.5rem';

      headerRow.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; font-weight: 700;">
          <span>${isUser ? '🧑' : (turn.voiceGender === 'female' ? '👩' : '👨')}</span>
          <span style="color: ${isUser ? '#60a5fa' : '#e2e8f0'};">${turn.speakerName}</span>
          ${turn.role ? `<span style="font-weight: 400; color: var(--text-muted); font-size: 0.7rem;">(${turn.role})</span>` : ''}
        </div>
      `;

      // Text content
      const textDiv = document.createElement('div');
      textDiv.style.fontSize = 'var(--text-sm)';
      textDiv.style.lineHeight = '1.6';
      textDiv.style.color = 'var(--text-color)';
      textDiv.textContent = turn.text;

      bubble.appendChild(headerRow);
      bubble.appendChild(textDiv);

      // If AI turn, add audio playback with speed controls
      if (!isUser) {
        const audioRow = document.createElement('div');
        audioRow.style.display = 'flex';
        audioRow.style.alignItems = 'center';
        audioRow.style.gap = '0.75rem';
        audioRow.style.marginTop = '0.5rem';
        audioRow.style.paddingTop = '0.4rem';
        audioRow.style.borderTop = '1px dashed rgba(255,255,255,0.08)';

        const playBtn = document.createElement('button');
        playBtn.type = 'button';
        playBtn.className = 'btn btn-secondary conv-play-btn';
        playBtn.style.padding = '0.25rem 0.65rem';
        playBtn.style.fontSize = '0.75rem';
        playBtn.innerHTML = '🔊 Écouter';

        const speedController = new SpeechSpeedController({
          currentSpeed: getSavedSpeed(1.0)
        });

        playBtn.addEventListener('click', () => {
          if (this.voiceSynthesizer && typeof this.voiceSynthesizer.speak === 'function') {
            playBtn.innerHTML = '⏳ Lecture...';
            this.voiceSynthesizer.speak({
              text: turn.text,
              rate: speedController.getSpeed(),
              onEnd: () => {
                playBtn.innerHTML = '🔊 Écouter';
              },
              onError: () => {
                playBtn.innerHTML = '🔊 Écouter';
              }
            });
          }
        });

        audioRow.appendChild(playBtn);
        audioRow.appendChild(speedController.render());
        bubble.appendChild(audioRow);
      }

      streamPanel.appendChild(bubble);
    });

    if (autoScroll || turns.length > 1) {
      setTimeout(() => {
        streamPanel.scrollTop = streamPanel.scrollHeight;
      }, 50);
    }
  }

  destroy() {
    if (this.turnInputComponent) {
      this.turnInputComponent.destroy();
    }
    if (this.voiceSynthesizer) {
      this.voiceSynthesizer.stop?.();
    }
  }
}
