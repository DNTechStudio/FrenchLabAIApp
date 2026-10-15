# Feature Specification: User-Defined Custom Topics in Test Simulation Mode

**Feature**: `005-custom-topic-input`  
**Target Release**: v1.4.0  
**Status**: DRAFT  
**Author**: Antigravity  

---

## 1. Executive Summary & Educational Rationale

In the official DELF B2 *Production Orale* examination, candidates are evaluated on their ability to defend a reasoned personal stance based on a short trigger document (*document déclencheur*, ~150–250 words) dealing with a contemporary societal debate.

Currently, the simulator provides a curated catalog of standard trigger documents (`TRIGGER_DOCUMENTS`) and a "Tirage au sort" (random draw) function. However, exam candidates preparing for specific real-world topics (e.g., articles from *Le Monde*, *Courrier International*, university assignments, or recent news) require the flexibility to input their own custom topics.

This feature adds a prominent action button in Test Simulation Mode (`SelectionView`) that smoothly reveals an **Inline Expandable Form**. Candidates can compose or paste their custom article text, assign metadata (title, category, source, problématique), and immediately start the full 4-stage DELF B2 exam workflow (Preparation → Monologue → Debate → Evaluation) with their custom document.

---

## 2. User Stories & Acceptance Criteria

### User Story 1 (P1): Toggle Inline Custom Topic Creation Form
> **As an** exam candidate in Test Simulation Mode,  
> **I want to** click a dedicated "Sujet personnalisé" button on the topic selection view,  
> **So that** an inline form smoothly expands directly above the catalog grid without disrupting my view.

- **Acceptance Criteria**:
  - `US1.1`: A secondary/accent action button `✏️ Sujet personnalisé` is displayed in the Hero banner of `SelectionView` adjacent to `🎲 Tirage au sort`.
  - `US1.2`: Clicking the button toggles an inline expandable card container with a smooth CSS transition (no jarring page jumps or full-screen overlays).
  - `US1.3`: The form includes an "Annuler" (Cancel / Close) button to collapse the form at any moment.

---

### User Story 2 (P1): Custom Document Form Fields & Live Word Count
> **As an** exam candidate,  
> **I want to** enter the article details (title, category, text content, source, and debate problématique),  
> **So that** my custom topic conforms to the authentic DELF B2 trigger document standard.

- **Acceptance Criteria**:
  - `US2.1`: The form provides structured fields:
    - **Titre** (`title`): Text input (Required, min 5 characters).
    - **Thématique / Domaine** (`category`): Select or custom input (Default options: *Société*, *Travail*, *Éducation*, *Écologie*, *Santé*, *Technologie*, *Culture*).
    - **Source et date** (`source`): Text input (Optional, defaults to *"Document personnalisé du candidat"*).
    - **Texte déclencheur** (`content`): Multi-line textarea (Required, minimum 30 words).
    - **Problématique / Thèse** (`problematique`): Text input (Required or auto-derived from content).
  - `US2.2`: A dynamic word counter displays the current word count of the textarea with color-coded guidance:
    - `< 30 words`: Warning / Invalid state (too short for authentic DELF preparation).
    - `30–350 words`: Valid state (optimal DELF B2 range is ~150–250 words).
    - `> 350 words`: Notice advising concise argumentative triggers.
  - `US2.3`: Submit button ("Démarrer l'épreuve avec ce sujet") is disabled or provides clear inline validation error hints if required fields are missing or word count is below threshold.

---

### User Story 3 (P1): Seamless Exam Flow Integration
> **As an** exam candidate,  
> **I want to** start the exam directly with my custom topic,  
> **So that** my entire preparation, monologue timer, examiner debate counter-arguments, and evaluation reflect my custom subject.

- **Acceptance Criteria**:
  - `US3.1`: Submitting the form packages the inputs into a conformant `TriggerDocument` object:
    ```javascript
    {
      id: `custom-${Date.now()}`,
      title: string,
      category: string,
      source: string,
      wordCount: number,
      content: string,
      problematique: string,
      isCustom: true
    }
    ```
  - `US3.2`: Invokes `onSelectDocument(customDoc)`, transitioning immediately to the Preparation Phase (`PrepView`).
  - `US3.3`: `DocumentCard` renders the custom document with a distinctive `🎨 Personnalisé` badge.
  - `US3.4`: In the Debate Phase, `DebateEngine` extracts themes and keywords from `customDoc.problematique` and `customDoc.content` to produce targeted examiner counter-questions.

---

### User Story 4 (P2): Local Storage Persistence & Custom Topics Library
> **As an** exam candidate,  
> **I want** my custom topics to be saved locally on my device,  
> **So that** I can reuse them for repeated practice sessions without re-typing.

- **Acceptance Criteria**:
  - `US4.1`: Upon exam launch (or optional "Enregistrer" action), custom topics are appended to `localStorage` under `delf_speaking_custom_topics`.
  - `US4.2`: A dedicated category tab or filter `✏️ Mes Sujets` appears in `SelectionView` if any custom documents exist.
  - `US4.3`: Each saved custom card provides a quick "Supprimer" (Delete) action to clean up unwanted custom topics.

---

### User Story 5 (P2): Multilingual Localization Across All 4 Locales
> **As an** international candidate (English, Vietnamese, Chinese, or French speaker),  
> **I want** all form labels, placeholders, buttons, and validation warnings localized in my chosen interface language,  
> **So that** I can easily compose my topic regardless of my native language.

- **Acceptance Criteria**:
  - `US5.1`: Localized translation keys added to `fr.js`, `en.js`, `zh.js`, and `vi.js`:
    - `selection.custom_topic_btn`
    - `custom_topic.title_label`, `custom_topic.title_placeholder`
    - `custom_topic.category_label`
    - `custom_topic.source_label`, `custom_topic.source_placeholder`
    - `custom_topic.content_label`, `custom_topic.content_placeholder`
    - `custom_topic.problematique_label`, `custom_topic.problematique_placeholder`
    - `custom_topic.words_count`, `custom_topic.words_recommended`
    - `custom_topic.start_btn`, `custom_topic.cancel_btn`
    - `custom_topic.err_missing_title`, `custom_topic.err_too_short`
    - `custom_topic.saved_tab`

---

## 3. Data Model & Architecture

### Custom Document Schema
```typescript
interface CustomTriggerDocument {
  id: string;               // e.g. "custom-1790632000000"
  title: string;            // e.g. "L'impact de l'IA sur l'enseignement supérieur"
  category: string;         // e.g. "Éducation" | "Société" | ...
  source: string;           // e.g. "Le Monde Campus, Septembre 2026"
  wordCount: number;        // e.g. 185
  content: string;          // Full trigger article text
  problematique: string;    // e.g. "L'intelligence artificielle menace-t-elle la réflexion critique des étudiants ?"
  isCustom: true;           // Identifies user-generated document
  createdAt: number;        // Timestamp
}
```

---

## 4. Non-Functional Requirements & Design Aesthetics

1. **Inline Smooth Expansion**: An animated collapsible panel (`max-height` transition and subtle opacity fade-in) using pure Vanilla CSS.
2. **Design Tokens**: Standard glassmorphism (`glass-panel`), accent border highlights, and dark mode color contrast meeting WCAG AA.
3. **No External Libraries**: 100% pure vanilla JavaScript DOM component, zero extra runtime dependencies.
4. **State Resilience**: Draft content in the form is preserved in memory or `sessionStorage` during mode toggling.
5. **Zero Breaking Changes**: Fully compatible with existing `ExamFlowStateMachine`, `PrepView`, `DebateEngine`, and `DelfB2EvaluationEngine`.
