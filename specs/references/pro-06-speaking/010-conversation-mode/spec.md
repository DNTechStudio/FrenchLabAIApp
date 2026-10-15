# Feature Specification: Conversation Mode (Mode Conversation Multi-Paliers & Multi-Interlocuteurs)

**Feature**: `010-conversation-mode`  
**Target Release**: v2.0.0  
**Status**: SPECIFIED  
**Author**: Antigravity  

---

## 1. Executive Summary & Pedagogical Value

While the existing **Mode Examen** simulates the formal 2-part DELF B2 monologue and debate, and **Mode Entraînement** provides freeform speech elevation to target CEFR levels, learners intensely require **practical, interactive situational dialogue (jeux de rôle / conversations de la vie réelle)** to achieve authentic communicative competence.

**Conversation Mode (Mode Conversation)** introduces a realistic, interactive multi-turn conversation simulator:
1. **Third Primary Navigation Tab**: Positioned right after `Mode Examen` in the header switcher:  
   `[ 🎙️ Mode Entraînement ]  [ 🎓 Mode Examen ]  [ 💬 Mode Conversation ]`
2. **Rich Situational Contexts**:
   - **Vie quotidienne** (boulangerie, café, marché, logement, réclamation)
   - **Milieu professionnel & Entreprise** (réunion, négociation, pause café entre collègues, entretien d'embauche)
   - **Université & Éducation** (secrétariat des étudiants, travail de groupe, bibliothèque)
   - **Santé & Soins** (cabinet médical, pharmacie, consultation chez le dentiste)
   - **Démarches administratives & Services publics** (mairie, préfecture, banque, bureau de poste, visa/titre de séjour)
3. **Flexible Scenario Source**:
   - **Tirage au sort (Random Scenario)**: Instant scenario from an authentic bank of French situational roleplays.
   - **Scénario personnalisé (Custom Scenario)**: Candidate can define their own context, roles, and communicative goal (with AI idea generator support).
4. **Variable Number of Interlocutors (2 ou 3 participants)**:
   - **2 personnes** (ex: Candidat vs Dentiste, Client vs Conseiller bancaire)
   - **3 personnes** (ex: Candidat + Collègue + Manager, ou Candidat + Couple d'amis / Agents)
5. **Calibrated CEFR Hierarchy (A1, A2, B1, B2, C1, C2)**:
   - Vocabulary, syntax, speech rate, idioms, and discourse complexity of the AI conversational partners dynamically scale according to the selected CEFR level.

---

## 2. User Stories & Acceptance Criteria

### User Story 1 (P1): Navigation & Header Mode Switcher Integration
> **As a** learner,  
> **I want to** see a new "Mode Conversation" button placed directly after "Mode Examen" on the top navigation bar,  
> **So that** I can seamlessly switch into situational conversational practice.

- **Acceptance Criteria**:
  - `US1.1`: The segmented mode switcher renders three options in exact order:
    1. `🎙️ Mode Entraînement`
    2. `🎓 Mode Examen`
    3. `💬 Mode Conversation`
  - `US1.2`: Clicking `Mode Conversation` activates `APP_MODES.CONVERSATION = 'conversation'`, updates URL/state, and persists to `localStorage`.
  - `US1.3`: The label is localized across French (*Mode Conversation*), English (*Conversation Mode*), Vietnamese (*Chế độ Hội thoại*), and Chinese (*对话演练模式*).

---

### User Story 2 (P1): Scenario Selection (Curated Library & Custom Creation)
> **As a** candidate,  
> **I want to** choose from ready-made real-life scenarios across diverse themes or create my own custom situation,  
> **So that** I can train for the exact communicative tasks I face in daily life, work, or study in France.

- **Acceptance Criteria**:
  - `US2.1`: Curated scenarios are grouped into distinct categories:
    - *Vie Quotidienne & Commerces*
    - *Monde Professionnel & Entreprise*
    - *Études & Milieu Universitaire*
    - *Santé & Cabinet Médical/Dentiste*
    - *Démarches Administratives & Services Publics*
  - `US2.2`: `🎲 Changer de scénario` (Random Scenario) instantly draws an authentic situation with preset characters, roles, and a mission objective.
  - `US2.3`: `✏️ Scénario personnalisé` (Custom Scenario Form) allows the user to:
    - Set custom scenario title and description.
    - Select context category.
    - Choose 2 or 3 participants with custom character names/roles.
    - Define the learner's conversational mission (*« Obtenir un rendez-vous rapide », « Négocier une réduction », etc.*).
    - Use `✨ Améliorer avec l’IA` to generate or polish the custom scenario from rough notes in any language.

---

### User Story 3 (P1): CEFR Level Calibration (A1, A2, B1, B2, C1, C2)
> **As an** international student at a specific proficiency tier,  
> **I want** the dialogue language complexity and AI responses to match my chosen CEFR level,  
> **So that** the roleplay is neither too overwhelming nor too simplistic.

- **Acceptance Criteria**:
  - `US3.1`: The candidate can select from the 6 standard CEFR levels: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`.
  - `US3.2`: **A1 - A2 (Découverte / Survie)**: Simple vocabulary, present tense, polite formulas (*« Bonjour, je voudrais... »*), slow clear articulation (TTS rate ~0.85x - 0.9x).
  - `US3.3`: **B1 - B2 (Seuil / Indépendant)**: Complex tenses (passé composé, imparfait, conditionnel, subjonctif), real-life hesitations, standard debate and justifications, normal pace (TTS rate ~1.0x).
  - `US3.4`: **C1 - C2 (Autonome / Maîtrise)**: High-register idioms, fast colloquial or administrative speech, subtle nuances, implicatures, rapid flow (TTS rate ~1.05x - 1.15x).

---

### User Story 4 (P1): 2-Party and 3-Party Dialogue Flow (Dialogue à 2 ou 3)
> **As a** learner,  
> **I want to** participate in conversations with either 1 AI partner (dialogue à 2) or 2 AI partners (dialogue à 3),  
> **So that** I learn to handle multi-party dynamics (interruptions, agreement, turn-taking).

- **Acceptance Criteria**:
  - `US4.1`: Dialogue config selector allows toggling:
    - **2 participants**: You (Candidat) + Interlocuteur A (e.g. Dr. Martin - Dentiste)
    - **3 participants**: You (Candidat) + Interlocuteur A (e.g. Julie - Collègue) + Interlocuteur B (e.g. M. Renaud - Directeur)
  - `US4.2`: Each speaker has a distinct visual avatar, color badge, and persona title.
  - `US4.3`: For 3-participant scenarios, AI interlocutors can interact with each other as well as with the candidate (e.g. Interlocutor A prompts or agrees with Interlocutor B before handing the floor to the candidate).

---

### User Story 5 (P2): Speech Recognition & Auditory TTS Playback
> **As a** user,  
> **I want to** speak my answers via microphone or type them, and listen to the AI characters speaking with natural French voices,  
> **So that** I practice both oral production and listening comprehension simultaneously.

- **Acceptance Criteria**:
  - `US5.1`: Real-time speech-to-text with microphone recording console for the candidate's turn.
  - `US5.2`: Each AI character has an automatic audio playback button with speed adjustment (`0.75x`, `0.9x`, `1.0x`, `1.2x`).
  - `US5.3`: Multi-voice support assigns different French voice timbres to different characters when available (e.g. female voice for Character A, male voice for Character B).
  - `US5.4`: Helpful contextual hints (*Suggestions de répliques*) tailored to the current CEFR level are available on demand to unblock the learner.

---

## 3. Data Model & Architecture

### Conversation Scenario Schema (`ConversationScenario`)
```json
{
  "id": "conv-scen-dentist-urgency-01",
  "title": "Rendez-vous d'urgence chez le dentiste",
  "category": "sante",
  "participantCount": 2,
  "level": "B1",
  "context": "Vous avez une rage de dents intense depuis la veille au soir et vous vous présentez au cabinet dentaire sans rendez-vous préalable.",
  "objective": "Expliquer précisément vos symptômes, insister poliment sur l'urgence de la situation et obtenir une consultation dans la journée.",
  "characters": [
    {
      "id": "char-user",
      "name": "Vous (Patient)",
      "isUser": true,
      "role": "Patient en détresse dentaire"
    },
    {
      "id": "char-assistant",
      "name": "Mme Leroy (Secrétaire médicale)",
      "isUser": false,
      "role": "Secrétaire accueillante mais ayant un planning complet",
      "voiceGender": "female"
    }
  ],
  "initialTurn": {
    "speakerId": "char-assistant",
    "text": "Cabinet dentaire du Dr Vasseur, bonjour. En quoi puis-je vous aider aujourd'hui ?"
  }
}
```

### 3-Participant Scenario Schema Example
```json
{
  "id": "conv-scen-work-hybrid-meeting-02",
  "title": "Organisation du télétravail dans l'équipe",
  "category": "travail",
  "participantCount": 3,
  "level": "B2",
  "context": "Réunion hebdomadaire pour arbitrer les jours de présence physique au bureau et les jours en télétravail.",
  "objective": "Défendre votre souhait de garder 2 jours de télétravail fixes tout en répondant aux réticences de votre responsable.",
  "characters": [
    { "id": "char-user", "name": "Vous (Développeur)", "isUser": true },
    { "id": "char-colleague", "name": "Thomas (Collègue)", "isUser": false, "role": "Favorable au télétravail", "voiceGender": "male" },
    { "id": "char-manager", "name": "Hélène (Manager)", "isUser": false, "role": "Inquiète pour la cohésion d'équipe", "voiceGender": "female" }
  ]
}
```

---

## 4. UI Layout Mockup

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Mode Switcher]: [🎙️ Entraînement] [🎓 Examen] [💬 Mode Conversation*] │
├────────────────────────────────────────────────────────────────────────┤
│ [Scenario Header Card]:                                                │
│  🏥 Rendez-vous d'urgence chez le dentiste          [Niveau : B1 ▾]    │
│  Thématique : Santé & Soins | Participants : 2 personnes (Patient vs Secrétaire)│
│  🎯 Mission : Obtenir une consultation dans la journée malgré un agenda plein  │
│  [ 🎲 Autre scénario ]  [ ✏️ Scénario personnalisé ]                   │
├────────────────────────────────────────────────────────────────────────┤
│ [Dialogue Stream Window]:                                              │
│                                                                        │
│  ┌─ 👩 Mme Leroy (Secrétaire) ───────────────────────────────┐        │
│  │ « Cabinet dentaire du Dr Vasseur, bonjour. Que puis-je   │        │
│  │    faire pour vous aujourd'hui ? »                         │        │
│  │ [ 🔊 Écouter (1.0x) ]                                     │        │
│  └───────────────────────────────────────────────────────────┘        │
│                                                                        │
│  ┌─ 🧑 Vous (Patient) ───────────────────────────────────────┐        │
│  │ « Bonjour Madame, excusez-moi de vous déranger, mais j'ai │        │
│  │    une douleur insupportable à une dent depuis hier soir. »│        │
│  └───────────────────────────────────────────────────────────┘        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ [Candidate Turn Input Console]:                                        │
│  [ 🎙️ Parler au micro ]  [ 🗣️ Écoute : fr-FR ]                        │
│  [ Textarea: Tapez ou dictez votre réplique... ]                       │
│  💡 Suggestions d'expressions B1 : « Serait-il possible de... »       │
│  [ 🚀 Envoyer ma réplique → ]  [ 🗑️ Effacer ]                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Scope & Phases

1. **`src/ui/components/ModeSwitcher.js`**:
   - Add `APP_MODES.CONVERSATION = 'conversation'`.
   - Add third button `💬 Mode Conversation` directly after `Mode Examen`.
2. **`src/data/conversation/conversationScenarios.js`**:
   - Rich database of realistic scenarios (Everyday life, Workplace, University, Medical/Dentist, Administration) for 2 and 3 participants across CEFR levels A1-C2.
3. **`src/core/conversation/ConversationEngine.js`**:
   - State machine managing dialogue turns, participant turns, CEFR response generation, and goal tracking.
4. **`src/ui/components/ConversationScenarioCard.js` & `CustomConversationForm.js`**:
   - Scenario selection, random draw, and custom scenario builder.
5. **`src/ui/views/ConversationView.js`**:
   - Main view integrating scenario card, chat bubble stream, participant avatars, candidate recording console, and TTS audio playback.
6. **Localization (`fr.js`, `en.js`, `vi.js`, `zh.js`)**:
   - Full translation coverage for all Conversation Mode UI strings.

---

## 6. Verification & Automated Testing

- Unit tests for `ConversationEngine` (2-party and 3-party turn transitions, CEFR calibration, scenario validation).
- Integration test for Conversation Mode flow (ModeSwitcher -> Scenario Picker -> Turn Exchange -> Audio Playback).
- Full regression test run with `npm test`.
