/**
 * Daily Conversation View Controller (Pillar III - PRO-07)
 * Implements 2-Party and 3-Party Situational Roleplays with alternating turns and expression suggestions.
 */

import { CONVERSATION_SCENARIOS } from '../data/scenarios.js';

export class ConversationView {
  constructor({ container }) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.selectedScenario = CONVERSATION_SCENARIOS[0];
    this.partyMode = '2-party'; // '2-party' | '3-party'
    this.history = [];
    this.isRecording = false;
    this.currentSpeakerIndex = 0;
  }

  render() {
    if (!this.container) return;

    const scenarioCardsHtml = CONVERSATION_SCENARIOS.map(s => `
      <div class="scenario-card ${s.id === this.selectedScenario.id ? 'active' : ''}" data-id="${s.id}">
        <div class="scenario-meta">
          <span class="badge badge-cyan">${s.category}</span>
          <span class="badge badge-emerald">${s.level}</span>
        </div>
        <div class="scenario-title">${s.title}</div>
        <div class="scenario-desc">${s.description}</div>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="conversation-container">
        <header class="conversation-header">
          <div class="conversation-title-box">
            <h1>☕ Conversations Quotidiennes</h1>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 4px;">
              Jeux de rôles situationnels en immersion réelle (A1 - C2) • Mode 2 personnes & 3 personnes
            </div>
          </div>
          <div class="party-mode-toggle">
            <button id="btn-mode-2p" class="party-mode-btn ${this.partyMode === '2-party' ? 'active' : ''}">2 Personnes (Duo)</button>
            <button id="btn-mode-3p" class="party-mode-btn ${this.partyMode === '3-party' ? 'active' : ''}">3 Personnes (Trio)</button>
          </div>
        </header>

        <div class="conversation-layout">
          <!-- Scenarios Catalog -->
          <div class="scenarios-panel">
            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; color: var(--accent-cyan);">
              Sélectionnez une situation :
            </div>
            ${scenarioCardsHtml}
          </div>

          <!-- Chat Interactive Stage -->
          <div class="chat-stage">
            <div class="stage-topbar">
              <div>
                <div style="font-weight: 600; font-size: 1.05rem;">${this.selectedScenario.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">🎯 Objectif : ${this.selectedScenario.objective}</div>
              </div>
              <button id="btn-reset-conversation" class="btn-secondary" style="font-size: 0.8rem; padding: 4px 10px;">Réinitialiser</button>
            </div>

            <div class="chat-timeline" id="conversation-timeline">
              <!-- Messages injected here -->
            </div>

            <!-- Graduated Suggestions Bar -->
            <div class="suggestions-bar">
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--accent-cyan);">💡 Suggestions d'expression :</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="suggestion-chip" data-text="${this.selectedScenario.starterA2}">
                  <span class="badge badge-amber" style="padding: 2px 6px;">A2 Standard</span>
                  <span>"${this.selectedScenario.starterA2}"</span>
                </button>
                <button class="suggestion-chip" data-text="${this.selectedScenario.starterB2}">
                  <span class="badge badge-emerald" style="padding: 2px 6px;">B2 Élevé</span>
                  <span>"${this.selectedScenario.starterB2}"</span>
                </button>
              </div>
            </div>

            <!-- Input Bar -->
            <div class="chat-input-bar">
              <button id="btn-conversation-mic" class="btn-mic" title="Parler au micro">🎙️</button>
              <input type="text" id="conversation-text-input" class="chat-input" placeholder="Répondez en français ou cliquez sur une suggestion ci-dessus..." />
              <button id="btn-conversation-send" class="btn-primary" style="padding: 10px 18px;">Envoyer</button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    if (this.history.length === 0) {
      this.initScenario();
    } else {
      this.renderMessages();
    }
  }

  bindEvents() {
    // Scenario card selection
    const cards = this.container.querySelectorAll('.scenario-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const found = CONVERSATION_SCENARIOS.find(s => s.id === id);
        if (found) {
          this.selectedScenario = found;
          this.history = [];
          this.render();
        }
      });
    });

    // Party mode toggle
    const btn2p = this.container.querySelector('#btn-mode-2p');
    const btn3p = this.container.querySelector('#btn-mode-3p');
    if (btn2p && btn3p) {
      btn2p.addEventListener('click', () => {
        this.partyMode = '2-party';
        this.history = [];
        this.render();
      });
      btn3p.addEventListener('click', () => {
        this.partyMode = '3-party';
        this.history = [];
        this.render();
      });
    }

    // Reset button
    const resetBtn = this.container.querySelector('#btn-reset-conversation');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.history = [];
        this.initScenario();
      });
    }

    // Input & Send
    const input = this.container.querySelector('#conversation-text-input');
    const sendBtn = this.container.querySelector('#btn-conversation-send');
    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;
        this.sendUserMessage(val);
        input.value = '';
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = input.value.trim();
          if (!val) return;
          this.sendUserMessage(val);
          input.value = '';
        }
      });
    }

    // Suggestions click
    const chips = this.container.querySelectorAll('.suggestion-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-text');
        if (input && text) {
          input.value = text;
          input.focus();
        }
      });
    });

    // Mic button
    const micBtn = this.container.querySelector('#btn-conversation-mic');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        this.toggleSpeechRecognition(micBtn, input);
      });
    }
  }

  initScenario() {
    this.history = [];
    const characters = this.partyMode === '3-party'
      ? this.selectedScenario.threePartyCharacters
      : this.selectedScenario.characters;

    const firstChar = characters[0];

    this.history.push({
      sender: firstChar.name,
      avatar: firstChar.avatar,
      isUser: false,
      text: this.selectedScenario.openingMessage
    });

    this.renderMessages();
    this.speakText(this.selectedScenario.openingMessage);
  }

  sendUserMessage(text) {
    this.history.push({
      sender: 'Vous',
      avatar: '👤',
      isUser: true,
      text: text
    });

    this.renderMessages();

    // AI Response(s)
    setTimeout(() => {
      this.generateAiResponse();
    }, 600);
  }

  generateAiResponse() {
    const characters = this.partyMode === '3-party'
      ? this.selectedScenario.threePartyCharacters.filter(c => !c.isUser)
      : this.selectedScenario.characters.filter(c => !c.isUser);

    if (this.partyMode === '3-party') {
      // Alternate between AI 1 and AI 2
      const activeChar = characters[this.currentSpeakerIndex % characters.length];
      this.currentSpeakerIndex++;

      const reply = this.currentSpeakerIndex % 2 === 1
        ? `Bien noté. De mon côté, je confirme que les formalités sont conformes à la réglementation.`
        : `Parfait, nous pouvons donc finaliser cette démarche dès que vous m'aurez remis la copie de votre document.`;

      this.history.push({
        sender: activeChar.name,
        avatar: activeChar.avatar,
        isUser: false,
        text: reply
      });
      this.renderMessages();
      this.speakText(reply);
    } else {
      const activeChar = characters[0];
      const reply = `Je comprends tout à fait votre démarche. Pouvez-vous me préciser les détails pour que nous puissions avancer efficacement ?`;

      this.history.push({
        sender: activeChar.name,
        avatar: activeChar.avatar,
        isUser: false,
        text: reply
      });
      this.renderMessages();
      this.speakText(reply);
    }
  }

  renderMessages() {
    const timeline = this.container.querySelector('#conversation-timeline');
    if (!timeline) return;

    timeline.innerHTML = this.history.map(msg => `
      <div class="chat-msg ${msg.isUser ? 'user' : 'other'}">
        <div class="chat-msg-avatar">${msg.avatar}</div>
        <div class="chat-msg-body">
          <div class="chat-msg-sender">${msg.sender}</div>
          <div class="chat-msg-bubble">${msg.text}</div>
        </div>
      </div>
    `).join('');

    timeline.scrollTop = timeline.scrollHeight;
  }

  toggleSpeechRecognition(btn, input) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale Web Speech API.");
      return;
    }

    if (this.isRecording) {
      if (this.recognition) this.recognition.stop();
      this.isRecording = false;
      btn.classList.remove('recording');
    } else {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'fr-FR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isRecording = true;
        btn.classList.add('recording');
      };

      this.recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (input) input.value = transcript;
      };

      this.recognition.onend = () => {
        this.isRecording = false;
        btn.classList.remove('recording');
      };

      this.recognition.onerror = () => {
        this.isRecording = false;
        btn.classList.remove('recording');
      };

      this.recognition.start();
    }
  }

  speakText(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }
}
