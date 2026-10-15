/**
 * ConversationEngine.js: State machine & turn generator for 2-party and 3-party situational dialogues
 * Adaptively calibrates vocabulary, syntax, and pacing to CEFR levels (A1 to C2)
 */

import { CEFR_LEVELS } from '../practice/CefrLevelDefinitions.js';

export class ConversationEngine {
  constructor({ scenario, level = null } = {}) {
    if (!scenario) {
      throw new Error("Un scénario de conversation valide est requis.");
    }
    this.scenario = scenario;
    this.level = level && CEFR_LEVELS.includes(level) ? level : (scenario.defaultLevel || 'B1');
    this.turns = [];

    this.initTurns();
  }

  initTurns() {
    this.turns = [];
    const init = this.scenario.initialTurn;
    const speaker = this.getCharacterById(init?.speakerId) || this.scenario.characters?.[1] || {
      id: 'char-ai-1',
      name: 'Interlocuteur',
      role: 'Interlocuteur'
    };

    this.turns.push({
      id: 'turn-0',
      speakerId: speaker.id,
      speakerName: speaker.name,
      role: speaker.role || '',
      voiceGender: speaker.voiceGender || 'female',
      text: init?.text || "Bonjour, comment puis-je vous aider ?",
      isUser: false,
      timestamp: Date.now()
    });
  }

  getScenario() {
    return this.scenario;
  }

  getLevel() {
    return this.level;
  }

  setLevel(newLevel) {
    if (CEFR_LEVELS.includes(newLevel)) {
      this.level = newLevel;
    }
  }

  getTurns() {
    return [...this.turns];
  }

  getCharacterById(id) {
    return this.scenario.characters?.find(c => c.id === id) || null;
  }

  getUserCharacter() {
    return this.scenario.characters?.find(c => c.isUser) || {
      id: 'char-user',
      name: 'Vous',
      isUser: true,
      role: 'Participant'
    };
  }

  getAiCharacters() {
    return this.scenario.characters?.filter(c => !c.isUser) || [];
  }

  /**
   * Process a user's verbal/typed response and generate AI reply turns
   * @param {string} userText
   * @returns {Object[]} Array of newly generated turns (User turn + AI reply turn(s))
   */
  processUserTurn(userText) {
    const trimmed = (userText || '').trim();
    if (!trimmed) {
      throw new Error("Votre réplique ne peut pas être vide.");
    }

    const userChar = this.getUserCharacter();
    const userTurn = {
      id: `turn-${Date.now()}-user`,
      speakerId: userChar.id,
      speakerName: userChar.name,
      role: userChar.role || '',
      text: trimmed,
      isUser: true,
      timestamp: Date.now()
    };
    this.turns.push(userTurn);

    const generatedAiTurns = [];
    const aiChars = this.getAiCharacters();

    if (aiChars.length === 1) {
      // 2-Party Dialogue: The single AI partner answers
      const partner = aiChars[0];
      const replyText = this._synthesizeResponse(partner, trimmed, this.turns.length);
      const aiTurn = {
        id: `turn-${Date.now()}-${partner.id}`,
        speakerId: partner.id,
        speakerName: partner.name,
        role: partner.role || '',
        voiceGender: partner.voiceGender || 'female',
        text: replyText,
        isUser: false,
        timestamp: Date.now() + 100
      };
      this.turns.push(aiTurn);
      generatedAiTurns.push(aiTurn);
    } else if (aiChars.length >= 2) {
      // 3-Party Dialogue: Main partner answers, and secondary partner chimes in
      const primary = aiChars[0];
      const secondary = aiChars[1];

      const primaryText = this._synthesizeResponse(primary, trimmed, this.turns.length, secondary);
      const primaryTurn = {
        id: `turn-${Date.now()}-${primary.id}`,
        speakerId: primary.id,
        speakerName: primary.name,
        role: primary.role || '',
        voiceGender: primary.voiceGender || 'female',
        text: primaryText,
        isUser: false,
        timestamp: Date.now() + 100
      };
      this.turns.push(primaryTurn);
      generatedAiTurns.push(primaryTurn);

      // Secondary interlocutor adds a reaction or complementary remark
      const secondaryText = this._synthesizeComplementaryResponse(secondary, primary, trimmed);
      const secondaryTurn = {
        id: `turn-${Date.now()}-${secondary.id}`,
        speakerId: secondary.id,
        speakerName: secondary.name,
        role: secondary.role || '',
        voiceGender: secondary.voiceGender || 'male',
        text: secondaryText,
        isUser: false,
        timestamp: Date.now() + 200
      };
      this.turns.push(secondaryTurn);
      generatedAiTurns.push(secondaryTurn);
    }

    return [userTurn, ...generatedAiTurns];
  }

  /**
   * Generates tailored responses matching CEFR level & situational context
   */
  _synthesizeResponse(speaker, userInput, turnCount, otherSpeaker = null) {
    const category = this.scenario.category || 'quotidien';
    const lvl = this.level;
    const lower = userInput.toLowerCase();

    // Dental / Medical context specific replies
    if (category === 'sante') {
      if (lvl === 'A1' || lvl === 'A2') {
        if (lower.includes('douleur') || lower.includes('mal') || lower.includes('urgent') || lower.includes('dent')) {
          return "Je comprends, vous avez mal. Le docteur peut vous recevoir à 11h30 pour une urgence rapide. Pouvez-vous patienter en salle d'attente ?";
        }
        return "D'accord. Prenez place quelques minutes, le médecin va vous appeler.";
      }
      if (lvl === 'B1' || lvl === 'B2') {
        if (lower.includes('molaire') || lower.includes('urgent') || lower.includes('douleur') || lower.includes('rage')) {
          return "C'est bien noté. Étant donné l'intensité de votre douleur, je vais vous intercaler entre deux patients à 11h45 pour soulager l'infection. Veuillez remplir cette fiche d'admission.";
        }
        return "Très bien. Nous allons procéder à un examen clinique complet et peut-être une radiographie pour identifier l'origine du problème.";
      }
      // C1/C2
      return "J'entends parfaitement l'urgence de votre situation. Bien que notre planning soit saturé, nous ne pouvons vous laisser souffrir ainsi. Le praticien va vous recevoir dès qu'il aura achevé son intervention en cours.";
    }

    // Workplace context specific replies
    if (category === 'travail') {
      if (lvl === 'A1' || lvl === 'A2') {
        return "C'est une bonne proposition. Nous devons en parler avec toute l'équipe demain matin.";
      }
      if (lvl === 'B1' || lvl === 'B2') {
        if (otherSpeaker) {
          return `Votre argument est recevable. Cependant, comme le souligne souvent ${otherSpeaker.name.split(' ')[0]}, il est capital de préserver notre temps de présence partagé au bureau pour les réunions de cadrage.`;
        }
        return "Je comprends votre point de vue. C'est un compromis équilibré qui permet d'allier autonomie individuelle et réactivité sur nos projets prioritaires.";
      }
      return "Votre analyse est tout à fait pertinente. Dès lors que les indicateurs de performance et les livrables sont respectés, cette flexibilité organisationnelle me semble constructive pour l'ensemble du pôle.";
    }

    // Administration context
    if (category === 'administration') {
      if (lvl === 'A1' || lvl === 'A2') {
        return "Merci. Vos documents sont enregistrés. Voici votre justificatif avec la date de convocation.";
      }
      if (lvl === 'B1' || lvl === 'B2') {
        return "Parfait. Vos pièces justificatives sont conformes aux exigences réglementaires. Je vous délivre immédiatement votre récépissé en attendant la fabrication de votre carte.";
      }
      return "Votre dossier s'avère parfaitement complet et recevable. Je procède sans tarder à la validation télématique et vous transmets le récépissé officiel attestant du dépôt de votre requête.";
    }

    // University / Study context
    if (category === 'etudes') {
      if (lvl === 'A1' || lvl === 'A2') {
        return "D'accord, c'est une excellente idée. On se retrouve vendredi à la bibliothèque pour réviser.";
      }
      if (lvl === 'B1' || lvl === 'B2') {
        return "Je suis totalement d'accord avec cette répartition. Chacun prépare sa partie d'ici mercredi prochain, puis nous mettrons nos notes en commun sur le document partagé.";
      }
      return "Cette démarche méthodologique est judicieuse. Elle permettra de structurer une argumentation cohérente et d'éviter les redondances conceptuelles lors de la soutenance finale.";
    }

    // Everyday Life (Default)
    if (lvl === 'A1' || lvl === 'A2') {
      return "Très bien, c'est parfait ! Avez-vous besoin d'autre chose avec ceci ?";
    }
    if (lvl === 'B1' || lvl === 'B2') {
      return "C'est tout à fait possible. Je prends bonne note de vos préférences et nous nous occupons de tout préparer selon vos souhaits.";
    }
    return "C'est parfaitement entendu. Je m'assure personnellement que l'ensemble de vos recommandations soit scrupuleusement respecté.";
  }

  _synthesizeComplementaryResponse(speaker, otherSpeaker, userInput) {
    const lvl = this.level;
    const speakerFirst = speaker.name.split(' ')[0];

    if (lvl === 'A1' || lvl === 'A2') {
      return `Moi aussi, je suis d'accord avec ${otherSpeaker.name.split(' ')[0]}. C'est très bien !`;
    }
    if (lvl === 'B1' || lvl === 'B2') {
      return `De mon côté, je rejoins l'avis de ${otherSpeaker.name.split(' ')[0]}. Cela nous permettra de respecter les délais sans nous mettre dans l'embarras.`;
    }
    return `Je souscris pleinement aux propos de ${otherSpeaker.name.split(' ')[0]}. Cette convergence de vues augure d'une issue tout à fait favorable pour notre démarche.`;
  }

  /**
   * Generates pedagogical suggested replies for the learner matching scenario & CEFR level
   */
  getSuggestedReplies() {
    const sample = this.scenario.sampleResponses?.[this.level];
    if (Array.isArray(sample) && sample.length > 0) {
      return [...sample];
    }

    const category = this.scenario.category;
    switch (this.level) {
      case 'A1':
        return [
          "Bonjour, je voudrais des renseignements, s'il vous plaît.",
          "Oui, d'accord, c'est très bien.",
          "Merci beaucoup, bonne journée !"
        ];
      case 'A2':
        return [
          "Bonjour, excusez-moi, est-ce que vous pouvez m'aider ?",
          "Je voudrais savoir combien ça coûte et quelles sont les options.",
          "D'accord, je préfère la deuxième solution."
        ];
      case 'B1':
        return [
          "Bonjour, je me permets de vous contacter car j'aimerais clarifier un point important.",
          "À mon avis, la meilleure solution consisterait à fixer un calendrier précis.",
          "Serait-il possible de trouver un compromis qui convienne à chacun ?"
        ];
      case 'B2':
        return [
          "Je comprends tout à fait votre point de vue, toutefois il me semble essentiel de prendre en compte...",
          "Dans cette perspective, je propose d'adopter une démarche progressive afin d'assurer...",
          "Force est de constater qu'il s'agit d'une opportunité intéressante pour notre organisation."
        ];
      case 'C1':
      case 'C2':
        return [
          "Il va de soi que cette situation requiert une vigilance toute particulière, notamment en ce qui concerne...",
          "Tout en souscrivant à votre analyse, je me permets d'attirer votre attention sur un écueil potentiel...",
          "Dès lors que les préalables méthodologiques sont réunis, nous pourrions envisager sans risque..."
        ];
      default:
        return [
          "Bonjour, je souhaite vous présenter ma proposition.",
          "Je suis d'accord avec vos remarques."
        ];
    }
  }

  reset() {
    this.initTurns();
  }
}
