# Architecture & Implementation Plan: User-Defined Custom Topics in Test Simulation Mode

**Feature**: `005-custom-topic-input`  
**Status**: APPROVED  
**Architecture Lead**: Antigravity  

---

## 1. System Architecture & Component Mapping

```
                                  [ SelectionView ]
                                         │
                   ┌─────────────────────┴──────────────────────┐
                   ▼                                            ▼
           [ Hero Section ]                            [ Catalog Grid ]
        ┌─────────────────────────┐                   ┌───────────────────┐
        │  🎲 Tirage au sort      │                   │ DocumentCard (xN) │
        │  ✏️ Sujet personnalisé   │                   └───────────────────┘
        └────────────┬────────────┘                             ▲
                     │ (toggles inline expand)                  │
                     ▼                                          │
          [ CustomTopicForm ]                                   │
      ┌──────────────────────────────┐                          │
      │ • Titre (min 5 chars)        │                          │
      │ • Catégorie (preset/custom)  │                          │
      │ • Source et date (optional)  │                          │
      │ • Texte & Live Word Counter  │                          │
      │ • Problématique              │                          │
      │ • [🚀 Démarrer l'épreuve]   │                          │
      │ • [✕ Annuler]                │                          │
      └──────────────┬───────────────┘                          │
                     │ (saves / updates)                        │
                     ▼                                          │
       [ customTopicsStorage.js ] ──────────────► [ "✏️ Mes Sujets" tab ]
          (localStorage persistence)
                     │
                     │ (onSelectDocument)
                     ▼
          [ ExamFlowStateMachine ]
          (PrepView -> MonologueView -> DebateView -> EvaluationView)
```

---

## 2. Phased Implementation Plan

### Phase 1: Storage Layer, Validation & Data Helpers
- Create `src/data/documents/customTopicsStorage.js`:
  - `countFrenchWords(text)`: Unicode-aware French token counter respecting apostrophes.
  - `validateCustomTopic(data)`: Validates mandatory title, category, and minimum 30-word content threshold.
  - `getCustomTopics()`: Safe retrieval from `localStorage` (`delf_speaking_custom_topics`).
  - `saveCustomTopic(doc)`: Adds to list with unique ID and timestamp, persists to `localStorage`.
  - `deleteCustomTopic(id)`: Removes doc from `localStorage`.
- Unit tests in `tests/unit/CustomTopicsStorage.test.js`.

### Phase 2: CSS Styling for Smooth Inline Expansion
- In `src/ui/styles/views.css`:
  - `.custom-topic-expandable`: Collapsible container with `max-height: 0; opacity: 0; overflow: hidden; pointer-events: none; transition: max-height 0.4s ease, opacity 0.35s ease, margin 0.35s ease;`.
  - `.custom-topic-expandable.open`: `max-height: 1200px; opacity: 1; pointer-events: auto; margin-top: 1.5rem;`.
  - Styling for form inputs, live word count badges (`.word-badge.warning`, `.word-badge.optimal`, `.word-badge.valid`), and action buttons.

### Phase 3: Inline Form Component (`CustomTopicForm.js`)
- Create `src/ui/components/CustomTopicForm.js`:
  - Interactive form with real-time input listeners and dynamic live word counter.
  - Category picker with quick chips (*Société*, *Travail*, *Éducation*, *Écologie*, *Santé*, *Technologie*, *Culture*).
  - Validation error hints displayed inline under invalid fields.
  - Emits `onSubmit(customDoc)` and `onCancel()`.
  - Unit tests in `tests/unit/CustomTopicForm.test.js`.

### Phase 4: Integration into `SelectionView.js` & Custom Filter Tab
- Upgrade `src/ui/views/SelectionView.js`:
  - Add `✏️ Sujet personnalisé` toggle button to the hero section.
  - Mount `CustomTopicForm` inline directly below hero section and above category tabs.
  - Add dynamic `✏️ Mes Sujets` category tab when custom topics exist in storage.
  - Connect `onSubmit` to `saveCustomTopic()` and `this.onSelectDocument(customDoc)`.
  - Allow deleting saved custom topics with confirmation.

### Phase 5: Pedagogical Alignment in `DocumentCard.js` & `DebateEngine.js`
- In `src/ui/components/DocumentCard.js`:
  - Render a distinctive `🎨 Personnalisé` badge on user-created cards.
  - Add a delete button on selectable cards if `doc.isCustom` is true.
- In `src/core/evaluation/DebateEngine.js`:
  - If `triggerDocument.isCustom && triggerDocument.problematique`, weave the custom problématique into the examiner's Turn 1 question.

### Phase 6: Multilingual Localization & Integration Testing
- Add translation keys across `fr.js`, `en.js`, `zh.js`, `vi.js`:
  - `selection.custom_topic_btn`, `selection.custom_topics_tab`
  - `custom_topic.title_label`, `custom_topic.title_placeholder`
  - `custom_topic.category_label`
  - `custom_topic.source_label`, `custom_topic.source_placeholder`
  - `custom_topic.content_label`, `custom_topic.content_placeholder`
  - `custom_topic.problematique_label`, `custom_topic.problematique_placeholder`
  - `custom_topic.words_count`, `custom_topic.words_warning`, `custom_topic.words_optimal`
  - `custom_topic.start_btn`, `custom_topic.cancel_btn`, `custom_topic.delete_btn`
- Add integration test cases to `tests/integration/ExamFlowStateMachine.test.js` or `CustomTopicExamFlow.test.js`.
- Execute full test suite (`node --test tests/unit/*.test.js tests/integration/*.test.js`).

---

## 3. Constitution Alignment & Quality Gates

1. **Deterministic & CEFR-Aligned**: Custom topics adhere to standard DELF B2 structure (minimum word count, problématique, category).
2. **Audio & Exam State Machine Decoupled**: Custom documents adhere to the identical schema consumed by `ExamFlowStateMachine`.
3. **No External Framework Dependencies**: Pure Vanilla CSS and vanilla JS DOM components.
4. **Resilience**: Custom topics survive reloads via LocalStorage.
