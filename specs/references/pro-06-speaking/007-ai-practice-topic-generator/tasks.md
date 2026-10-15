# Implementation Tasks: AI-Assisted Custom Topic Generator (Mode Entraînement)

**Feature**: `007-ai-practice-topic-generator` | **Branch**: `007-ai-practice-topic-generator`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  

---

## Phase 1: Core Domain Engine (`TopicIdeaGenerator.js`)

**Purpose**: Build the core multilingual reasoning and French debate topic synthesis engine.

- [X] T001 Implement `TopicIdeaGenerator.js` in `src/core/practice/TopicIdeaGenerator.js` with:
  - Multilingual keyword dictionary & semantic matching for all 7 CEFR categories (*Société*, *Travail*, *Éducation*, *Environnement*, *Santé*, *Nouvelles Technologies & IA*, *Loisirs & Tourisme*) across Vietnamese, English, French, and Chinese keywords.
  - Debate title generator in authentic French format (*« [Sujet] : atout ou menace ? / opportunité ou risque ? »*).
  - Context paragraph and 2 balanced opposing questions generator.
  - Oral starter sentence generator with authentic DELF B2 connectors (*"Force est de constater que...", "D'un côté..., mais d'un autre côté..."*).
  - Trending fallback DELF B2 topic library when the draft idea input is empty.

---

## Phase 2: Foundational Unit Tests (TDD)

**Purpose**: Validate semantic classification, multilingual handling, and field generation before UI integration.

- [X] T002 Implement unit tests in `tests/unit/TopicIdeaGenerator.test.js` validating:
  - Empty draft input produces high-quality random DELF B2 topic.
  - Vietnamese rough draft (e.g. *"trí tuệ nhân tạo trong trường học"*) correctly maps to `Éducation & Formation` with valid French fields.
  - English rough draft (e.g. *"remote work and mental health"*) correctly maps to `Travail & Nouveaux Modes de Vie` / `Santé & Bien-être`.
  - French rough keywords (e.g. *"voiture electrique climat"*) correctly maps to `Environnement & Écologie`.
  - Generated topic satisfies all `validateCustomPracticePrompt` thresholds without error.

---

## Phase 3: UI Component Integration (`CustomPracticeTopicForm.js`)

**Purpose**: Add the draft idea input area, `✨ Améliorer avec l'IA` button, loading indicators, and field auto-population.

- [X] T003 Add draft idea textarea and `✨ Améliorer avec l'IA` action button to `CustomPracticeTopicForm.js` template in `src/ui/components/CustomPracticeTopicForm.js`.
- [X] T004 Implement `handleAIGenerate()` in `CustomPracticeTopicForm.js`:
  - Show subtle loading state on the button (*"✨ Génération en cours..."*).
  - Invoke `TopicIdeaGenerator.generateTopicFromDraft(draftText, currentLocale)`.
  - Populate form fields (`title`, `selectedCategory`, `description`, `starterSentence`).
  - Update category chips UI to reflect newly selected category.
  - Clear validation error hints on auto-filled fields.
  - Add visual glow / highlight animation to filled inputs.
- [X] T005 Add styling in `src/ui/styles/practice.css` for the AI draft container, AI generator button, and input pulse/glow highlight animation.

---

## Phase 4: Multilingual Support Across All 4 Locales

**Purpose**: Localize all new labels, placeholders, and buttons into French, English, Vietnamese, and Chinese.

- [X] T006 Add localization keys in `src/core/i18n/locales/fr.js`:
  - `practice.ai_draft_label`
  - `practice.ai_draft_placeholder`
  - `practice.ai_generate_btn`
  - `practice.ai_generating`
  - `practice.ai_generate_hint`
- [X] T007 Add localization keys in `src/core/i18n/locales/en.js`.
- [X] T008 Add localization keys in `src/core/i18n/locales/vi.js`.
- [X] T009 Add localization keys in `src/core/i18n/locales/zh.js`.

---

## Phase 5: Integration Testing & Verification

**Purpose**: End-to-end flow validation and complete test suite verification.

- [X] T010 Add integration test in `tests/integration/CustomPracticeTopicAIGenerator.test.js` validating the full flow:
  - Candidate types rough idea in native language -> clicks `✨ Améliorer avec l'IA` -> form is auto-filled -> candidate submits -> active topic card updates -> AI Speech Elevation operates on the topic.
- [X] T011 Run complete automated test suite (`npm test`) and ensure all 86+ tests pass with zero regressions.
