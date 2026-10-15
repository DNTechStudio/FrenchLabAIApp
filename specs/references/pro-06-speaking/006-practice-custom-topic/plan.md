# Architecture & Implementation Plan: User-Defined Practice Topics

**Feature**: `006-practice-custom-topic`  
**Status**: APPROVED  
**Architecture Lead**: Antigravity  

---

## 1. System Architecture & Component Mapping

```
                                [ PracticeView ]
                                       │
                 ┌─────────────────────┴──────────────────────┐
                 ▼                                            ▼
         [ Hero Header ]                             [ Active Topic Card ]
      ┌─────────────────────────┐                   ┌───────────────────────┐
      │ 🎲 Changer de sujet     │                   │ • Thématique          │
      │ ✏️ Sujet personnalisé   │                   │ • « Titre »           │
      └────────────┬────────────┘                   │ • Description         │
                   │ (toggle accordion)             │ • 💡 Amorce suggérée  │
                   ▼                                │ • 🎨 [Personnalisé]   │
      [ CustomPracticeTopicForm ]                   └───────────────────────┘
    ┌──────────────────────────────┐                            ▲
    │ • Titre (min 5 chars)        │                            │
    │ • Thématique (chips/custom)  │                            │
    │ • Description (min 10 chars) │                            │
    │ • Amorce suggérée            │                            │
    │ • [🚀 Appliquer ce sujet]   │────────────────────────────┘ (updates currentTopic
    │ • [✕ Annuler]                │                               without resetting transcript)
    └──────────────┬───────────────┘
                   │
                   ▼
     [ customPracticeStorage.js ]
     (localStorage persistence)
```

---

## 2. Phased Implementation Plan

### Phase 1: Storage Layer & Data Helpers
- Create `src/data/practice/customPracticeStorage.js`:
  - `getCustomPracticePrompts()`: Retrieves array from `localStorage` (`delf_speaking_custom_practice_topics`).
  - `saveCustomPracticePrompt(promptData)`: Adds or updates custom practice prompt with ID and timestamp.
  - `deleteCustomPracticePrompt(id)`: Removes custom prompt.
  - `validateCustomPracticePrompt(data)`: Validates required title (>= 5) and description (>= 10).
  - `getAllPracticePrompts()`: Combines `PRACTICE_PROMPTS` and custom prompts.
  - `getRandomCombinedPracticePrompt()`: Randomly selects from combined pool.
- Unit tests in `tests/unit/CustomPracticeStorage.test.js`.

### Phase 2: CSS Styling
- In `src/ui/styles/practice.css`:
  - Styles for `.custom-practice-expandable`, `.custom-practice-expandable.open`.
  - Responsive layout for practice custom topic form inputs, chips, and buttons.

### Phase 3: Inline Form Component (`CustomPracticeTopicForm.js`)
- Create `src/ui/components/CustomPracticeTopicForm.js`:
  - Renders title input, category chip selector, description textarea, starter sentence input.
  - Inline error validation indicators.
  - Emits `onSubmit(customPrompt)` and `onCancel()`.
  - Unit tests in `tests/unit/CustomPracticeTopicForm.test.js`.

### Phase 4: Integration into `PracticeView.js`
- Upgrade `src/ui/views/PracticeView.js`:
  - Add `✏️ Sujet personnalisé` toggle button to header action bar.
  - Mount `CustomPracticeTopicForm` in dedicated slot above the topic card.
  - On submit: update `this.currentTopic`, re-render only the topic card element with `🎨 Personnalisé` badge, and persist session without touching the active transcript or recording console.
  - Upgrade `random-prompt-btn` to use `getRandomCombinedPracticePrompt()`.

### Phase 5: Multilingual Localization
- Add translation keys to `fr.js`, `en.js`, `zh.js`, `vi.js`:
  - `practice.custom_topic_btn`
  - `practice.custom_form_heading`, `practice.custom_form_desc`
  - `practice.custom_title_label`, `practice.custom_title_placeholder`
  - `practice.custom_category_label`
  - `practice.custom_desc_label`, `practice.custom_desc_placeholder`
  - `practice.custom_starter_label`, `practice.custom_starter_placeholder`
  - `practice.custom_apply_btn`, `practice.custom_cancel_btn`
  - `practice.custom_badge`
  - `practice.err_missing_title`, `practice.err_missing_desc`

### Phase 6: Integration Testing & Verification
- Add integration test suite in `tests/integration/CustomPracticeTopicFlow.test.js`.
- Execute full test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`).

---

## 3. Constitution Alignment & Quality Gates

1. **Test-First (Constitution Principle III)**: Unit tests for storage and component form before wiring into `PracticeView`.
2. **State Resilience (Principle IV)**: Setting a custom practice topic preserves the recording console transcript, local storage, and audio state.
3. **Pure Vanilla Architecture (Principle V)**: Zero external libraries, modular DOM components, CSS token-based styling.
