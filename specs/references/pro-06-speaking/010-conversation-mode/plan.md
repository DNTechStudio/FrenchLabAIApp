# Implementation Plan: Conversation Mode (Feature 010)

Introduce an interactive situational dialogue simulator (**Mode Conversation**) in the top navigation bar right after Exam Mode, featuring realistic scenarios across daily life, workplace, school, medical/dentist clinics, and administration, supporting 2 or 3 participants, calibrated across CEFR levels A1-C2, with both random and custom topics.

---

## 1. Goal Description

Language learners preparing for DELF/DALF and real-life integration in French-speaking countries need interactive, turn-by-turn conversational practice in authentic daily situations (e.g. visiting a dentist for an emergency, resolving administrative paperwork, negotiating workplace arrangements, or collaborating on university projects).

This feature adds:
1. **Third Primary Navigation Tab**: Positioned right after *Mode Examen*:  
   `[ 🎙️ Mode Entraînement ]  [ 🎓 Mode Examen ]  [ 💬 Mode Conversation ]`
2. **Rich Scenario Library & Custom Creator**:
   - Curated situations across 5 major life domains: *Santé & Soins* (Dentist/Doctor), *Travail & Entreprise*, *Vie Quotidienne*, *Études*, *Démarches Administratives*.
   - Random scenario button (`🎲 Changer de scénario`) and custom scenario creator (`✏️ Scénario personnalisé` with AI suggestion assistance).
3. **2 or 3 Participants**:
   - Dialogue à 2 (Candidate + 1 AI partner).
   - Dialogue à 3 (Candidate + 2 AI partners with multi-party turn taking).
4. **CEFR Calibrated Scaling (A1 to C2)**:
   - Dynamic vocabulary, speech tempo, and syntactic complexity tailored to chosen CEFR level.
5. **Full Speech & Audio Capabilities**:
   - Real-time microphone dictation, text editing, quick clear button, TTS audio playback per character with speed controls (`0.75x` to `1.2x`), and pedagogical reply suggestions.

---

## 2. Technical Architecture & File Changes

- `src/ui/components/ModeSwitcher.js`: Add `APP_MODES.CONVERSATION` and third button.
- `src/app.js`: Handle `APP_MODES.CONVERSATION` and render `ConversationView`.
- `src/data/conversation/conversationScenarios.js`: Curated situational roleplay scenarios.
- `src/data/conversation/customConversationStorage.js`: LocalStorage for custom scenarios.
- `src/core/conversation/ConversationEngine.js`: Turn-taking, CEFR calibration, AI responses.
- `src/ui/components/ConversationScenarioCard.js`: Scenario, CEFR level, 2/3 participant toggles.
- `src/ui/components/CustomConversationForm.js`: Custom scenario creator with AI assistance.
- `src/ui/components/ConversationTurnInput.js`: Mic, text input, clear text, expressions.
- `src/ui/views/ConversationView.js`: Main interactive view.
- `src/core/i18n/locales/*.js`: Translations across `fr`, `en`, `vi`, `zh`.

---

## 3. Verification Plan
- Unit tests for engine, scenarios, and mode switcher.
- Integration tests for conversation flow.
- Full regression verification via `npm test`.
