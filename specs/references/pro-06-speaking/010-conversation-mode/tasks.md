# Implementation Tasks: Conversation Mode (Feature 010)

**Feature**: `010-conversation-mode` | **Branch**: `010-conversation-mode`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Navigation & App Routing

**Purpose**: Integrate the 3rd mode button in the header switcher and hook up view routing in the main app orchestrator.

- [X] T001 Update `src/ui/components/ModeSwitcher.js`:
  - Add `APP_MODES.CONVERSATION = 'conversation'`.
  - Add 3rd button `💬 Mode Conversation` placed directly after `Mode Examen`.
  - Ensure persistent storage handles all 3 modes.
- [X] T002 Update `tests/unit/ModeSwitcher.test.js` to assert `APP_MODES.CONVERSATION` and button order.
- [X] T003 Update `src/app.js`:
  - Handle `newMode === APP_MODES.CONVERSATION`.
  - Implement `renderConversationMode()` to mount `ConversationView`.

---

## Phase 2: Scenario Data & Local Storage

**Purpose**: Provide an authentic library of French situational dialogues and persistence for custom user scenarios.

- [X] T004 Create `src/data/conversation/conversationScenarios.js`:
  - Categories: *Santé & Soins* (Dentiste/Médecin), *Monde Professionnel & Entreprise*, *Vie Quotidienne & Commerces*, *Études & Université*, *Démarches Administratives*.
  - Scenarios for 2 participants and 3 participants.
  - Helper functions: `getRandomConversationScenario()`, `filterScenarios({ category, participantCount, level })`.
- [X] T005 Create `src/data/conversation/customConversationStorage.js`:
  - LocalStorage helpers: `saveCustomConversationScenario()`, `getCustomConversationScenarios()`, `validateCustomConversationScenario()`.

---

## Phase 3: Core Conversation Engine (Turn-Taking & CEFR Calibration)

**Purpose**: Manage multi-party dialogue state, dynamic CEFR complexity (A1-C2), and response generation.

- [X] T006 Implement `src/core/conversation/ConversationEngine.js`:
  - State management for active scenario, CEFR level (`A1`, `A2`, `B1`, `B2`, `C1`, `C2`), and turns list.
  - Turn-taking logic for 2-participant dialogues (User <-> Partner A) and 3-participant dialogues (User <-> Partner A <-> Partner B).
  - CEFR calibration for generated responses (vocabulary richness, syntax complexity, speed presets).
  - Pedagogical suggested replies generator tailored to the current turn.
- [X] T007 Implement unit tests in `tests/unit/ConversationEngine.test.js`:
  - Verify initialization with scenario.
  - Verify 2-party turn alternation and 3-party multi-turn transitions.
  - Verify CEFR level adjustments (A1 vs B2 vs C1).
  - Verify suggested replies generation.

---

## Phase 4: UI Components & Views

**Purpose**: Build the interactive scenario selection, chat stream, input console, and main view.

- [X] T008 Implement `src/ui/components/ConversationScenarioCard.js`:
  - Header with scenario title, domain chip, participant count toggle (2 vs 3 pers), and CEFR difficulty selector (A1-C2).
  - Mission objective alert box.
  - `🎲 Changer de scénario` and `✏️ Scénario personnalisé` triggers.
- [X] T009 Implement `src/ui/components/CustomConversationForm.js`:
  - Form fields: title, category, participant count, character roles, mission objective.
  - `✨ Améliorer avec l'IA` button to structure ideas into a ready-to-play French scenario.
- [X] T010 Implement `src/ui/components/ConversationTurnInput.js`:
  - Speech-to-text recording console and editable transcript box.
  - `🗑️ Effacer le texte` quick clear button and word counter.
  - `🚀 Envoyer ma réplique` action.
  - `💡 Suggestions d'expressions` collapsible helper tailored to chosen CEFR level.
- [X] T011 Implement `src/ui/views/ConversationView.js`:
  - Integrates scenario card, custom scenario form, chat bubble stream with character avatars, audio playback with speed controls, and turn input console.
  - Session persistence (`delf_speaking_conversation_session`).

---

## Phase 5: Multilingual Translations

**Purpose**: Localize all Conversation Mode UI keys into French, English, Vietnamese, and Chinese.

- [X] T012 Add translation keys for `mode.conversation`, scenario domains, roles, buttons, and placeholders to:
  - `src/core/i18n/locales/fr.js`
  - `src/core/i18n/locales/en.js`
  - `src/core/i18n/locales/vi.js`
  - `src/core/i18n/locales/zh.js`

---

## Phase 6: Automated Verification & Documentation

**Purpose**: Validate the entire end-to-end conversation flow and ensure 0 regressions.

- [X] T013 Create integration tests in `tests/integration/ConversationModeFlow.test.js`:
  - Mode switch -> Scenario select -> 2-person and 3-person exchanges -> Audio playback -> Localization.
- [X] T014 Run complete test suite (`npm test`) -> Ensure 100% passing tests.
- [X] T015 Document walkthrough and report back to user.
